import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "buddybudget_session";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function saveSession(user) {
  const payload = {
    user,
    expiresAt: Date.now() + THIRTY_DAYS_MS,
  };

  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(payload));
}

export async function getSession() {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      await clearSession();
      return null;
    }

    return parsed.user || null;
  } catch (err) {
    await clearSession();
    return null;
  }
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}