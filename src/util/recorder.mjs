export default class Recorder {
    constructor() {
        this.audioType = 'audio/webm;codecs=opus'
        this.mediaRecorder = {}

        this.recordedBlobs = []
    }
    _setup() {
        const options = { mimeType: this.audioType }
        const isSupported = MediaRecorder.isTypeSupported(options.mimeType)
        if(!isSupported) {
            const msg = `the codec: ${options.mimeType} isn't supported ):`
            alert(msg)

            throw new Error(msg)
        }

        return options
    }

    startRecording(stream) {
        const options = this._setup()
        this.mediaRecorder = new MediaRecorder(stream, options)

        this.mediaRecorder.onStop = (event) => {
            console.log('recorded blobs', this.recordedBlobs)
        }

        this.mediaRecorder.ondataavailable = (event) => {
            if(!event.data || !event.data.size) return;

            this.recordedBlobs.push(event.data)
        }

        this.mediaRecorder.start()
        console.log('started', this.mediaRecorder)
    }

    async stopRecording() {
        if(this.mediaRecorder.state === "inactive") return;
        this.mediaRecorder.stop()
    }
    getRecordingURL() {
        const blob = new Blob(this.recordedBlobs, { type: this.audioType })
        return window.URL.createObjectURL(blob);
    }
}