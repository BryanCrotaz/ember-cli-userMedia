import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user media src', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs`{{user-media-src}}`);

    assert.dom('*').hasText('');

    // Template block usage:" + EOL +
    await render(hbs`
      {{#user-media-src}}
        template block text
      {{/user-media-src}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
