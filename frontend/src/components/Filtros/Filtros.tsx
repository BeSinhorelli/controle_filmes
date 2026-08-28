import React from 'react';
import './Filtros.css';

interface FiltrosProps {
  genero: string;
  status: string;
  onChange: (filtros: { genero: string; status: string }) => void;
}

const Filtros: React.FC<FiltrosProps> = ({ genero, status, onChange }) => {
  const generos = [
    'Todos',
    'Ação',
    'Aventura',
    'Comédia',
    'Drama',
    'Ficção Científica',
    'Romance',
    'Terror',
    'Suspense',
    'Animação',
    'Documentário'
  ];

  const statuses = [
    { value: '', label: 'Todos os Status' },
    { value: 'QUERO_ASSISTIR', label: 'Quero Assistir' },
    { value: 'ASSISTINDO', label: 'Assistindo' },
    { value: 'ASSISTIDO', label: 'Assistido' }
  ];

  return (
    <div className="filtros-container">
      <div className="filtro-group">
        <label className="filtro-label">Gênero</label>
        <select
          className="filtro-select"
          value={genero}
          onChange={(e) => onChange({ genero: e.target.value, status })}
        >
          {generos.map(g => (
            <option key={g} value={g === 'Todos' ? '' : g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro-group">
        <label className="filtro-label">Status</label>
        <select
          className="filtro-select"
          value={status}
          onChange={(e) => onChange({ genero, status: e.target.value })}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filtros;