/**
 * Elevare PDI — Gerador de Bundle Estático para GitHub Pages
 * Compila os templates modulares do Google Apps Script (Index, Styles, Components, ApiClient, App)
 * e embute o dataset completo de 35 registros do PDI para funcionamento universal em qualquer rede.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

function buildInitialDbFromSeed() {
  const seedCode = fs.readFileSync(path.join(srcDir, 'SeedPdi.gs'), 'utf8');
  const sandbox = {
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty: () => {} }) },
    Database: {},
    Logger: { log: () => {} }
  };
  vm.createContext(sandbox);
  vm.runInContext(seedCode, sandbox);

  const ds = sandbox.SeedPdi.getPdiDataset();
  const now = new Date().toISOString();

  const planos = (ds.planosPdi || []).map((p, i) => Object.assign({ id: 'pdi_' + (i + 1), created_at: now, updated_at: now }, p));
  const swot = (ds.swot || []).map((s, i) => Object.assign({ id: 'swot_' + (i + 1), created_at: now, updated_at: now }, s));
  const competencias = (ds.competencias || []).map((c, i) => Object.assign({ id: 'comp_' + (i + 1), created_at: now, updated_at: now }, c));
  const metas = [];
  const acoes = [];

  (ds.metasComAcoes || []).forEach((group, mIdx) => {
    const metaId = 'meta_' + (mIdx + 1);
    metas.push(Object.assign({ id: metaId, created_at: now, updated_at: now }, group.meta));
    (group.acoes || []).forEach((acao, aIdx) => {
      acoes.push(Object.assign({ id: 'acao_' + (mIdx + 1) + '_' + (aIdx + 1), meta_id: metaId, created_at: now, updated_at: now }, acao));
    });
  });

  const feedbacks = (ds.feedbacks || []).map((f, i) => Object.assign({ id: 'fb_' + (i + 1), created_at: now, updated_at: now }, f));
  const livros = (ds.livros || []).map((l, i) => Object.assign({ id: 'livro_' + (i + 1), created_at: now, updated_at: now }, l));

  return {
    PLANOS_PDI: planos,
    SWOT: swot,
    COMPETENCIAS: competencias,
    AVALIACOES: [],
    METAS: metas,
    ACOES: acoes,
    FEEDBACKS: feedbacks,
    LIVROS: livros,
    LEITURAS: []
  };
}

const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbz57SSwvYaoRsn4RbtN7KhGXVpPMTmNFaVkxkkCgWSA0f1uMBFg9n3Vi5KVcj9CNLsr/exec';

async function fetchLiveTable(tableName) {
  try {
    const url = `${GAS_WEBAPP_URL}?rpc=apiListRecords&args=${encodeURIComponent(JSON.stringify([tableName]))}`;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (e) {
    // Fallback silencioso para seed local
  }
  return null;
}

async function buildPages() {
  let indexHtml = fs.readFileSync(path.join(srcDir, 'Index.html'), 'utf8');
  const stylesHtml = fs.readFileSync(path.join(srcDir, 'Styles.html'), 'utf8');
  const componentsHtml = fs.readFileSync(path.join(srcDir, 'Components.html'), 'utf8');
  const apiClientHtml = fs.readFileSync(path.join(srcDir, 'ApiClient.html'), 'utf8');
  const appHtml = fs.readFileSync(path.join(srcDir, 'App.html'), 'utf8');

  const initialDb = buildInitialDbFromSeed();

  // Tenta sincronizar dados reais atuais da planilha (incluindo capas 3D salvas)
  const tables = ['PLANOS_PDI', 'SWOT', 'COMPETENCIAS', 'METAS', 'ACOES', 'FEEDBACKS', 'LIVROS'];
  for (const t of tables) {
    const liveData = await fetchLiveTable(t);
    if (liveData && liveData.length > 0) {
      initialDb[t] = liveData;
      console.log(`  [Sync] Tabela ${t}: ${liveData.length} registros sincronizados da planilha.`);
    }
  }

  const seedScriptTag = `<script>\n  window.ELEVARE_INITIAL_DB = ${JSON.stringify(initialDb)};\n</script>\n`;

  // Garante meta viewport responsivo no head
  indexHtml = indexHtml.replace(
    '<meta charset="UTF-8">',
    '<meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
  );

  // Substitui includes do Apps Script pelos arquivos reais
  indexHtml = indexHtml
    .replace(/<\?!=\s*include\(['"]Styles['"]\);\s*\?>/g, () => stylesHtml)
    .replace(/<\?!=\s*include\(['"]Components['"]\);\s*\?>/g, () => seedScriptTag + componentsHtml)
    .replace(/<\?!=\s*include\(['"]ApiClient['"]\);\s*\?>/g, () => apiClientHtml)
    .replace(/<\?!=\s*include\(['"]App['"]\);\s*\?>/g, () => appHtml)
    .replace(/<\?=\s*userEmail\s*\?>/g, 'francisco.silva@elevare.pdi');

  const outRoot = path.join(rootDir, 'index.html');
  const outDocs = path.join(rootDir, 'docs', 'index.html');

  fs.writeFileSync(outRoot, indexHtml, 'utf8');
  fs.writeFileSync(outDocs, indexHtml, 'utf8');
  console.log('✅ Bundle estático gerado com sucesso em index.html e docs/index.html!');
}

buildPages();
