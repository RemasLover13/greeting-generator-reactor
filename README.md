# 🎉 Генератор поздравлений с AI

Современное веб-приложение для создания уникальных поздравлений с использованием искусственного интеллекта. Генерирует персонализированные тексты и изображения для любых праздников.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Особенности

- 🤖 **AI-генерация текста** — уникальные поздравления с учетом всех параметров
- 🎨 **AI-генерация изображений** — визуальное оформление под стиль поздравления
- 🌍 **Мультиязычность** — поддержка 6 языков (русский, белорусский, английский, немецкий, испанский, французский)
- 🎭 **6 стилей тона** — от официального до 18+
- 🎂 **Поддержка праздников** — День Рождения, Новый Год
- 👤 **Персонализация** — имя, возраст, интересы получателя
- 📱 **Адаптивный дизайн** — работает на всех устройствах


## 🛠️ Технологии

### Frontend
- **React 18** — библиотека для построения интерфейсов
- **TypeScript** — типобезопасность
- **Tailwind CSS** — стилизация и адаптивность
- **Vite** — сборка и разработка

### AI Сервисы
- **OpenRouter API** — генерация текста (Gemini 2.5 Flash Lite)
- **Pollinations API** — генерация изображений (FLUX model)

## 📦 Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/greeting-generator.git
cd greeting-generator
```
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
```bash
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
