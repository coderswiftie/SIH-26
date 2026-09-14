import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ShieldAlert, X } from 'lucide-react';

export const Toast = () => {
  const { toast, setToast } = useMission();

  if (!toast) return null;

  return (
    <div className={`toast-banner toast-${toast.type || 'info'} font-mono`}>
      <ShieldAlert size={16} className="toast-icon" />
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => setToast(null)}>
        <X size={12} />
      </button>

      <style>{`
        .toast-banner {
          position: fixed;
          top: 68px;
          right: 356px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          background: rgba(6, 19, 28, 0.95);
          border: 1px solid var(--amber-warning);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 209, 102, 0.3);
          color: var(--text-bright);
          font-size: 12px;
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        .toast-icon {
          color: var(--amber-warning);
        }
        .toast-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }
        .toast-close:hover {
          color: var(--text-bright);
        }
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
