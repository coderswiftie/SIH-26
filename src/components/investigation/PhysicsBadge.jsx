import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const PhysicsBadge = ({ status }) => {
  if (status === 'PASS') {
    return (
      <span className="badge badge-green">
        <CheckCircle2 size={11} /> PASS
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className="badge badge-amber">
        <Clock size={11} /> PENDING
      </span>
    );
  }
  return (
    <span className="badge badge-red">
      <AlertTriangle size={11} /> FLAGGED
    </span>
  );
};
