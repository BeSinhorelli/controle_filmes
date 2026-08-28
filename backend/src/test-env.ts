import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

console.log('=== DIAGNÓSTICO DE AMBIENTE ===\n');

// 1. Verificar diretório atual
const currentDir = __dirname;
console.log('📁 Diretório atual:', currentDir);

// 2. Verificar se .env existe
const envPath = path.resolve(currentDir, '../.env');
console.log('📄 Caminho do .env:', envPath);

if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env encontrado!');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('📝 Conteúdo do .env:');
  console.log(content);
} else {
  console.log('❌ Arquivo .env NÃO encontrado!');
  console.log('🔄 Criando .env automaticamente...');
  const envContent = 'DATABASE_URL="mysql://root@localhost:3306/controle_filmes"\nPORT=3001';
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env criado!');
}

// 3. Carregar .env
console.log('\n🔄 Carregando variáveis de ambiente...');
dotenv.config({ path: envPath });

// 4. Verificar DATABASE_URL
console.log('\n📦 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida');
if (process.env.DATABASE_URL) {
  console.log('🔗 URL:', process.env.DATABASE_URL.replace(/\/\/.*@/, '//***@'));
}

// 5. Tentar conectar ao MySQL
console.log('\n🔌 Testando conexão com MySQL...');
import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'controle_filmes'
    });
    
    console.log('✅ Conexão com MySQL estabelecida!');
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('📊 Tabelas encontradas:', rows);
    
    await connection.end();
  } catch (error: any) {
    console.error('❌ Erro ao conectar:', error.message);
    console.log('\n💡 Dicas:');
    console.log('1. Verifique se o MySQL está rodando');
    console.log('2. Execute: net start MySQL80');
    console.log('3. Verifique se o banco "controle_filmes" existe');
  }
}

testConnection();