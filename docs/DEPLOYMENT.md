# Guia Passo a Passo de Configuração e Deploy — Elevare PDI

Este guia foi elaborado para ser simples, direto e à prova de dúvidas, mesmo para quem nunca programou antes.

---

## Opção 1: Configuração Direta pelo Navegador (Mais Rápida para Iniciantes)

Se você nunca usou terminal ou linha de comando, você pode configurar o Elevare PDI diretamente no navegador em menos de 5 minutos:

### Passo 1: Criar o Projeto no Google Apps Script
1. Abra seu navegador e acesse: [script.google.com](https://script.google.com/).
2. Faça login com sua conta Google (pessoal ou corporativa).
3. No canto superior esquerdo, clique no botão azul **"Novo projeto"**.
4. No topo da tela, clique no título padrão *"Projeto sem título"* e renomeie para: **Elevare PDI**.

### Passo 2: Copiar os Arquivos do Projeto
Na barra lateral esquerda do editor do Apps Script, você verá uma lista de arquivos.

1. **Arquivo `Code.gs`:**
   - Já existe um arquivo `Código.gs` (ou `Code.gs`).
   - Abra-o, apague o conteúdo existente e cole o conteúdo de `src/Code.gs`.
2. **Criar arquivos de Script (.gs):**
   - Ao lado de "Arquivos", clique no ícone **`+`** e selecione **Script**.
   - Crie `Database` e cole o conteúdo de `src/Database.gs`.
   - Crie `Security` e cole o conteúdo de `src/Security.gs`.
   - Crie `Validation` e cole o conteúdo de `src/Validation.gs`.
   - Crie `Modules` e cole o conteúdo de `src/Modules.gs`.
3. **Criar arquivos HTML (.html):**
   - Ao lado de "Arquivos", clique no ícone **`+`** e selecione **HTML**.
   - Crie `Index` e cole o conteúdo de `src/Index.html`.
   - Crie `Styles` e cole o conteúdo de `src/Styles.html`.
   - Crie `App` e cole o conteúdo de `src/App.html`.
   - Crie `Components` e cole o conteúdo de `src/Components.html`.
   - Crie `ApiClient` e cole o conteúdo de `src/ApiClient.html`.
4. Clique no ícone de disquete no topo ou aperte `Ctrl + S` para salvar tudo.

### Passo 3: Executar a Instalação Automática (`setupApplication`)
1. No menu superior do editor, na caixa seletora de funções ao lado de "Depurar", selecione a função **`setupApplication`**.
2. Clique no botão **"Executar"** (ícone de play ▶️).
3. **Autorização de Permissões (Apenas na 1ª vez):**
   - O Google exibirá a tela: *"Autorização necessária"*. Clique em **Revisar permissões**.
   - Escolha a sua conta Google.
   - O Google exibirá um aviso de tela cinza: *"O Google não verificou este app"*.
     - **Não se preocupe:** Isso é 100% normal porque o código acabou de ser escrito por você mesmo.
     - Clique no link discreto **"Avançado"** (no canto inferior esquerdo).
     - Clique em **"Acessar Elevare PDI (não seguro)"**.
     - Clique em **"Permitir"**.
4. No rodapé, você verá o "Registro de execução" exibindo:
   - ✅ Planilha criada ou vinculada com sucesso no seu Google Drive.
   - ✅ Todas as 15 abas e cabeçalhos criados.
   - ✅ ID da planilha gravado com segurança nas propriedades do script.

### Passo 4: Publicar o Aplicativo da Web
1. No canto superior direito, clique no botão azul **"Implantar"** (Deploy) > **"Nova implantação"**.
2. Clique no ícone de engrenagem ⚙️ ao lado de "Selecione o tipo" e escolha **"App da Web"**.
3. Preencha as configurações:
   - **Descrição:** `Versão 1.0 - Fase 1`
   - **Executar como:** `Eu (seu-email@gmail.com)`
   - **Quem pode acessar:** `Somente eu` *(recomendado para máxima privacidade)*
4. Clique em **"Implantar"**.
5. Copie a **URL do app da web** gerada (algo como `https://script.google.com/macros/s/.../exec`).
6. Abra essa URL em uma nova aba: **Pronto! Seu Elevare PDI está no ar!**

---

## Opção 2: Configuração com Clasp (Para Desenvolvedores Locais)

Se você tem o Node.js instalado e prefere sincronizar diretamente pelo terminal da sua máquina:

1. **Instalar dependências locais:**
   ```bash
   npm install
   ```
2. **Fazer login no Google pelo Clasp:**
   ```bash
   npx clasp login
   ```
   *Uma janela do navegador será aberta para você autenticar sua conta Google.*

3. **Habilitar a API do Apps Script:**
   - Acesse [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
   - Ative a opção **"Google Apps Script API"** (mude a chave para "Ativado").

4. **Criar ou Vincular o Projeto Clasp:**
   - Para criar um novo projeto direto do terminal:
     ```bash
     npx clasp create --type webapp --title "Elevare PDI" --rootDir src
     ```
   - Ou se já tiver criado no navegador, crie o arquivo `.clasp.json` com seu `scriptId`:
     ```json
     {
       "scriptId": "COLE_AQUI_O_ID_DO_SCRIPT",
       "rootDir": "src"
     }
     ```

5. **Enviar os arquivos locais para o Google Apps Script:**
   ```bash
   npx clasp push
   ```

6. **Abrir o projeto no navegador:**
   ```bash
   npx clasp open
   ```
   *Execute a função `setupApplication` e implante o Web App conforme descrito no Passo 4 da Opção 1.*
