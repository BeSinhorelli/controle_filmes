import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Se ainda não tiver DATABASE_URL, usar padrão
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL não encontrada, usando configuração padrão');
  process.env.DATABASE_URL = 'mysql://root@localhost:3306/controle_filmes';
}

// Criar instância do Prisma com a URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;