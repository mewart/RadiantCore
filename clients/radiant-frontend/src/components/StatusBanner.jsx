import { useEffect, useState } from "react";

export default function StatusBanner() {
  const [status, setStatus] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:3600/health.json");
        const data = await res.json();
        setStatus(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        setStatus({ "System": "Unreachable" });
      }
    };

    fetchStatus();              // initial load
    const interval = setInterval(fetchStatus, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getColor = (state) => {
    if (state === "Up") return "bg-green-600";
    if (state === "Down") return "bg-red-600";
    return "bg-yellow-500"; // fallback
  };

  return (
    <div className="flex flex-col p-2 rounded-md shadow-md border bg-zinc-900 text-white mb-4">
      <div className="text-sm font-bold">System Status</div>
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.entries(status).map(([name, state]) => (
          <span
            key={name}
            className={`px-2 py-1 text-xs rounded ${getColor(state)}`}
          >
            {name}: {state}
          </span>
        ))}
      </div>
      {lastUpdated && (
        <div className="text-xs text-zinc-400 mt-1">
          Last checked: {lastUpdated}
        </div>
      )}
    </div>
  );
}
