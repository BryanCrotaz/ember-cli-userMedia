import Component from '@ember/component';
import { set, get, observer } from '@ember/object';
import RSVP from 'rsvp';
import layout from '../templates/components/user-media-src';
import { task } from 'ember-concurrency';

const {resolve} = RSVP;

export default Component.extend({

	layout: layout,
	tagName: '',

	mediaConstraints: null,

	videoUrl: null,
	error: null,

	_createSrc: null,
	_revokeSrc: null,

	init() {
		this._super();
		this.mediaConstraints = {video: true, audio: false};
		this._createSrc = URL ? URL.createObjectURL : function(stream) {return stream;};
		this._revokeSrc = URL ? URL.revokeObjectURL : function(stream) {return stream;};
	},

	_startStream: task(function * () {
		if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			set(this, 'error', "getUserMedia not available");
			return resolve();
		}
		set(this, 'error', null);
		let constraints = get(this, 'mediaConstraints');
		try {
			let stream = yield navigator.mediaDevices.getUserMedia(constraints)
			set(this, 'videoUrl', this._createSrc(stream));
		} catch (err) {
			// eslint-disable-next-line
			console.error("error creating user media stream: "+err+"\nconstraints: "+JSON.stringify(constraints, null, 2));
			set(this, 'videoUrl', null);
			set(this, 'error', err);
		}
	}),

	_stopStream: task(function * () {
		yield this._revokeSrc(get(this, 'videoUrl'));
		set(this, 'videoUrl', null);
	}),

	_restartStream: task(function * () {
		yield this.get('stopStream').perform();
		yield this.get('startStream').perform();
	}).restartable(),

	_updateStream: observer("mediaConstraints", "mediaConstraints.video", "mediaConstraints.audio", function() {
		this.get('_restartStream').perform()
	}),

	didInsertElement () {
		this._super(...arguments);
		this.get('_startStream').perform();
	},

	willDestroyElement () {
		this._super(...arguments);
		this.get('_stopStream').perform();
	}

});
