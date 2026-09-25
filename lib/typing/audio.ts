let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function playTone({
  frequency,
  duration,
  type,
  gainValue,
}: {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gainValue: number;
}) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(gainValue, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function playSweepTone({
  startFrequency,
  endFrequency,
  duration,
  gainValue,
}: {
  startFrequency: number;
  endFrequency: number;
  duration: number;
  gainValue: number;
}) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume();
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function playKeyNoise({
  duration,
  filterType,
  frequency,
  gainValue,
}: {
  duration: number;
  filterType: BiquadFilterType;
  frequency: number;
  gainValue: number;
}) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    void context.resume();
  }

  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate,
  );
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const now = context.currentTime;

  source.buffer = buffer;
  filter.type = filterType;
  filter.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(gainValue, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(now);
}

export function playKeySound(
  profile: "click" | "mechanical",
  kind: "correct" | "incorrect" | "backspace",
) {
  if (kind === "incorrect") {
    playKeyNoise({
      duration: 0.035,
      filterType: "lowpass",
      frequency: 520,
      gainValue: 0.035,
    });
    playSweepTone({
      startFrequency: 240,
      endFrequency: 110,
      duration: 0.11,
      gainValue: 0.025,
    });
    return;
  }

  const isMechanical = profile === "mechanical";
  const impactDuration = isMechanical ? 0.035 : 0.022;
  const impactGain = isMechanical ? 0.065 : 0.05;

  playKeyNoise({
    duration: impactDuration,
    filterType: "highpass",
    frequency: isMechanical ? 1250 : 1750,
    gainValue: impactGain,
  });
  playKeyNoise({
    duration: isMechanical ? 0.06 : 0.04,
    filterType: "lowpass",
    frequency: isMechanical ? 700 : 850,
    gainValue: isMechanical ? 0.035 : 0.022,
  });
  playTone({
    frequency: kind === "backspace" ? 180 : isMechanical ? 230 : 300,
    duration: kind === "backspace" ? 0.035 : 0.025,
    type: "triangle",
    gainValue: kind === "backspace" ? 0.01 : 0.014,
  });
}
