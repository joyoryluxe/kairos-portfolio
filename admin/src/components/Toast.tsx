'use client';

import { useState } from 'react';

interface ToastItem { id: number; msg: string; type: 'success' | 'error'; }

let toastFn: ((msg: string, type?: 'success' | 'error') => void) | null = null;

export function useToast() {
  return {
    toast: (msg: string, type: 'success' | 'error' = 'success') => {
      toastFn?.(msg, type);
    },
  };
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  toastFn = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
