import { PrismaClient } from '@prisma/client';
import { FilmeCreateInput, FilmeUpdateInput, Filme } from '../types';

// Singleton do Prisma Client
class PrismaSingleton {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return PrismaSingleton.instance;
  }
}

const prisma = PrismaSingleton.getInstance();

export class FilmeService {
  /**
   * Busca todos os filmes com filtros opcionais
   */
  async findAll(filters?: { busca?: string; genero?: string; status?: string }) {
    try {
      const where: any = {};

      // Busca por título ou diretor (case insensitive)
      if (filters?.busca && filters.busca.trim() !== '') {
        const searchTerm = filters.busca.trim();
        where.OR = [
          { titulo: { contains: searchTerm } },
          { diretor: { contains: searchTerm } }
        ];
      }

      // Filtro por gênero
      if (filters?.genero && filters.genero !== '') {
        where.genero = filters.genero;
      }

      // Filtro por status
      if (filters?.status && filters.status !== '') {
        where.status = filters.status;
      }

      console.log('🔍 Query where:', where);

      const filmes = await prisma.filme.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      console.log(`📊 Encontrados ${filmes.length} filmes`);
      return filmes;
    } catch (error) {
      console.error('❌ Erro no findAll:', error);
      throw new Error('Erro ao buscar filmes');
    }
  }

  /**
   * Busca um filme por ID
   */
  async findById(id: number): Promise<Filme | null> {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID inválido');
      }

      const filme = await prisma.filme.findUnique({
        where: { id }
      });

      if (!filme) {
        console.log(`⚠️ Filme com ID ${id} não encontrado`);
        return null;
      }

      console.log(`✅ Filme encontrado: ${filme.titulo}`);
      return filme;
    } catch (error) {
      console.error(`❌ Erro ao buscar filme ${id}:`, error);
      throw new Error('Erro ao buscar filme');
    }
  }

  /**
   * Cria um novo filme
   */
  async create(data: FilmeCreateInput): Promise<Filme> {
    try {
      // Validações adicionais
      this.validateFilmeData(data);

      const filme = await prisma.filme.create({
        data: {
          titulo: data.titulo.trim(),
          diretor: data.diretor.trim(),
          genero: data.genero.trim(),
          ano: data.ano,
          nota: data.nota,
          status: data.status,
          sinopse: data.sinopse.trim(),
        }
      });

      console.log(`✅ Filme criado: ${filme.titulo} (ID: ${filme.id})`);
      return filme;
    } catch (error) {
      console.error('❌ Erro ao criar filme:', error);
      throw new Error('Erro ao criar filme');
    }
  }

  /**
   * Atualiza um filme existente
   */
  async update(id: number, data: FilmeUpdateInput): Promise<Filme> {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID inválido');
      }

      // Verificar se o filme existe
      const existe = await prisma.filme.findUnique({
        where: { id }
      });

      if (!existe) {
        throw new Error(`Filme com ID ${id} não encontrado`);
      }

      // Validar dados antes de atualizar
      this.validateFilmeData(data);

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (data.titulo) updateData.titulo = data.titulo.trim();
      if (data.diretor) updateData.diretor = data.diretor.trim();
      if (data.genero) updateData.genero = data.genero.trim();
      if (data.ano) updateData.ano = data.ano;
      if (data.nota !== undefined) updateData.nota = data.nota;
      if (data.status) updateData.status = data.status;
      if (data.sinopse) updateData.sinopse = data.sinopse.trim();

      const filme = await prisma.filme.update({
        where: { id },
        data: updateData
      });

      console.log(`✅ Filme atualizado: ${filme.titulo} (ID: ${filme.id})`);
      return filme;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar filme ${id}:`, error);
      
      if (error.message.includes('não encontrado')) {
        throw error;
      }
      
      throw new Error('Erro ao atualizar filme');
    }
  }

  /**
   * Deleta um filme
   */
  async delete(id: number): Promise<void> {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID inválido');
      }

      // Verificar se o filme existe
      const existe = await prisma.filme.findUnique({
        where: { id }
      });

      if (!existe) {
        throw new Error(`Filme com ID ${id} não encontrado`);
      }

      await prisma.filme.delete({
        where: { id }
      });

      console.log(`✅ Filme deletado: ${existe.titulo} (ID: ${id})`);
    } catch (error: any) {
      console.error(`❌ Erro ao deletar filme ${id}:`, error);
      
      if (error.message.includes('não encontrado')) {
        throw error;
      }
      
      throw new Error('Erro ao deletar filme');
    }
  }

  /**
   * Busca filmes por título ou diretor (método específico para busca)
   */
  async search(searchTerm: string): Promise<Filme[]> {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return this.findAll();
      }

      const term = searchTerm.trim();
      
      const filmes = await prisma.filme.findMany({
        where: {
          OR: [
            { titulo: { contains: term } },
            { diretor: { contains: term } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log(`🔍 Busca por "${term}" encontrou ${filmes.length} filmes`);
      return filmes;
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw new Error('Erro ao buscar filmes');
    }
  }

  /**
   * Obtém estatísticas dos filmes
   */
  async getStats() {
    try {
      const total = await prisma.filme.count();
      
      const porStatus = await prisma.filme.groupBy({
        by: ['status'],
        _count: true
      });

      const stats = {
        total,
        porStatus: {
          QUERO_ASSISTIR: 0,
          ASSISTINDO: 0,
          ASSISTIDO: 0
        }
      };

      porStatus.forEach(item => {
        const status = item.status as string;
        if (status in stats.porStatus) {
          stats.porStatus[status as keyof typeof stats.porStatus] = item._count;
        }
      });

      console.log('📊 Estatísticas:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao buscar estatísticas');
    }
  }

  /**
   * Valida os dados do filme
   */
  private validateFilmeData(data: any): void {
    const errors: string[] = [];

    if (data.titulo !== undefined) {
      if (!data.titulo || data.titulo.trim() === '') {
        errors.push('Título é obrigatório');
      }
    }

    if (data.diretor !== undefined) {
      if (!data.diretor || data.diretor.trim() === '') {
        errors.push('Diretor é obrigatório');
      }
    }

    if (data.genero !== undefined) {
      if (!data.genero || data.genero.trim() === '') {
        errors.push('Gênero é obrigatório');
      }
    }

    if (data.ano !== undefined) {
      if (typeof data.ano !== 'number' || data.ano < 1888 || data.ano > 2100) {
        errors.push('Ano deve ser entre 1888 e 2100');
      }
    }

    if (data.nota !== undefined) {
      if (typeof data.nota !== 'number' || data.nota < 0 || data.nota > 10) {
        errors.push('Nota deve ser entre 0 e 10');
      }
    }

    if (data.sinopse !== undefined) {
      if (!data.sinopse || data.sinopse.trim() === '') {
        errors.push('Sinopse é obrigatória');
      }
    }

    if (data.status !== undefined) {
      const validStatus = ['QUERO_ASSISTIR', 'ASSISTINDO', 'ASSISTIDO'];
      if (!validStatus.includes(data.status)) {
        errors.push('Status inválido');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Erros de validação: ${errors.join(', ')}`);
    }
  }
}

// Exportar uma instância única do serviço (Singleton)
export const filmeService = new FilmeService();