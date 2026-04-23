import { useEffect, useState } from 'react';

type Status = 'checking' | 'ok' | 'error';

export default function Home() {
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">

      {/* Logo / title */}
      <div className="text-center">
        <div className="text-5xl mb-3">🥗</div>
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Dietetics App
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Day 1 scaffold · React + TypeScript + Tailwind
        </p>
      </div>

      {/* API status pill */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm shadow-sm">
        <span className={`w-2 h-2 rounded-full ${dot[status]}`} />
        <span className="text-gray-600">{label[status]}</span>
      </div>

      {/* Next steps */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-sm w-full shadow-sm">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Up next — Day 2
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            'POST /api/auth/register',
            'POST /api/auth/login (returns JWT)',
            'Login + Register pages',
            'AuthContext + PrivateRoute',
          ].map(item => (
            <li key={item} className="flex gap-2">
              <span className="text-gray-300">–</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
