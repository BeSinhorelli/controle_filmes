import app from './app';
import dotenv from 'dotenv';
import path from 'path';

// Carregar .env antes de tudo
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3001;

// Verificar se a DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não encontrada no arquivo .env');
  console.log('⚠️ Usando configuração padrão...');
  process.env.DATABASE_URL = 'mysql://root@localhost:3306/controle_filmes';
}

// Testar conexão com o banco
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida!');
    
    // Testar query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste executada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    console.log('\n💡 Verifique:');
    console.log('1. Se o MySQL está rodando');
    console.log('2. Se o banco "controle_filmes" existe');
    console.log('3. Se as credenciais estão corretas');
  } finally {
    await prisma.$disconnect();
  }
}

// Testar conexão antes de iniciar o servidor
testConnection();

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//***@')}`);
});