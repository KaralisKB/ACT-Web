import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { calculateTrade, STARTING_BALANCE_CENTS } from './tradeMath';

function fail(message, status = 400) {
  const error = new Error(message);
  error.response = { status, data: { error: message } };
  throw error;
}

async function owner(userId) {
  await auth.authStateReady();
  const uid = auth.currentUser?.uid;
  if (!uid) fail('Please log in to continue.', 401);
  if (userId && userId !== uid) fail('This account does not belong to the signed-in user.', 403);
  return uid;
}

function id(value, label) {
  const result = typeof value === 'string' ? value : value?.id;
  if (typeof result !== 'string' || !result || result.includes('/') || result === 'undefined' || result === 'null') fail(`Select a valid ${label}.`);
  return result;
}

function ticker(value) {
  const symbol = String(value || '').trim().toUpperCase();
  if (!/^[A-Z0-9][A-Z0-9.^:_/-]{0,39}$/.test(symbol)) fail('Enter a valid stock symbol.');
  return symbol;
}

const clientRef = (uid, clientId) => doc(db, 'users', uid, 'clients', id(clientId, 'client'));
const records = snapshot => snapshot.docs.map(record => ({ ...record.data(), id: record.id }));

async function existingClient(uid, clientId) {
  const reference = clientRef(uid, clientId);
  const snapshot = await getDoc(reference);
  if (!snapshot.exists()) fail('This client could not be found. Please select another client.', 404);
  return { reference, data: snapshot.data() };
}

export async function firebaseRequest(method, path, payload = {}) {
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const resource = parts[1];
  if (resource === 'clients' && method === 'GET') {
    const uid = await owner(parts[2]);
    return { clients: records(await getDocs(collection(db, 'users', uid, 'clients'))) };
  }
  if (resource === 'clients' && parts[2] === 'add' && method === 'POST') {
    const uid = await owner(parts[3]);
    const name = String(payload.clientName || '').trim();
    if (!name || name.length > 100) fail('Enter a client name of 1–100 characters.');
    const data = { name, balanceCents: STARTING_BALANCE_CENTS, createdAt: serverTimestamp() };
    const reference = await addDoc(collection(db, 'users', uid, 'clients'), data);
    return { client: { ...data, id: reference.id }, message: 'Virtual client account created.' };
  }
  if (resource === 'client' && parts[2] === 'balance' && method === 'GET') {
    const uid = await owner(parts[3]);
    const { data } = await existingClient(uid, parts[4]);
    return { balance: data.balanceCents / 100, clientName: data.name };
  }
  if (['portfolio', 'orders', 'watchlist'].includes(resource) && method === 'GET') {
    const uid = await owner(parts[2]);
    await existingClient(uid, parts[3]);
    const section = resource === 'portfolio' ? 'holdings' : resource;
    const data = records(await getDocs(collection(clientRef(uid, parts[3]), section)));
    if (resource === 'watchlist') return data;
    if (resource === 'orders') data.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
    return { [resource]: data };
  }
  if (resource === 'watchlist' && ['POST', 'DELETE'].includes(method)) {
    const uid = await owner(payload.userId);
    const { reference } = await existingClient(uid, payload.clientId);
    const symbol = ticker(payload.stockTicker);
    const stockRef = doc(reference, 'watchlist', encodeURIComponent(symbol));
    if (method === 'POST') await setDoc(stockRef, { ticker: symbol, createdAt: serverTimestamp() });
    else await deleteDoc(stockRef);
    return { message: method === 'POST' ? 'Stock added to watchlist.' : 'Stock removed from watchlist.' };
  }
  if (resource === 'alerts') {
    const uid = await owner(method === 'GET' ? parts[2] : payload.userId);
    const alerts = collection(db, 'users', uid, 'alerts');
    if (method === 'GET') return { alerts: records(await getDocs(alerts)) };
    if (method === 'POST') {
      const targetPrice = Number(payload.targetPrice);
      if (!Number.isFinite(targetPrice) || targetPrice <= 0 || !['above', 'below'].includes(payload.condition)) fail('Enter a valid alert price and condition.');
      const reference = await addDoc(alerts, { stockSymbol: ticker(payload.stockSymbol), targetPrice, condition: payload.condition, createdAt: serverTimestamp() });
      return { id: reference.id, message: 'Price alert saved.' };
    }
    if (method === 'DELETE') {
      await deleteDoc(doc(alerts, id(payload.alertId, 'alert')));
      return { message: 'Price alert removed.' };
    }
  }
  if (['buy', 'sell', 'transaction'].includes(resource) && method === 'POST') {
    const uid = await owner(payload.userId);
    const reference = clientRef(uid, payload.clientId);
    const symbol = ticker(payload.symbol);
    const side = resource === 'transaction' ? String(payload.type || '').toUpperCase() : resource.toUpperCase();
    const holdingRef = doc(reference, 'holdings', encodeURIComponent(symbol));
    const orderRef = doc(collection(reference, 'orders'));
    await runTransaction(db, async transaction => {
      const client = await transaction.get(reference);
      const holding = await transaction.get(holdingRef);
      if (!client.exists()) fail('This client could not be found.', 404);
      const result = calculateTrade({ balanceCents: client.data().balanceCents, holding: holding.exists() ? holding.data() : null, side, quantity: payload.quantity, price: payload.price });
      transaction.update(reference, { balanceCents: result.balanceCents });
      if (result.quantity) {
        transaction.set(holdingRef, { symbol, name: String(payload.name || symbol).slice(0, 200), quantity: result.quantity, averagePrice: result.averagePrice, costBasisCents: result.costBasisCents });
      } else transaction.delete(holdingRef);
      transaction.set(orderRef, {
        type: side, symbol, name: String(payload.name || symbol).slice(0, 200), quantity: Number(payload.quantity), price: Number(payload.price),
        totalCost: side === 'BUY' ? result.totalCents / 100 : 0,
        totalEarnings: side === 'SELL' ? result.totalCents / 100 : 0,
        date: serverTimestamp(),
      });
    });
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('act:balance-changed'));
    return { message: side === 'BUY' ? 'Virtual stock purchase completed.' : 'Virtual stock sale completed.' };
  }
  fail('This feature is not connected yet.', 404);
}
