import Component from '@ember/component';
import { set, get, observer } from '@ember/object';
import { on } from '@ember/object/evented';
import RSVP from 'rsvp';
import layout from '../templates/components/user-media-src';
import polyfill from '../helpers/webRTC-polyfill';

const {resolve} = RSVP;

export default Component.extend({

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
		let constraints = get(this, 'mediaConstraints');
		return navigator.mediaDevices.getUserMedia(constraints)
		.then(stream => {
			set(this, 'videoUrl', this._createSrc(stream));
		})
		.catch(err => {
			console.log("error creating user media stream: "+err+"\nconstraints: "+JSON.stringify(constraints, null, 2));
			set(this, 'videoUrl', null);
			set(this, 'error', err);
		});
	},

	_stopStream() {		
		this._revokeSrc(get(this, 'videoUrl'));
		if (!this.get('isDestroying') && !this.get('isDestroyed')) {
			set(this, 'videoUrl', null);
		}
	},

	_updateStream: observer("mediaConstraints", "mediaConstraints.video", "mediaConstraints.audio", function() {
		this._stopStream();
		this._startStream();
	}),

	didInsertElement () {
		this._super(...arguments);
		this._startStream();
	},

	willDestroyElement () {
		this._super(...arguments);
		this._stopStream();
	}

});
