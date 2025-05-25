import { useEffect, useRef, useState } from "react";

export function useDamianMic({
  whisperUrl = "http://127.0.0.1:1234/api/whisper",
  chatUrl = "http://127.0.0.1:1234/api/chat",
  speakUrl = "http://127.0.0.1:1234/api/speak",
  timeout = 5000,
  autoPlay = true,
  onResult,
  onError,
}) {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const loadDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(d => d.kind === "audioinput");
      setDevices(mics);
      if (mics.length > 0) setSelectedDevice(mics[0].deviceId);
    };
    loadDevices();
  }, []);

  const startRecording = async () => {
    try {
      setStatus("Initializing mic...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDevice ? { deviceId: { exact: selectedDevice } } : true,
      });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.onstart = () => {
        setRecording(true);
        setStatus("Recording...");
      };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setStatus("Processing...");
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);

        try {
          const res = await fetch(whisperUrl, { method: "POST", body: formData });
          const whisperData = await res.json();
          setTranscript(whisperData.transcript);

          const chatRes = await fetch(chatUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: whisperData.transcript }),
          });

          const chatData = await chatRes.json();
          setReply(chatData.reply);

          if (autoPlay) {
            const audio = new Audio(`${speakUrl}?text=${encodeURIComponent(chatData.reply)}`);
            audio.play();
          }

          if (onResult) onResult({ transcript: whisperData.transcript, reply: chatData.reply });
          setStatus("Done.");
        } catch (err) {
          console.error("Error in voice processing:", err);
          setStatus("Error");
          if (onError) onError(err);
        } finally {
          stream.getTracks().forEach(t => t.stop());
          setRecording(false);
        }
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state !== "inactive") recorder.stop();
      }, timeout);
    } catch (err) {
      console.error("Mic access failed:", err);
      setStatus("Mic access denied");
      if (onError) onError(err);
    }
  };

  return {
    startRecording,
    recording,
    status,
    transcript,
    reply,
    devices,
    selectedDevice,
    setSelectedDevice,
  };
}
