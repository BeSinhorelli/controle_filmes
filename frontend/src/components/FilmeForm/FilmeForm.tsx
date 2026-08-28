import React, { useState, useEffect } from 'react';
import { Filme, Status, FilmeCreateInput, FilmeUpdateInput } from '../../types/filme';
import { filmeApi } from '../../services/api';
import './FilmeForm.css';

interface FilmeFormProps {
  filme?: Filme | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FilmeForm: React.FC<FilmeFormProps> = ({ filme, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FilmeCreateInput>({
    titulo: '',
    diretor: '',
    genero: '',
    ano: new Date().getFullYear(),
    nota: 0,
    status: Status.QUERO_ASSISTIR,
    sinopse: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (filme) {
      setFormData({
        titulo: filme.titulo,
        diretor: filme.diretor,
        genero: filme.genero,
        ano: filme.ano,
        nota: filme.nota,
        status: filme.status,
        sinopse: filme.sinopse
      });
    }
  }, [filme]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.diretor.trim()) newErrors.diretor = 'Diretor é obrigatório';
    if (!formData.genero.trim()) newErrors.genero = 'Gênero é obrigatório';
    if (formData.ano < 1888 || formData.ano > 2100) newErrors.ano = 'Ano inválido';
    if (formData.nota < 0 || formData.nota > 10) newErrors.nota = 'Nota deve ser entre 0 e 10';
    if (!formData.sinopse.trim()) newErrors.sinopse = 'Sinopse é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSubmitting(true);

    try {
      if (filme) {
        // Editar
        const updateData: FilmeUpdateInput = { ...formData };
        await filmeApi.update(filme.id, updateData);
      } else {
        // Criar
        await filmeApi.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      alert('Erro ao salvar filme. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generos = [
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

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{filme ? 'Editar Filme' : 'Adicionar Filme'}</h2>
          <button className="form-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={errors.titulo ? 'error' : ''}
            />
            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="diretor">Diretor *</label>
            <input
              type="text"
              id="diretor"
              name="diretor"
              value={formData.diretor}
              onChange={handleChange}
              className={errors.diretor ? 'error' : ''}
            />
            {errors.diretor && <span className="error-message">{errors.diretor}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genero">Gênero *</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className={errors.genero ? 'error' : ''}
              >
                <option value="">Selecione um gênero</option>
                {generos.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.genero && <span className="error-message">{errors.genero}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ano">Ano *</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                className={errors.ano ? 'error' : ''}
              />
              {errors.ano && <span className="error-message">{errors.ano}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nota">Nota (0-10) *</label>
              <input
                type="number"
                id="nota"
                name="nota"
                step="0.1"
                min="0"
                max="10"
                value={formData.nota}
                onChange={handleChange}
                className={errors.nota ? 'error' : ''}
              />
              {errors.nota && <span className="error-message">{errors.nota}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value={Status.QUERO_ASSISTIR}>Quero Assistir</option>
                <option value={Status.ASSISTINDO}>Assistindo</option>
                <option value={Status.ASSISTIDO}>Assistido</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sinopse">Sinopse *</label>
            <textarea
              id="sinopse"
              name="sinopse"
              rows={4}
              value={formData.sinopse}
              onChange={handleChange}
              className={errors.sinopse ? 'error' : ''}
            />
            {errors.sinopse && <span className="error-message">{errors.sinopse}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Salvando...' : filme ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmeForm;