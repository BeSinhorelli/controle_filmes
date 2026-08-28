import React from 'react';
import { Filme, Status } from '../../types/filme';
import './FilmeCard.css';

interface FilmeCardProps {
  filme: Filme;
  onEdit: (filme: Filme) => void;
  onDelete: (id: number) => void;
}

const FilmeCard: React.FC<FilmeCardProps> = ({ filme, onEdit, onDelete }) => {
  const getStatusLabel = (status: Status) => {
    const labels = {
      [Status.QUERO_ASSISTIR]: 'Quero Assistir',
      [Status.ASSISTINDO]: 'Assistindo',
      [Status.ASSISTIDO]: 'Assistido'
    };
    return labels[status];
  };

  const getStatusColor = (status: Status) => {
    const colors = {
      [Status.QUERO_ASSISTIR]: 'status-quero-assistir',
      [Status.ASSISTINDO]: 'status-assistindo',
      [Status.ASSISTIDO]: 'status-assistido'
    };
    return colors[status];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="filme-card">
      <div className="filme-card-header">
        <h3 className="filme-titulo">{filme.titulo}</h3>
        <span className={`filme-status ${getStatusColor(filme.status)}`}>
          {getStatusLabel(filme.status)}
        </span>
      </div>

      <div className="filme-info">
        <div className="filme-info-row">
          <span className="filme-label">Diretor:</span>
          <span className="filme-value">{filme.diretor}</span>
        </div>
        <div className="filme-info-row">
          <span className="filme-label">Gênero:</span>
          <span className="filme-value">{filme.genero}</span>
        </div>
        <div className="filme-info-row">
          <span className="filme-label">Ano:</span>
          <span className="filme-value">{filme.ano}</span>
        </div>
        <div className="filme-info-row">
          <span className="filme-label">Nota:</span>
          <span className="filme-value filme-nota">{filme.nota}/10</span>
        </div>
        <div className="filme-info-row filme-sinopse">
          <span className="filme-label">Sinopse:</span>
          <span className="filme-value">{filme.sinopse}</span>
        </div>
        <div className="filme-info-row filme-data">
          <span className="filme-label">Cadastrado em:</span>
          <span className="filme-value">{formatDate(filme.createdAt)}</span>
        </div>
      </div>

      <div className="filme-card-actions">
        <button className="btn-edit" onClick={() => onEdit(filme)}>
          ✏️ Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(filme.id)}>
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

export default FilmeCard;