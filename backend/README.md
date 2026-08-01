# Sikka Backend

Backend for the Sikka earning app — users watch ads, complete tasks, refer friends,
and withdraw real money via JazzCash/EasyPaisa.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
3. Make sure MongoDB is running locally, or use a MongoDB Atlas connection string.
4. Start the server:
   ```
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

## API Reference

### Auth
| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | `name, phone, password, referralCode?` | Rs. 10 signup bonus; referrer gets Rs. 20 |
| POST | `/api/auth/login` | `phone, password` | Returns JWT token |

All routes below require header: `Authorization: Bearer <token>`

### Wallet
| Method | Route | Body | Notes |
|---|---|---|---|
| GET | `/api/wallet/balance` | — | Current balance |
| GET | `/api/wallet/history` | — | Last 100 transactions |
| POST | `/api/wallet/earn` | `type: "ad"\|"task", amount, note?` | Enforces daily earning cap (`DAILY_EARN_LIMIT`) |

### Withdrawals
| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/api/withdraw` | `amount, method: "jazzcash"\|"easypaisa", accountNumber, accountName` | Enforces `MIN_WITHDRAWAL`; deducts balance immediately |
| GET | `/api/withdraw/history` | — | User's withdrawal requests + status |

### Referral
| Method | Route | Notes |
|---|---|---|
| GET | `/api/referral/me` | Your referral code + total referrals |
| GET | `/api/referral/list` | Everyone you referred |

## Fraud control (basic, built-in)

- **Daily earning cap** (`DAILY_EARN_LIMIT` in `.env`) — stops a single account from
  farming unlimited ad/task rewards in one day.
- **Rate limiting** — 60 requests/minute per IP on the whole API.
- **Minimum withdrawal** (`MIN_WITHDRAWAL`) — avoids spammy tiny withdrawal requests.
- **Withdrawal status stays "pending"** until you manually approve and pay it —
  recommended for the first weeks/months until you trust the volume, then you can
  automate payouts through JazzCash/EasyPaisa merchant APIs.

## Suggested next steps

1. Wire up the app's screens (already designed) to these endpoints.
2. Integrate Google AdMob rewarded ads on the app side — when an ad finishes,
   call `POST /api/wallet/earn` with `type: "ad"`.
3. For "tasks", integrate an offerwall network (e.g. Ayet Studios, Adjoe) — their
   postback/webhook can call `POST /api/wallet/earn` with `type: "task"` server-to-server.
4. Build a small admin panel (even a simple protected page) to review and approve
   pending withdrawals from the `Withdrawal` collection.
