import React from 'react';
import './Pesquisa.css';

interface PesquisaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Pesquisa: React.FC<PesquisaProps> = ({ 
  value, 
  onChange, 
  placeholder = "Pesquisar por título ou diretor..." 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A pesquisa já é feita em tempo real com o onChange
  };

  return (
    <form className="pesquisa-container" onSubmit={handleSubmit}>
      <div className="pesquisa-wrapper">
        <span className="pesquisa-icon">🔍</span>
        <input
          type="text"
          className="pesquisa-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="pesquisa-clear"
            onClick={() => onChange('')}
            aria-label="Limpar pesquisa"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
};

export default Pesquisa;