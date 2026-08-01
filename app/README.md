# Sikka App (React Native / Expo)

## Setup

1. Extract this folder on your PC, open it in VS Code.
2. Install dependencies:
   ```
   npm install
   ```
3. **Important:** open `api/client.js` and replace the IP in `BASE_URL` with your
   PC's local IP (run `ipconfig` on Windows, look for "IPv4 Address" under your
   WiFi adapter). Your phone and PC must be on the same WiFi network.
4. Make sure your `sikka-backend` is running (`npm run dev`).
5. Start the app:
   ```
   npx expo start
   ```
6. Install **Expo Go** from the Play Store on your phone, scan the QR code
   shown in the terminal — the app opens live on your phone.

## Screens included
- Login / Register (connects to your backend's `/api/auth`)
- Home — balance, watch ads, do tasks, refer & earn, history (Watch Ads/Do Tasks
  are simulated for now — wire up real AdMob/offerwall SDKs later)
- Withdraw — JazzCash/EasyPaisa request form
- Referral — share your code, see who you referred
- History — full transaction list

## Next steps
- Replace the "Simulate finished ad" button in `HomeScreen.js` with a real
  Google AdMob rewarded ad SDK call.
- Replace the task simulation with a real offerwall SDK (Ayet Studios, Adjoe, etc).
- Build an admin panel to approve withdrawals in the backend.
