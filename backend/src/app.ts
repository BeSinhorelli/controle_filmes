import express from 'express';
import cors from 'cors';
import filmeRoutes from './routes/filmeRoutes';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Verificar e carregar o .env
const envPath = path.resolve(__dirname, '../.env');
console.log('📁 Carregando .env de:', envPath);

// Verificar se o arquivo existe
if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado!');
  console.log('🔄 Criando arquivo .env automaticamente...');
  
  const envContent = `DATABASE_URL="mysql://root@localhost:3306/controle_filmes"
PORT=3001`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado com sucesso!');
}

// Carregar o .env
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Erro ao carregar .env:', result.error);
} else {
  console.log('✅ Arquivo .env carregado com sucesso!');
}

// Verificar se a DATABASE_URL foi carregada
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL não encontrada, usando valor padrão');
  process.env.DATABASE_URL = 'mysql://root@localhost:3306/controle_filmes';
}

console.log('📦 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ Não configurada');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/filmes', filmeRoutes);

export default app;