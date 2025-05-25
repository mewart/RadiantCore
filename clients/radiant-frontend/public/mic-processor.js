class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input.length) return true;

    const float32 = input[0];
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      int16[i] = Math.max(-1, Math.min(1, float32[i])) * 32767;
    }

    const volume = float32.reduce((sum, val) => sum + Math.abs(val), 0) / float32.length;

    this.port.postMessage({
      int16: int16.buffer,
      volume,
    });

    return true;
  }
}

registerProcessor("mic-processor", MicProcessor);
