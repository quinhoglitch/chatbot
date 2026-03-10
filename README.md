# Pacote PadrÃ£o do Chatbot

Este pacote permite instalar o chatbot em qualquer site de forma rÃ¡pida e organizada.

## O que estÃ¡ incluso

- `widget/chat-widget.js` (script do widget)
- `widget/chat-widget.css` (estilos do widget)
- `backend-chat/` (API em `/api/chat`)
- `integration/snippet.html` (trecho para inserir no site)

## InstalaÃ§Ã£o em 3 passos

1. Publique a API (`backend-chat`):
   - copie `.env.example` para `.env`
   - informe a `GEMINI_API_KEY`
   - atualize `knowledge.example.json` com os dados da empresa
   - execute `npm install` e `npm run dev`

2. Hospede o widget no site:
   - publique `widget/chat-widget.js`
   - publique `widget/chat-widget.css`

3. Insira o snippet:
   - cole o conteÃºdo de `integration/snippet.html` no HTML do site

## ObservaÃ§Ãµes importantes

- Se a API estiver em outro domÃ­nio, ajuste `CHAT_API_URL` em `integration/snippet.html`.
- Por padrÃ£o, o widget aponta para `"/api/chat"` (mesmo domÃ­nio).

Assinatura: https://github.com/quinhoglitch
