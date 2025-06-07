import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MicIcon, BotIcon } from "lucide-react";
import VitalSigns from "@/components/VitalSigns";
import CodexDashboard from "@/components/CodexDashboard";

export default function ChatHomeBase() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeView, setActiveView] = useState("chat");
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const wsRef = useRef(null);

  const speakText = async (text) => {
    try {
      const res = await fetch("http://localhost:3700/api/speak_local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to fetch audio from TTS");

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("🔇 Voice playback failed:", error);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, from: "user" }]);
    setInput("");

    setTimeout(async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3400";
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input })
        });

        if (!res.ok) throw new Error("Failed to fetch from AI");

        const data = await res.json();
        console.log("🧠 AI backend reply:", data);
        setMessages((prev) => [...prev, { text: data.reply || "No response from AI.", from: "bot" }]);

        // 🔊 Speak the reply
        if (data.reply) speakText(data.reply);
      } catch (err) {
        console.error("AI error:", err);
        setMessages((prev) => [...prev, { text: "⚠️ AI is offline or unavailable.", from: "bot" }]);
      }
    }, 500);
  };

  const handleMic = async () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      audioContextRef.current?.close();
      wsRef.current?.close();
      processorRef.current = null;
      audioContextRef.current = null;
      wsRef.current = null;
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    const ws = new WebSocket("ws://localhost:3100/ws/stt");
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;
    audioContextRef.current = audioContext;
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const float32Buffer = new Float32Array(inputData);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(float32Buffer.buffer);
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("🎤 Transcript received from STT:", msg);
      if (msg.text || msg.transcript) {
        setInput(msg.text || msg.transcript);
        handleSend();
      }
    };

    ws.onclose = () => {
      console.log("🛑 Whisper WebSocket closed");
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex font-radiant">
      <aside className="w-64 p-4 bg-zinc-950 border-r border-zinc-800 hidden md:block">
        <div className="space-y-2">
          <Button variant="ghost" isActive={activeView === "chat"} onClick={() => setActiveView("chat")}> <BotIcon className="mr-2" /> Chat </Button>
          <Button variant="ghost" isActive={activeView === "codex"} onClick={() => setActiveView("codex")}> 📓 Codex </Button>
          <Button variant="ghost" isActive={activeView === "goals"} onClick={() => setActiveView("goals")}> 🎯 Goals </Button>
          <Button variant="ghost" isActive={activeView === "tasks"} onClick={() => setActiveView("tasks")}> ✅ Tasks </Button>
          <Button variant="ghost" isActive={activeView === "customers"} onClick={() => setActiveView("customers")}> 🧑‍💼 Customers </Button>
          <Button variant="ghost" isActive={activeView === "settings"} onClick={() => setActiveView("settings")}> ⚙️ Settings </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col justify-between">
        <header className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">🜁 Radiant Core Chat</h1>
          <div className="space-x-2">
            <Button variant="outline" className="shadow-outer-glow">🎙️ Voice: Live</Button>
            <Button variant="outline">⚙️ Settings</Button>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-radiant-base/80">
          {activeView === "chat" && messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-xl px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out
                ${msg.from === "user"
                  ? "bg-zinc-700 self-end shadow-inner-glow"
                  : "bg-gradient-to-br from-radiant-pulse to-zinc-800 border border-radiant-glow self-start shadow-outer-glow"}`}
            >
              {msg.text}
            </motion.div>
          ))}

          {activeView === "codex" && <CodexDashboard />}
        </div>

        {activeView === "chat" && (
          <footer className="border-t border-zinc-800 bg-zinc-950 p-4 flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your mind..."
              className="flex-1 resize-none bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-radiant-pulse"
            />
            <Button variant="ghost" onClick={handleMic}><MicIcon className="animate-pulseGlow" /></Button>
            <Button onClick={handleSend} className="bg-radiant-glow text-black font-bold shadow-outer-glow hover:bg-radiant-flame transition">Send</Button>
          </footer>
        )}

        <VitalSigns />
      </main>
    </div>
  );
}
