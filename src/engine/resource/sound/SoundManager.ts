import { Injectable } from "../../di/Injectable";
import { BrowserUnsupported } from "../../exception/BrowserUnsupported";
import { SoundResource } from "./SoundResource";
import { SFXSound } from "./SFXSound";

@Injectable()
export class SoundManager {

    private context!: AudioContext;

    private analyzer!: AnalyserNode;
    private audio!: AudioNode;
    private oscillator!: OscillatorNode;
    private gain!: GainNode;
    private biquadFilter!: BiquadFilterNode;
    private audioBuffer!: AudioBufferSourceNode;

    constructor() {

        // make some support text
        try {

            // get the audio context from different sources
            this.context = new (
                // generic html5
                (window as any).AudioContext ||
                // chrome proprietary
                (window as any).webkitAudioContext
            )();

            if (this.context === undefined) {
                throw new Error();
            }

            // prepare audio api
            this.prepareAudioApi();
        } catch (e) {

            throw new BrowserUnsupported(`Audio API is not supported in your current Browser!`);
        }
    }

    /**
     * plays the given sound file
     * @param resource the sound to play
     * @param time the amount of milliseconds this sound should be played. -1 equals as long as the sound file can play
     * @returns a promise that resolves when the sound file has been finished playing
     */
    public async play(resource: SoundResource, time: number = -1): Promise<void> {

        if (this.isSFXSound(resource)) {

            const sfxData = resource.getData();
        }
    }

    /**
     * prepared the audio env by creating nodes on the audio api
     */
    private prepareAudioApi(): void {

        this.analyzer = this.context.createAnalyser();
        this.oscillator = this.context.createOscillator();
        this.gain = this.context.createGain();
        this.biquadFilter = this.context.createBiquadFilter();
        this.audioBuffer = this.context.createBufferSource();
    }

    /**
     * test if the given resource is a SFX resource
     * @param resource the resource to test
     */
    private isSFXSound(resource: SoundResource): resource is SoundResource<SFXSound> {

        if (!resource.isLoaded()) {
            return false;
        }

        // get resource data
        const data = resource.getData();

        // test type
        if (typeof data !== "object") {
            return false;
        }

        const testKeys: (keyof SFXSound)[] = ["gain", "frequency"];

        // search all keys
        return testKeys.filter(key => data[key] !== undefined).length > 0;
    }
}
