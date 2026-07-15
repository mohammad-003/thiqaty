# Thiqaty

Thiqaty is a personal, single-user, local-only encrypted life & vault management app built with React Native and Expo. 

It is designed to be an offline-first productivity and vault app with absolutely no network connectivity, cloud sync, or third-party analytics. All data is encrypted at rest using an embedded Realm database with keys stored securely in the device Keychain/Keystore.

## Features
- **Modules**: Dashboard, Tasks, Freelance Pipeline, Company Work, Interview/Exam Prep, Notes, Finance, Password Vault, Reminders, Settings.
- **Security**: 
  - AES-256 encrypted Realm database.
  - Encryption key generated on first launch and stored securely.
  - Step-up biometric authentication for sensitive modules like the Password Vault.
  - PIN fallback with Argon2id/PBKDF2 hashing.
  - Encrypted file attachments.
  - Application-level auto-lock and FLAG_SECURE (screenshot prevention on Android).

## Project Structure
- `src/app`: App bootstrap and providers.
- `src/navigation`: App navigators and auth gate flow.
- `src/screens`: UI screens for each module.
- `src/store`: Zustand state management (e.g., authStore).
- `src/db`: Realm schemas and local CRUD wrappers.
- `src/services`: Core services (auth, encryption, notifications, fileStorage).
- `src/types`, `src/utils`, `src/constants`: Shared config and helpers.

## Running the App
- `npm run android`
- `npm run ios`

*Note: Ensure you are testing on physical devices to properly verify biometrics and encryption capabilities.*
