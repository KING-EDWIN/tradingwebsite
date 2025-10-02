import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add error boundary and logging
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  console.log("Starting React app...");
  createRoot(rootElement).render(<App />);
  console.log("React app rendered successfully");
} catch (error) {
  console.error("Error starting React app:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: white; background: #1a1a1a; min-height: 100vh;">
      <h1>Error Loading App</h1>
      <p>There was an error loading the application:</p>
      <pre style="background: #333; padding: 10px; border-radius: 5px;">${error}</pre>
    </div>
  `;
}
