# AI Chat App

This branch is the React version of the chat app. It keeps the same basic layout from the earlier assignment, but the UI is split into React components and the data is loaded through small API helper files.

## What is in this project

- React app built with Vite
- Sidebar with conversations and model picker
- Chat area with message list and message form
- Mock conversation and message data
- Streaming reply support for OpenRouter
- ESLint, Prettier, and pre-commit hooks

## Old assignment files

The plain HTML, CSS, and JavaScript version from the earlier branch is saved in `legacy-a3/` so the old work is still visible.

## Run the app

```bash
npm install
npm run dev
```

Vite will print a local URL in the terminal, usually `http://localhost:5173`.

## API key

Create a `.env.local` file in the project root and add:

```bash
VITE_OPENROUTER_API_KEY=your_key_here
```

This keeps the real key out of git. In a frontend app, this is still visible in the browser bundle, so it is fine for class demos but not for a production app.

## Useful commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Pre-commit

Install `pre-commit` first if you do not already have it, then run:

```bash
npm run precommit:install
```

Run hooks manually on all files:

```bash
npm run precommit:run
```
