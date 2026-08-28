import { filmeService } from './services/filmeService';

async function testService() {
  console.log('🧪 Testando FilmeService...\n');

  try {
    // 1. Testar busca com filtros
    console.log('1️⃣ Testando findAll com filtros...');
    const filmes = await filmeService.findAll({ busca: 'Matrix' });
    console.log(`✅ Encontrados ${filmes.length} filmes\n`);

    // 2. Testar estatísticas
    console.log('2️⃣ Testando getStats...');
    const stats = await filmeService.getStats();
    console.log('✅ Estatísticas:', stats, '\n');

    // 3. Testar criação
    console.log('3️⃣ Testando create...');
    const novoFilme = await filmeService.create({
      titulo: 'Filme Teste',
      diretor: 'Diretor Teste',
      genero: 'Ação',
      ano: 2024,
      nota: 8.5,
      status: 'QUERO_ASSISTIR',
      sinopse: 'Este é um filme de teste criado automaticamente.'
    });
    console.log(`✅ Filme criado: ${novoFilme.titulo} (ID: ${novoFilme.id})\n`);

    // 4. Testar busca por ID
    console.log('4️⃣ Testando findById...');
    const filmeEncontrado = await filmeService.findById(novoFilme.id);
    console.log(`✅ Filme encontrado: ${filmeEncontrado?.titulo}\n`);

    // 5. Testar update
    console.log('5️⃣ Testando update...');
    const filmeAtualizado = await filmeService.update(novoFilme.id, {
      nota: 9.0,
      status: 'ASSISTIDO'
    });
    console.log(`✅ Filme atualizado: Nota ${filmeAtualizado.nota}, Status ${filmeAtualizado.status}\n`);

    // 6. Testar delete
    console.log('6️⃣ Testando delete...');
    await filmeService.delete(novoFilme.id);
    console.log('✅ Filme deletado com sucesso\n');

    console.log('🎉 Todos os testes passaram!');
  } catch (error: any) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error);
  }
}

testService();