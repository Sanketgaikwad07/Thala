import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { broadcastNotification } from '@/api/admin';

export function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: () => broadcastNotification(title, body),
    onSuccess: (result) => {
      setLastResult(result.sentTo);
      setTitle('');
      setBody('');
    },
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Broadcast a push notification to every user</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="form-row">
            <label>Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Message</label>
            <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <button className="btn" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending...' : 'Broadcast Notification'}
          </button>
        </form>
        {lastResult !== null && <p style={{ marginTop: 14, fontSize: 13, color: 'var(--primary)' }}>Sent to {lastResult} users.</p>}
      </div>
    </div>
  );
}
