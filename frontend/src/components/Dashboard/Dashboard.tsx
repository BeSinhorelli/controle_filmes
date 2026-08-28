import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  counts: {
    total: number;
    queroAssistir: number;
    assistindo: number;
    assistido: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ counts }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="dashboard-icon">🎬</div>
        <div className="dashboard-info">
          <div className="dashboard-number">{counts.total}</div>
          <div className="dashboard-label">Total de Filmes</div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">👀</div>
        <div className="dashboard-info">
          <div className="dashboard-number">{counts.queroAssistir}</div>
          <div className="dashboard-label">Quero Assistir</div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">🎥</div>
        <div className="dashboard-info">
          <div className="dashboard-number">{counts.assistindo}</div>
          <div className="dashboard-label">Assistindo</div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">✅</div>
        <div className="dashboard-info">
          <div className="dashboard-number">{counts.assistido}</div>
          <div className="dashboard-label">Assistidos</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;