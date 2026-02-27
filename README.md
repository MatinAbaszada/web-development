# AI Chat App

A polished static AI chat UI with ESLint, Prettier, and Husky pre-commit hooks enforcing code quality.

## Features

- 💬 Clean chat interface with message bubbles
- 🤖 Simulated bot responses with typing indicator
- ✅ ESLint + Prettier configured and enforced via Husky pre-commit hook
- 📱 Responsive design

## Getting Started

```bash
# Install dependencies (sets up Husky automatically)
npm install

# Open index.html in your browser
open index.html
```

## Development

```bash
# Lint JavaScript files
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Check formatting
npm run format:check

# Auto-format all files
npm run format
```

## Code Quality

- **ESLint** — enforces JavaScript best practices
- **Prettier** — ensures consistent formatting
- **Husky + lint-staged** — runs linting and formatting checks on every commit, rejecting commits with errors

## Project Structure

```
ai-chat-app/
├── index.html        # Chat UI markup
├── style.css         # Styling — bubbles, layout, animations
├── chat.js           # Send logic, message rendering, bot simulation
├── eslint.config.js  # ESLint flat config
├── .prettierrc       # Prettier rules
└── package.json      # Dev tooling & scripts
```
