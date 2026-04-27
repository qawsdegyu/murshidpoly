import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red; background: white; font-family: sans-serif;">
      <h1>Runtime Error Caught</h1>
      <p>${event.message}</p>
      <pre style="white-space: pre-wrap;">${event.error?.stack || ''}</pre>
    </div>`;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
