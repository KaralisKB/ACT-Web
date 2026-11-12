import { calculateTrade, STARTING_BALANCE_CENTS } from './tradeMath';
const trade = overrides => calculateTrade({ balanceCents: STARTING_BALANCE_CENTS, side: 'BUY', quantity: 2, price: 100, ...overrides });

test('new purchase debits cents and sets cost basis', () => {
  expect(trade()).toEqual({ balanceCents: 9980000, quantity: 2, costBasisCents: 20000, averagePrice: 100, totalCents: 20000 });
});
test('repeat purchase calculates weighted average rather than adding averages', () => {
  expect(trade({ holding: { quantity: 2, costBasisCents: 10000 }, quantity: 1, price: 200 })).toMatchObject({ quantity: 3, costBasisCents: 30000, averagePrice: 100 });
});
test('partial sale retains proportional cost basis and credits sale proceeds', () => {
  expect(trade({ side: 'SELL', holding: { quantity: 3, costBasisCents: 30000 }, quantity: 1, price: 120 })).toMatchObject({ balanceCents: 10012000, quantity: 2, costBasisCents: 20000, averagePrice: 100 });
});
test('full sale leaves zero shares and cost basis', () => {
  expect(trade({ side: 'SELL', holding: { quantity: 2, costBasisCents: 20000 } })).toMatchObject({ quantity: 0, costBasisCents: 0, averagePrice: 0 });
});
test('decimal quote prices round the whole trade to cents', () => {
  expect(trade({ quantity: 3, price: 10.1234 })).toMatchObject({ totalCents: 3037, balanceCents: STARTING_BALANCE_CENTS - 3037 });
});
test('insufficient virtual cash and overselling fail before any writes', () => {
  expect(() => trade({ balanceCents: 19999 })).toThrow('Not enough virtual cash');
  expect(() => trade({ side: 'SELL' })).toThrow('cannot sell more');
});
test.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid quantity %s', quantity => {
  expect(() => trade({ quantity })).toThrow();
});
test.each([0, -1, NaN, Infinity])('rejects invalid prices %s', price => {
  expect(() => trade({ price })).toThrow();
});
test('rejects invalid sides, stored holdings, and unsafe currency values', () => {
  expect(() => trade({ side: 'OTHER' })).toThrow();
  expect(() => trade({ holding: { quantity: -1, costBasisCents: 1 } })).toThrow();
  expect(() => trade({ price: Number.MAX_SAFE_INTEGER })).toThrow();
  expect(() => trade({ side: 'SELL', balanceCents: Number.MAX_SAFE_INTEGER, holding: { quantity: 2, costBasisCents: 20000 } })).toThrow();
});
