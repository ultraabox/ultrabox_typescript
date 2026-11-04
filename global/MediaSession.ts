export class MediaSessionIntegration {
    public audioTag = document.createElement("audio");
    public _onMediaSessionPlay: () => void;
    public _onMediaSessionPause: () => void;
    public _onMediaSessionStop: () => void;
    public _onMediaSessionSeekBackward: () => void;
    public _onMediaSessionSeekForward: () => void;
    public _onMediaSessionSeekTo: () => void;
    constructor() {
        this.audioTag.src = "silence.mp3";
        this.audioTag.loop = true;
        document.body.appendChild(this.audioTag);

        const imgSrc = OFFLINE ?
        "data:image/png;base64,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"
        : "/icon_maskable_192.png";

        navigator.mediaSession.metadata = new MediaMetadata({
            title: "Untitled",
            // artist:"Unknown",
            // album: "Unknown",
            artwork: [{ src: imgSrc }]
        });
        
        this.audioTag.pause();
        navigator.mediaSession.playbackState = "paused";

        navigator.mediaSession.setActionHandler("play", () => {
            this.audioTag.play();
            navigator.mediaSession.playbackState = "playing";
            this._onMediaSessionPlay();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            this.audioTag.pause();
            navigator.mediaSession.playbackState = "paused";
            this._onMediaSessionPause();
        });
        navigator.mediaSession.setActionHandler("stop", () => {
            this.audioTag.pause();
            navigator.mediaSession.playbackState = "paused";
            this._onMediaSessionStop();
        });
        navigator.mediaSession.setActionHandler("seekbackward", () => {
            this._onMediaSessionSeekBackward();
        });
        navigator.mediaSession.setActionHandler("seekforward", () => {
            this._onMediaSessionSeekForward();
        });
        navigator.mediaSession.setActionHandler("seekto", () => {
            this._onMediaSessionSeekTo();
        });
    }

    public playMediaSession(): void {
        this.audioTag.play();
        navigator.mediaSession.playbackState = "playing";
    }
    public pauseMediaSession(): void {
        this.audioTag.pause();
        navigator.mediaSession.playbackState = "paused";
    }
    public updateMediaSessionTitle(newTitle: string | undefined): void {
        if (navigator.mediaSession.metadata != null && newTitle != undefined) navigator.mediaSession.metadata.title = newTitle;
    }
}
