import React from 'react';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PhasePlaceholder({ title, phase = 'Phase 2+' }) {
  return (
    <div className="card placeholder-card">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          <Construction size={40} />
        </div>
        <h2>{title}</h2>
        <p className="placeholder-text">
          This module is part of <strong>{phase}</strong> in the approved development roadmap.
        </p>
        <p className="placeholder-sub">
          Foundation (Phase 1) is currently active. The architecture and schemas are prepared and ready for module activation.
        </p>
        <Link to="/" className="btn-back">
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
