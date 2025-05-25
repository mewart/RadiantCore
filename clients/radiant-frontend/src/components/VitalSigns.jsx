import { useEffect, useState } from 'react';

export default function VitalSigns() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchStatus = () => {
      fetch('http://localhost:3500/api/vitalsigns')
        .then(res => res.json())
        .then(setStatus)
        .catch(console.error);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (state) => ({
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    down: 'text-red-500',
    unknown: 'text-gray-500'
  }[state] || 'text-gray-400');

  return (
    <div className="bg-gray-900 p-2 text-sm text-white flex justify-center gap-4">
      {Object.entries(status).map(([service, state]) => (
        <span key={service} className={`${getColor(state)} font-semibold`}>
          {service.replace('_', ' ')}: {state.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
