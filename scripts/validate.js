const fs = require('fs');
const vm = require('vm');

const files = [
  'src/Code.gs',
  'src/Security.gs',
  'src/Validation.gs',
  'src/Database.gs',
  'src/Modules.gs'
];

let hasErrors = false;

console.log('Iniciando verificacao sintatica dos arquivos Apps Script...');

files.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    new vm.Script(code);
    console.log('  [PASS] ' + file);
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

if (hasErrors) {
  console.error('\nErros sintaticos encontrados.');
  process.exit(1);
} else {
  console.log('\nTodos os arquivos foram validados sintaticamente com sucesso!');
  process.exit(0);
}
