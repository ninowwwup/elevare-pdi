const fs = require('fs');
const vm = require('vm');

const gsFiles = [
  'src/Code.gs',
  'src/Security.gs',
  'src/Validation.gs',
  'src/Database.gs',
  'src/Modules.gs',
  'src/SeedPdi.gs'
];

const htmlFiles = [
  'src/App.html',
  'src/ApiClient.html',
  'src/Components.html'
];

let hasErrors = false;

console.log('Iniciando verificacao sintatica dos arquivos Apps Script...');

gsFiles.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code);
    console.log('  [PASS] ' + file);
  } catch (err) {
    console.error('  [FAIL] ' + file + ': ' + err.message);
    hasErrors = true;
  }
});

// Valida os blocos <script> nos arquivos HTML
console.log('Iniciando verificacao dos scripts frontend...');
htmlFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
      scriptMatches.forEach((tag, idx) => {
        const js = tag.replace(/<\/?script>/gi, '');
        new vm.Script(js);
      });
    }
    console.log('  [PASS] ' + file + ' (scripts validos)');
  } catch (err) {
    console.error('  [FAIL] ' + file + ': ' + err.message);
    hasErrors = true;
  }
});

// Valida appsscript.json
try {
  const manifest = JSON.parse(fs.readFileSync('src/appsscript.json', 'utf8'));
  if (!manifest.timeZone || !manifest.runtimeVersion) {
    throw new Error('Propriedades obrigatorias ausentes no manifesto.');
  }
  console.log('  [PASS] src/appsscript.json (manifesto valido)');
} catch (err) {
  console.error('  [FAIL] src/appsscript.json: ' + err.message);
  hasErrors = true;
}

// Valida os 35 registros do SeedPdi contra as regras de Security e Validation
try {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync('src/Security.gs', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('src/Validation.gs', 'utf8'), ctx);
  vm.runInContext(fs.readFileSync('src/SeedPdi.gs', 'utf8'), ctx);

  const ds = ctx.SeedPdi.getPdiDataset();
  let count = 0;

  ds.planosPdi.forEach(r => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('PLANOS_PDI'), r, false); count++; });
  ds.swot.forEach(r => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('SWOT'), r, false); count++; });
  ds.competencias.forEach(r => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('COMPETENCIAS'), r, false); count++; });
  ds.metasComAcoes.forEach(g => {
    ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('METAS'), g.meta, false); count++;
    g.acoes.forEach(a => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('ACOES'), a, false); count++; });
  });
  ds.feedbacks.forEach(r => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('FEEDBACKS'), r, false); count++; });
  ds.livros.forEach(r => { ctx.Validation.validateRecord(ctx.Security.assertAllowedTable('LIVROS'), r, false); count++; });

  if (count !== 35) {
    throw new Error('Quantidade de registros no SeedPdi diferente de 35: ' + count);
  }
  console.log('  [PASS] SeedPdi: Todos os ' + count + ' registros passaram nas regras de Security e Validation!');
} catch (err) {
  console.error('  [FAIL] SeedPdi validacao de dados: ' + err.message);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\nErros sintaticos encontrados.');
  process.exit(1);
} else {
  console.log('\nTodos os arquivos foram validados sintaticamente com sucesso!');
  process.exit(0);
}
