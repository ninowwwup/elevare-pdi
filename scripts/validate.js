const fs = require('fs');
const vm = require('vm');

const gsFiles = [
  'src/Code.gs',
  'src/Security.gs',
  'src/Validation.gs',
  'src/Database.gs',
  'src/Modules.gs'
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

if (hasErrors) {
  console.error('\nErros sintaticos encontrados.');
  process.exit(1);
} else {
  console.log('\nTodos os arquivos foram validados sintaticamente com sucesso!');
  process.exit(0);
}
