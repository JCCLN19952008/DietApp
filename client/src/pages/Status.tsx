import { useEffect, useState } from 'react';

type Status = 'checking' | 'ok' | 'error';

export default function StatusPage() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    fetch('/api/ping')
      .then(res => res.json())
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  const dot: Record<Status, string> = {
    checking: 'bg-yellow-400 animate-pulse',
    ok:       'bg-green-500',
    error:    'bg-red-500',
  };

  const label: Record<Status, string> = {
    checking: 'Connecting to API…',
    ok:       'API connected',
    error:    'API unreachable — is the server running?',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 bg-gray-900">
      <div className="text-center">
        <div className="text-5xl mb-3">🥗</div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">
          Dietetics App
        </h1>
        <p className="mt-2 text-gray-400 text-sm">API Status Check</p>
      </div>
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm">
        <span className={`w-2 h-2 rounded-full ${dot[status]}`} />
        <span className="text-gray-300">{label[status]}</span>
      </div>
    </div>
  );
}