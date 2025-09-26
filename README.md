# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Using live Firebase services (no emulators)

Set the following environment variables (e.g., in `.env.local`) to point the app to your Firebase project. The app will use live Firebase services by default unless `FIREBASE_USE_EMULATORS=true` is set.

Required variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional:

- `FIREBASE_USE_EMULATORS` – set to `true` to use local emulators instead of live services.

After setting variables, run:

```bash
npm install
npm run dev
```
