# ACT backend setup

ACT now uses Firebase Authentication and Cloud Firestore directly from the web app.
The previous Express/Railway server is not needed for login, signup, client accounts,
watchlists, holdings, virtual trades, order history, or saved price targets.

## Active project

- Project: `stocks-portfolio-manager-1234`
- Default Firestore database, region `eur3`
- Email/password authentication enabled
- The public web configuration in `src/firebaseConfig.js` selects this project by default.
- `firestore.rules` contains the deployed account-isolation and schema rules.

Each account stores data under its Firebase Auth UID:

| Path | Data |
| --- | --- |
| `users/{uid}` | Name and email profile; no passwords or auth tokens |
| `users/{uid}/clients/{clientId}` | Client name and virtual cash in integer cents |
| `users/{uid}/clients/{clientId}/watchlist/{symbol}` | Saved stock symbols |
| `users/{uid}/clients/{clientId}/holdings/{symbol}` | Share quantities and purchase cost basis |
| `users/{uid}/clients/{clientId}/orders/{orderId}` | Buy/sell history |
| `users/{uid}/alerts/{alertId}` | Saved price targets |

A new client starts with $100,000 USD in practice cash. Trades update cash, holdings,
and an order in a Firestore transaction. This is a private virtual trading sandbox:
prices come from the browser's market-data request, and an account owner can modify
their own practice data. These balances are not suitable for real money, competitive
rankings, or trusted accounting without a server-authoritative trade service.

## Run locally

From `Frontend`, run `npm start`, then open `http://localhost:3000`.
Create an account, create a client, open its dashboard, and add stocks to its watchlist.
Old Firebase accounts and records have not been migrated because the original project
is inaccessible. Users need to register in this project.

Optional environment overrides are documented in `.env.example`. Copy it to
`.env.local`, populate all Firebase fields together if changing projects, and restart
the dev server. Never put service-account keys or Firebase Admin credentials in the
frontend. `REACT_APP_AUTH_MODE` and the old Railway URL are no longer used.

## Deploy

The frontend still builds with `npm run build` for Netlify. Source changes must be
pushed and the Netlify site rebuilt before the public website gets these fixes.
The default configuration works without adding environment variables; check for and
remove any old Firebase project overrides in Netlify's environment settings.
`public/_redirects` supports direct React Router URLs.

Rules were published to the active project during setup. Future changes can be
published from Firebase Console > Firestore > Rules, using `firestore.rules`, or with
an authenticated Firebase CLI: `firebase deploy --only firestore:rules`.
Never replace them with an unrestricted `allow read, write: if true` rule.

## External services

- Quotes, news, and IPO data use Finnhub. The current public client key was verified;
  set `REACT_APP_FINNHUB_API_KEY` to your own browser-compatible key when replacing it.
  Client-side keys are visible to visitors and subject to provider quotas.
- Charts use TradingView widgets.
- The previous AI Railway service is offline. `REACT_APP_AI_API_URL` may point to a
  replacement service accepting `{ "stock_ticker": "AAPL" }` and returning
  `{ "recommendation": "...", "reasoning": "..." }`. Configure CORS for your site.
  Until connected, the UI reports that AI recommendations are unavailable.
- Price alerts are persisted targets. Background monitoring/email/push notification
  delivery is not configured.

## Verification

Run `CI=true npm test -- --watchAll=false --runInBand` and `npm run build`.
Live setup verification also exercised signup/login, profile persistence, client
creation, watchlists, atomic virtual buys/sells, order history, alerts, rejected
overselling, and denied cross-user and signed-out access in this Firebase project.
Synthetic verification accounts are separate from real users and contain only test
practice trades. No original account records were recovered or fabricated.
