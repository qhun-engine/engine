export interface SFXSound {

    waveType: "square" | "triangle" | "sawtooth" | "sine" | "noise";

    frequency: number;

    frequencySlide: number;

    delayFrequencyStartTimePct: number;

    delayFrequencyMult: number;

    vibroTime: number;

    vibroShiftTime: number;

    vibroFrequency: number;

    vibroWave: Exclude<SFXSound["waveType"], "noise">;

    lowPassFrequency: number;

    lowPassFrequencyRamp: number;

    hiPassFrequency: number;

    attackTime: number;

    decayTime: number;

    sustainTime: number;

    releaseTime: number;

    attachPunchVolume: number;

    dutyCycleLength: number;

    dutyCyclePct: number;

    flangeDelayTime: number;

    dlangeFeedbackVolume: number;

    gain: number;

    distortion: number;

    noiseDetune: number;

    noiseDetuneSlide: number;

    slideType: "none" | "linear" | "exponential";
}
