# ember-cli-usermedia

Ember addon providing cross browser access to getUserMedia


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

* `ember install ember-cli-usermedia`

## Usage

To get a simple HTML5 autoplay video element that grabs the webcam use
```
{{user-media-src}}
```

To capture either video or audio use `mediaConstraints`. The value should be a valid constraints object for getUserMedia. The minimum requirement is the default of `{ video: true, audio: false }`.

```
myConstraints: { video: true; audio: false; } // default

...

{{user-media-src mediaConstraints=myConstraints}}
```

To do something more sophisticated in markup, use the block form:

```
{{#user-media-src mediaConstraints=myConstraints as |videoUrl| }}
	<video class="webcam" autoplay=true src={{videoUrl}} />
{{/user-media-src}}
```

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
