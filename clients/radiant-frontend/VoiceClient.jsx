import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Visualizer from "./components/Visualizer";

export default function VoiceClient() {
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [stream, setStream] = useState(null);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const getDevices = async () => {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = deviceInfos.filter(device => device.kind === "audioinput");
      setDevices(audioDevices);
      if (audioDevices.length > 0) {
        setSelectedDevice(audioDevices[0].deviceId);
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(avg / 255);
      requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      audioContext.close();
      audioContextRef.current = null;
    };
  }, [stream]);

  const speakText = async (text) => {
    try {
      const response = await fetch("http://localhost:3800/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    } catch (err) {
      console.error("🛑 Error speaking text:", err);
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream) {
        throw new Error("Microphone access denied or unavailable");
      }
      setStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob);

          const res = await fetch("http://localhost:3100/api/stt", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          setTranscript(data.transcript);

          const chatRes = await fetch("http://localhost:3100/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: data.transcript }),
          });
          const chatData = await chatRes.json();
          setReply(chatData.reply);

          await speakText(chatData.reply);

        } catch (error) {
          console.error("Error during recording processing:", error);
        } finally {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setTimeout(() => {
        mediaRecorder.stop();
        setIsListening(false);
      }, 5000);
    } catch (error) {
      console.error("Microphone access denied or unavailable:", error);
      alert("Microphone access is required to use this feature.");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h1 className="text-xl font-bold">🎙️ Voice Chat</h1>

          <div>
            <label htmlFor="device-select">Choose microphone: </label>
            <select 
              id="device-select" 
              value={selectedDevice} 
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={startListening} disabled={isListening}>
            {isListening ? "Listening..." : "Speak"}
          </Button>

          {stream && (
            <div className="relative w-full h-32 flex justify-center items-center">
              <div
                className="absolute rounded-full bg-blue-500 opacity-30 transition-all duration-1000"
                style={{
                  width: `${100 + volume * 200}px`,
                  height: `${100 + volume * 200}px`,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  left: '50%',
                  top: '50%'
                }}
              />
              <Visualizer stream={stream} />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">🧠 You said:</p>
            <p className="text-base">{transcript}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">🗣️ Assistant replied:</p>
            <p className="text-base font-semibold">{reply}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
