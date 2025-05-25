import torch
import numpy as np
from collections import deque
from typing import Optional


class VadOptions:
    def __init__(
        self,
        threshold: float = 0.5,
        sampling_rate: int = 16000,
        min_speech_duration_ms: int = 250,
        max_speech_duration_s: int = 30,
        min_silence_duration_ms: int = 100,
        window_size_samples: int = 512,
        speech_pad_ms: int = 50,
    ):
        self.threshold = threshold
        self.sampling_rate = sampling_rate
        self.min_speech_duration_ms = min_speech_duration_ms
        self.max_speech_duration_s = max_speech_duration_s
        self.min_silence_duration_ms = min_silence_duration_ms
        self.window_size_samples = window_size_samples
        self.speech_pad_ms = speech_pad_ms


class SileroVad:
    def __init__(self, options: Optional[VadOptions] = None):
        self.options = options or VadOptions()
        self.model, self.utils = torch.hub.load(repo_or_dir='snakers4/silero-vad', model='silero_vad', trust_repo=True)
        self.reset()

    def reset(self):
        self._triggered = False
        self._current_speech = []
        self._speech_segments = []
        self._buffer = deque()
        self._num_samples = 0

    def __call__(self, audio: np.ndarray, sample_rate: int = 16000) -> bool:
        if sample_rate != self.options.sampling_rate:
            raise ValueError(f"Expected sample rate {self.options.sampling_rate}, but got {sample_rate}")

        # Ensure 2D input (batch x samples)
        if audio.ndim == 1:
            audio = audio[None, :]

        speech_probs = self.model(audio, sample_rate).flatten().numpy()
        speech_detected = np.any(speech_probs > self.options.threshold)

        return speech_detected
