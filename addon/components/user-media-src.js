import Ember from 'ember';
import layout from '../templates/components/user-media-src';
import polyfill from '../helpers/webRTC-polyfill';

export default Ember.Component.extend({

	layout: layout,
	tagName: '',

	mediaConstraints: {video: true, audio:false},

	videoUrl: "",
	error: null,

	_createSrc: URL ? URL.createObjectURL : function(stream) {return stream;},
	_revokeSrc: URL ? URL.revokeObjectURL : function(stream) {return stream;},

	_startStream() {
		this.set('error', null);
		navigator.mediaDevices.getUserMedia(this.get('mediaConstraints'))
		.then(stream => {
			this.set('videoUrl', this._createSrc(stream));
		})
		.catch(err => {
			this.set('error', err);
		});
	},

	_stopStream() {
		this._revokeSrc(this.get('videoUrl'));
		this.set('videoUrl', null);
	},

	_updateStream: function () {
		this._stopStream();
		this._startStream();
	}.observes("mediaConstraints", "mediaConstraints.videa", "mediaConstraints.audio"),

	_startup: function () {
		this._startStream();
	}.on('willInsertElement'),

	_shutdown: function () {
		this._stopStream();
	}.on('didDestroyElement')

});
