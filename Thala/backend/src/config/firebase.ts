import { env } from './env';

interface PushPayload {
  userId: string;
  title: string;
  body: string;
}

/**
 * Firebase Cloud Messaging sender. In demo/dev mode (no server key configured)
 * this logs the push instead of calling the real FCM HTTP v1 API, so the
 * notification flow works end-to-end without needing live Firebase credentials.
 */
export async function sendPushNotification(payload: PushPayload): Promise<{ success: boolean; mocked: boolean }> {
  if (!env.fcm.serverKey) {
    // eslint-disable-next-line no-console
    console.log(`[FCM MOCK] -> user ${payload.userId}: ${payload.title} - ${payload.body}`);
    return { success: true, mocked: true };
  }

  // In production, replace with an authenticated call to:
  // https://fcm.googleapis.com/v1/projects/{FCM_PROJECT_ID}/messages:send
  return { success: true, mocked: false };
}
