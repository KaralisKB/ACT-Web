export const STARTING_BALANCE_CENTS = 10000000;

// Virtual trading only: calculate in cents, and commit cash/holdings/order together.
export function calculateTrade({ balanceCents, holding, side, quantity, price }) {
  quantity = Number(quantity);
  price = Number(price);
  if (!['BUY', 'SELL'].includes(side)) throw new Error('Choose a buy or sell transaction.');
  if (!Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Enter a positive whole number of shares.');
  if (!Number.isFinite(price) || price <= 0) throw new Error('A valid market price is required.');
  const totalCents = Math.round(quantity * price * 100);
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0 || !Number.isSafeInteger(balanceCents) || balanceCents < 0) {
    throw new Error('The trade amount is invalid.');
  }
  const oldQuantity = holding?.quantity || 0;
  const oldCost = holding?.costBasisCents ?? Math.round(oldQuantity * (holding?.averagePrice || 0) * 100);
  if (!Number.isSafeInteger(oldQuantity) || oldQuantity < 0 || !Number.isSafeInteger(oldCost) || oldCost < 0) throw new Error('The stored holding is invalid.');
  if (side === 'BUY' && totalCents > balanceCents) throw new Error('Not enough virtual cash for this purchase.');
  if (side === 'SELL' && quantity > oldQuantity) throw new Error('You cannot sell more shares than this client owns.');
  const newQuantity = side === 'BUY' ? oldQuantity + quantity : oldQuantity - quantity;
  if (!Number.isSafeInteger(newQuantity)) throw new Error('The share quantity is too large.');
  const costBasisCents = side === 'BUY' ? oldCost + totalCents : Math.round(oldCost * newQuantity / oldQuantity);
  const newBalance = balanceCents + (side === 'BUY' ? -totalCents : totalCents);
  if (!Number.isSafeInteger(newBalance) || newBalance >= 9000000000000000 || !Number.isSafeInteger(costBasisCents)) throw new Error('The trade amount is too large.');
  return {
    balanceCents: newBalance,
    quantity: newQuantity,
    costBasisCents,
    averagePrice: newQuantity ? costBasisCents / newQuantity / 100 : 0,
    totalCents,
  };
}
