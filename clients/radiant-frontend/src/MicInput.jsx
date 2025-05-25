import React, { useEffect, useRef, useState } from "react";

const MicInput = () => {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Idle");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setStatus("Initializing mic...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      audioChunksRef.current = [];
      setStatus("Recording...");
    };

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setStatus("Sending to AI...");
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      try {
        const response = await fetch("http://127.0.0.1:1234/api/whisper", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("AI response:", result);
        setStatus("Done. Response received.");
      } catch (err) {
        console.error("Error sending to AI:", err);
        setStatus("Error");
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="p-4 border rounded-2xl shadow-md w-full max-w-md mx-auto bg-white text-black">
      <h2 className="text-xl font-bold mb-2">🎙️ AI Voice Input</h2>
      <p className="mb-4 text-sm">Status: {status}</p>
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-xl font-semibold shadow ${
          recording ? "bg-red-600 text-white" : "bg-blue-600 text-white"
        }`}
      >
        {recording ? "Stop" : "Start Talking"}
      </button>
    </div>
  );
};

export default MicInput;
