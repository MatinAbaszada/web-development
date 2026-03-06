# AI Chat App

Simple browser chat app that connects to OpenRouter with streaming responses.

## What it includes

- Chat layout with sidebar and message area
- Model dropdown
- Streaming assistant reply output
- ESLint and Prettier setup

## Run

```bash
npm install
open index.html
```

## Dev commands

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## Files

- `index.html` main page
- `style.css` styles
- `js/main.js` app flow and event handlers
- `js/chat.js` message rendering helpers
- `js/api.js` OpenRouter request logic
