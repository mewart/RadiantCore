// useMicStream.js (Full Loop: STT + Chat + TTS with AudioWorklet replacement and dynamic transcript batching)

import { useEffect, useRef, useState } from "react";

export default function useMicStream({
  sttUrl = "ws://127.0.0.1:3100/ws/stt",
  chatUrl = "http://localhost:3100/api/chat",
  speakUrl = "http://localhost:3100/api/speak",
  onTranscript,
  onReply,
  onError,
  autoPlay = true,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const workletRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    return () => stop();
  }, []);

  const start = async () => {
    try {
      const ws = new WebSocket(sttUrl);
      console.log("🔌 Connecting to WebSocket:", sttUrl);

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      ws.onmessage = async (event) => {
        try {
          const { type, text } = JSON.parse(event.data);
          if (type === "transcript") {
            console.log("🧠 Transcript received:", text);
            onTranscript?.(text);

            const chatRes = await fetch(chatUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: text }),
            });

            const { reply } = await chatRes.json();
            console.log("🤖 Chat reply:", reply);
            onReply?.(reply);

            if (autoPlay) {
              const audio = new Audio(`${speakUrl}?text=${encodeURIComponent(reply)}`);
              audio.play();
            }
          }
        } catch (err) {
          console.error("MicStream processing error:", err);
          onError?.(err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        onError?.(err);
      };

      wsRef.current = ws;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      contextRef.current = context;

      await context.audioWorklet.addModule("/mic-processor.js");
      const worklet = new AudioWorkletNode(context, "mic-processor");
      worklet.port.onmessage = async (e) => {
        const { int16, volume } = e.data;

        console.log("🎤 Mic volume:", volume, "Buffer length:", int16.byteLength);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const blob = new Blob([int16]);
          const buffer = await blob.arrayBuffer();
          wsRef.current.send(buffer);
        }

        setVolume(volume);
      };

      const source = context.createMediaStreamSource(stream);
      source.connect(worklet);

      streamRef.current = stream;
      workletRef.current = worklet;

      await context.resume();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start mic stream:", err);
      onError?.(err);
    }
  };

  const stop = () => {
    console.log("🛑 Stopping mic stream");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    workletRef.current?.disconnect();
    contextRef.current?.close();

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🔌 Closing WebSocket connection");
      wsRef.current.close();
    }

    streamRef.current = null;
    workletRef.current = null;
    contextRef.current = null;
    wsRef.current = null;

    setIsRecording(false);
    setVolume(0);
  };

  return { start, stop, isRecording, volume };
}

// === Server-Side PATCH ===
// Replace main() server start logic in stt_ws_server.py with:
//
// async def reject_invalid_requests(path, request_headers):
//     if request_headers.get("Upgrade", "").lower() != "websocket":
//         return http.HTTPStatus.UPGRADE_REQUIRED, [], b"Expected WebSocket request.\n"
