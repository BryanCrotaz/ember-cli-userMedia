import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { tagName } from '@ember-decorators/component';
import { observes } from '@ember-decorators/object';

type MapToString = (object: any) => string;
type RevokeUrlFn = (url: string) => void;

@tagName('')
export default class UserMediaSrc extends Component {

	@tracked mediaConstraints!: MediaStreamConstraints;

  @tracked videoUrl?: string;
  @tracked videoStream?: MediaStream;
	@tracked error?: string;

	private _createSrcUrl?: MapToString = undefined;
  private _revokeSrcUrl?: RevokeUrlFn = undefined;

	constructor(options: {}) {
    super(options);
    this.mediaConstraints = {video: true, audio: false};
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
  
  @task
  private _startStream = task(function * (this: UserMediaSrc) {
		if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			this.error = "getUserMedia not available";
			return;
		}
		this.error = undefined;
		let constraints = this.mediaConstraints;
		try {
      this.videoStream = yield navigator.mediaDevices.getUserMedia(constraints)
      if (this._createSrcUrl) {
        this.videoUrl = this._createSrcUrl(this.videoStream);
      }
		} catch (err) {
			this.videoUrl = undefined;
			this.error = err;
		}
	})

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
	private _restartStream = task(function * (this: UserMediaSrc) {
		this._stopStream();
		yield this._startStream.perform();
	})

  @observes("mediaConstraints")
  _mediaConstraintsChanged(this: UserMediaSrc) {
    this._restartStream.perform();
  }
}
