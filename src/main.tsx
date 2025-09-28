
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/global.css";
  import { AppProvider } from './state/AppContext';

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
  