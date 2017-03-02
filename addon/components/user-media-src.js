import Ember from 'ember';
import layout from '../templates/components/user-media-src';
import polyfill from '../helpers/webRTC-polyfill';

const {observer, get, set, on, RSVP} = Ember;
const {resolve} = RSVP;

export default Ember.Component.extend({

	layout: layout,
	tagName: '',

	mediaConstraints: {video: true, audio: false},

	videoUrl: null,
	error: null,

	_createSrc: URL ? URL.createObjectURL : function(stream) {return stream;},
	_revokeSrc: URL ? URL.revokeObjectURL : function(stream) {return stream;},

	_startStream() {
		if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			set(this, 'error', "getUserMedia not available");
			return resolve();
		}
		set(this, 'error', null);
		return navigator.mediaDevices.getUserMedia(get(this, 'mediaConstraints'))
		.then(stream => {
			set(this, 'videoUrl', this._createSrc(stream));
		})
		.catch(err => {
			set(this, 'videoUrl', null);
			set(this, 'error', err);
		});
	},

	_stopStream() {		
		this._revokeSrc(get(this, 'videoUrl'));
		set(this, 'videoUrl', null);
	},

	_updateStream: observer("mediaConstraints", "mediaConstraints.video", "mediaConstraints.audio", function() {
		this._stopStream();
		this._startStream();
	}),

	_startup: on('didInsertElement', function () {
		this._startStream();
	}),

	_shutdown: on('willDestroyElement', function () {
		this._stopStream();
	})

});
