// radiant-frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// radiant-frontend/src/App.jsx
import React from "react";
import NavigationTabs from "./components/NavigationTabs";
import VoiceClient from "./components/VoiceClient";
import CodexDashboard from "./components/CodexDashboard";

export default function App() {
  const [activeTab, setActiveTab] = React.useState("voice");

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Radiant Core Interface</h1>
      <NavigationTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === "voice" && <VoiceClient />}
        {activeTab === "codex" && <CodexDashboard />}
      </div>
    </div>
  );
}

// radiant-frontend/src/components/NavigationTabs.jsx
import React from "react";

export default function NavigationTabs({ activeTab, onChange }) {
  return (
    <div className="flex space-x-4 border-b border-zinc-700 pb-2">
      <button
        className={`px-4 py-2 rounded ${
          activeTab === "voice" ? "bg-zinc-700" : "bg-zinc-800"
        }`}
        onClick={() => onChange("voice")}
      >
        Voice Client
      </button>
      <button
        className={`px-4 py-2 rounded ${
          activeTab === "codex" ? "bg-zinc-700" : "bg-zinc-800"
        }`}
        onClick={() => onChange("codex")}
      >
        Codex Dashboard
      </button>
    </div>
  );
}

// radiant-frontend/src/components/VoiceClient.jsx
import React from "react";

export default function VoiceClient() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Voice Client</h2>
      <p>Voice interaction features will go here.</p>
    </div>
  );
}

// radiant-frontend/src/components/CodexDashboard.jsx
import React from "react";

export default function CodexDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Codex Dashboard</h2>
      <p>Codex management UI will be rendered here.</p>
    </div>
  );
}

// radiant-frontend/src/styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
