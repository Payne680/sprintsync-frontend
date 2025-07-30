# SprintSync

## [Video Link](https://www.loom.com/share/29bd5ab3356e4bb495b4159f97caece8?sid=1719f6a1-987e-4420-bcc9-255447f7a88f)

SprintSync is a modern, AI-powered task management application designed for engineering teams and modern workflows. It combines a beautiful, responsive UI with real-time productivity features, authentication, and intelligent task suggestions.

---

## 🚀 Features

- **Fast Vite-powered development** for instant feedback
- **React 18 SPA** with modular, maintainable code
- **TailwindCSS** for utility-first, modern styling
- **JWT Authentication** (with mock/demo fallback for local/dev)
- **AI-powered task suggestions and descriptions**
- **Modal forms** for creating and editing tasks
- **Drag-and-drop task status updates**
- **Trusted-by carousel** and animated icons for credibility
- **Dashboard** with stats, collapsible "How it Works", and AI suggestion box
- **Unit and E2E tests** (React Testing Library, Cypress)
- **ESLint & Prettier** for code quality and formatting

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/Payne680/sprintsync-frontend.git
cd sprintsync-frontend
npm install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

- **Unit tests:**
  - `npm run test` — Runs React Testing Library tests
- **E2E tests:**
  - `npx cypress open` — Opens Cypress UI
  - `npx cypress run` — Runs Cypress tests headlessly
  - See `cypress/e2e/auth.cy.js` for authentication flow tests

---

## 🔒 Authentication

- JWT-based authentication with localStorage
- Mock/demo fallback for local/dev (no backend required)
- Protected routes (dashboard only accessible when logged in)

---

## 🤖 AI Suggestions

- AI-powered suggestions for task titles and descriptions
- Uses backend endpoint if available, otherwise falls back to local generation
- Sample titles provided for quick testing

---

## 📁 Project Structure

```
src/
  ├── App.jsx            # Main app component
  ├── main.jsx           # App entry point
  ├── index.css          # Global styles
  ├── styles.css         # Custom styles (inputs, carousel, etc.)
  ├── api/               # API calls (auth, tasks)
  ├── components/        # Reusable UI components
  ├── hooks/             # Custom React hooks (useAuth)
  ├── pages/             # Page components (Dashboard, Landing, Login, Signup)
  └── ...
cypress/
  ├── e2e/               # Cypress E2E tests
  └── ...
public/
  └── ...                # Static assets (logos, images)
```

---

## 📝 Contributing

1. Fork the repo and create your branch from `dev`.
2. Make your changes and add tests if applicable.
3. Run `npm run lint` and `npm run format` before submitting a PR.
4. Open a pull request describing your changes.

---

## 📄 License

MIT
