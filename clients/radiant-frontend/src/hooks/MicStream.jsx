import React, { useState } from "react";
import { useOpenMicStream } from "@/hooks/useOpenMicStream";
import { Button } from "@/components/ui/button";

export default function DamianMicStream() {
  const [transcript, setTranscript] = useState("");
  const { startStreaming, stopStreaming, connected } = useOpenMicStream({
    onTranscript: setTranscript,
  });

  return (
    <div className="p-4 max-w-md mx-auto border rounded-xl shadow-md bg-white space-y-4 text-black">
      <h2 className="text-xl font-bold">🧠 AI Live Mic</h2>
      <Button onClick={connected ? stopStreaming : startStreaming}>
        {connected ? "Stop Listening" : "Start Listening"}
      </Button>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Transcript:</p>
        <p className="font-medium">{transcript}</p>
      </div>
    </div>
  );
}
