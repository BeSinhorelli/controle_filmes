import React, { useState, useEffect, useCallback } from 'react';
import { filmeApi } from '../../services/api';
import { Filme, Status } from '../../types/filme';
import Dashboard from '../../components/Dashboard/Dashboard';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import Filtros from '../../components/Filtros/Filtros';
import FilmeCard from '../../components/FilmeCard/FilmeCard.tsx';
import FilmeForm from '../../components/FilmeForm/FilmeForm';
import './Home.css';

// Hook de debounce personalizado
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Home: React.FC = () => {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFilme, setEditingFilme] = useState<Filme | null>(null);
  const [filtros, setFiltros] = useState({
    busca: '',
    genero: '',
    status: ''
  });

  const debouncedBusca = useDebounce(filtros.busca, 500);

  // Função para carregar filmes
  const carregarFilmes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      
      if (debouncedBusca && debouncedBusca.trim() !== '') {
        params.busca = debouncedBusca.trim();
      }
      if (filtros.genero && filtros.genero !== '') {
        params.genero = filtros.genero;
      }
      if (filtros.status && filtros.status !== '') {
        params.status = filtros.status;
      }
      
      console.log('📤 Parâmetros da requisição:', params);
      
      const data = await filmeApi.getAll(params);
      console.log('📥 Filmes carregados:', data.length);
      
      setFilmes(data);
    } catch (err) {
      console.error('❌ Erro ao carregar filmes:', err);
      setError('Erro ao carregar filmes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [debouncedBusca, filtros.genero, filtros.status]);

  // Carregar filmes quando os filtros mudarem
  useEffect(() => {
    carregarFilmes();
  }, [carregarFilmes]);

  // Handlers
  const handleAddFilme = () => {
    setEditingFilme(null);
    setShowForm(true);
  };

  const handleEditFilme = (filme: Filme) => {
    setEditingFilme(filme);
    setShowForm(true);
  };

  const handleDeleteFilme = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await filmeApi.delete(id);
        await carregarFilmes();
      } catch (err) {
        console.error('❌ Erro ao excluir filme:', err);
        alert('Erro ao excluir filme. Tente novamente.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingFilme(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    carregarFilmes();
  };

  const handleFiltroChange = (novosFiltros: { genero?: string; status?: string }) => {
    setFiltros(prev => ({
      ...prev,
      ...novosFiltros
    }));
  };

  const handleBuscaChange = (busca: string) => {
    setFiltros(prev => ({
      ...prev,
      busca
    }));
  };

  // Calcular estatísticas
  const getStatusCounts = () => {
    const counts = {
      total: filmes.length,
      queroAssistir: 0,
      assistindo: 0,
      assistido: 0
    };

    filmes.forEach(filme => {
      switch (filme.status) {
        case Status.QUERO_ASSISTIR:
          counts.queroAssistir++;
          break;
        case Status.ASSISTINDO:
          counts.assistindo++;
          break;
        case Status.ASSISTIDO:
          counts.assistido++;
          break;
      }
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando filmes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="btn-retry" onClick={carregarFilmes}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="header">
        <h1>🎬 Controle de Filmes</h1>
        <div className="header-actions">
          <button className="btn-add" onClick={handleAddFilme}>
            + Adicionar Filme
          </button>
        </div>
      </header>

      <Dashboard counts={getStatusCounts()} />

      <div className="filtros-container">
        <Pesquisa 
          value={filtros.busca}
          onChange={handleBuscaChange}
          placeholder="Pesquisar por título ou diretor..."
        />
        <Filtros
          genero={filtros.genero}
          status={filtros.status}
          onChange={handleFiltroChange}
        />
      </div>

      {filmes.length === 0 ? (
        <div className="sem-filmes">
          <div className="sem-filmes-icon">🎥</div>
          <h3>Nenhum filme encontrado</h3>
          <p>
            {filtros.busca || filtros.genero || filtros.status 
              ? 'Tente ajustar os filtros ou a pesquisa' 
              : 'Clique em "Adicionar Filme" para começar!'}
          </p>
        </div>
      ) : (
        <div className="filmes-grid">
          {filmes.map(filme => (
            <FilmeCard
              key={filme.id}
              filme={filme}
              onEdit={handleEditFilme}
              onDelete={handleDeleteFilme}
            />
          ))}
        </div>
      )}

      {showForm && (
        <FilmeForm
          filme={editingFilme}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Home;