import React from "react";
import { useDamianMic } from "@/hooks/useDamianMic";
import { Button } from "@/components/ui/button";

export default function DamianMicPanel() {
  const {
    startRecording,
    recording,
    status,
    transcript,
    reply,
    devices,
    selectedDevice,
    setSelectedDevice,
  } = useDamianMic({ autoPlay: true });

  return (
    <div className="p-4 border rounded-2xl shadow-md w-full max-w-md mx-auto bg-white text-black space-y-4">
      <h2 className="text-xl font-bold">🎙️ Talk to AI</h2>
      <p className="text-sm">Status: {status}</p>

      <label className="text-sm">Microphone:</label>
      <select
        className="border p-1 rounded"
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map((d) => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || `Mic (${d.deviceId})`}
          </option>
        ))}
      </select>

      <Button onClick={startRecording} disabled={recording}>
        {recording ? "Listening..." : "Speak"}
      </Button>

      {transcript && (
        <p className="text-sm">
          🧠 <strong>You said:</strong> {transcript}
        </p>
      )}

      {reply && (
        <p className="text-sm">
          🗣️ <strong>AI said:</strong> {reply}
        </p>
      )}
    </div>
  );
}
