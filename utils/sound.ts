let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sweepInterval: ReturnType<typeof setInterval> | null = null;

export const triggerContinuousSiren = () => {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = new AudioContextClass();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = 'sawtooth';
  gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const sweep = () => {
    if (!oscillator || !audioCtx) return;
    const now = audioCtx.currentTime;
    oscillator.frequency.cancelScheduledValues(now);
    oscillator.frequency.setValueAtTime(700, now);
    oscillator.frequency.linearRampToValueAtTime(1200, now + 0.6);
    oscillator.frequency.linearRampToValueAtTime(700, now + 1.2);
  };

  sweep();
  oscillator.start();
  sweepInterval = setInterval(sweep, 1200);
};

export const stopContinuousSiren = () => {
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
      oscillator.disconnect();
    } catch {
      // ignore
    }
    oscillator = null;
  }
  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch {
      // ignore
    }
    gainNode = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch {
      // ignore
    }
    audioCtx = null;
  }
};
