# react-vite-survey-app


A multi-step Survey Wizard built with **React + Vite + Bootstrap**. One question per screen, animated transitions, validation, and a final thank-you page.


## Features
- One-question-per-page flow (text, single-choice, multi-choice, rating)
- Smooth step animations with Framer Motion
- Validation & disabled Next until valid
- Progress bar and step counter
- LocalStorage autosave & console logging on submit
- Responsive, professional UI using react-bootstrap


## Tech Stack
React, Vite, react-bootstrap, Bootstrap, React Router, Framer Motion

## Create project

    npm create vite@latest react-vite-survey-app -- --template react
    cd react-vite-survey-app


## Install UI & routing

    npm i bootstrap react-bootstrap react-router-dom framer-motion classnames


## (Optional) SCSS support for custom styles

    npm i -D sass

## File tree (added/edited only)

    react-vite-survey-app/
    ├─ index.html
    ├─ package.json
    ├─ src/
    │ ├─ main.jsx
    │ ├─ App.jsx
    │ ├─ pages/
    │ │ └─ ThankYou.jsx
    │ ├─ components/
    │ │ ├─ QuestionRenderer.jsx
    │ │ └─ StepNav.jsx
    │ ├─ data/
    │ │ └─ questions.js
    │ ├─ styles/
    │ │ └─ custom.scss
    │ └─ utils/
    │ └─ storage.js
    └─ .gitignore


## First Commit (example)

    git init
    git add .
    git commit -m "feat: bootstrap React+Vite survey wizard (one-question-per-screen)"


## Getting Started

    npm i
    npm run dev