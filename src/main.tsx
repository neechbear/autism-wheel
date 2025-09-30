
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/globals.css";
  import "./styles/globals-light.css";
  import "./styles/globals-dark.css";

  createRoot(document.getElementById("root")!).render(<App />);
