import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

type MapToString = (object: any) => string;
type RevokeUrlFn = (url: string) => void;

export interface UserMediaSrcArgs {
  mediaConstraints: MediaStreamConstraints;
}

export default class UserMediaSrc extends Component<UserMediaSrcArgs> {

  @tracked videoUrl?: string;
  @tracked videoStream?: MediaStream;
	@tracked error?: any;

	private _createSrcUrl?: MapToString = undefined;
  private _revokeSrcUrl?: RevokeUrlFn = undefined;

	constructor(owner: unknown, args: UserMediaSrcArgs) {
    super(owner, args);
    if (URL && URL.createObjectURL) {
      this._createSrcUrl = URL.createObjectURL;
    }
    if (URL && URL.revokeObjectURL) {
      this._revokeSrcUrl = URL.revokeObjectURL;
    }
  }

  willDestroy () {
		super.willDestroy();
		this._stopStream();
	}
  
  get actualMediaConstraints(): MediaStreamConstraints {
    return this.args.mediaConstraints || {video: true, audio: false};
  }

  @task
  private * _startStream (this: UserMediaSrc) {
		if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			this.error = "getUserMedia not available";
			return;
		}
		this.error = undefined;
		let constraints = this.actualMediaConstraints;
		try {
      this.videoStream = yield navigator.mediaDevices.getUserMedia(constraints)
      if (this._createSrcUrl) {
        this.videoUrl = this._createSrcUrl(this.videoStream);
      }
		} catch (err) {
			this.videoUrl = undefined;
			this.error = err;
		}
	}

  private _stopStream (this: UserMediaSrc) {
		try {
      if (this.videoStream) {
        let tracks = this.videoStream.getTracks();
        tracks.forEach(track => track.stop());
        this.videoStream = undefined;
      }
      if (this.videoUrl) {
        if (this._revokeSrcUrl) {
          this._revokeSrcUrl(this.videoUrl);
        }
        this.videoUrl = undefined;
      }
      this.error = undefined;
    } catch (err) {
      this.error = err;
    }
  };

  @task({
    restartable: true
  })
	private * _restartStream(this: UserMediaSrc) {
		this._stopStream();
		yield taskFor(this._startStream).perform();
	}
}
