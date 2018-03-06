# ember-cli-usermedia

Ember addon providing cross browser access to getUserMedia

## Installation

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

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
