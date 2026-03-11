# AI Chat App

Simple browser chat app that connects to OpenRouter with streaming responses.

## What it includes

- Chat layout with sidebar and message area
- Model dropdown
- Streaming assistant reply output
- ESLint and Prettier setup
- `pre-commit` git hooks

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

## Pre-commit setup

Install `pre-commit` (for example with `pipx install pre-commit`), then install hooks:

```bash
npm run precommit:install
```

Run hooks manually on all files:

```bash
npm run precommit:run
```

## Files

- `index.html` main page
- `style.css` styles
- `js/main.js` app flow and event handlers
- `js/chat.js` message rendering helpers
- `js/api.js` OpenRouter request logic
