import Component from '@glimmer/component';
export interface UserMediaSrcArgs {
    mediaConstraints: MediaStreamConstraints;
}
export default class UserMediaSrc extends Component<UserMediaSrcArgs> {
    videoUrl?: string;
    videoStream?: MediaStream;
    error?: any;
    private _createSrcUrl?;
    private _revokeSrcUrl?;
    constructor(owner: unknown, args: UserMediaSrcArgs);
    willDestroy(): void;
    get actualMediaConstraints(): MediaStreamConstraints;
    private _startStream;
    private _stopStream;
    private _restartStream;
}
//# sourceMappingURL=component.d.ts.map