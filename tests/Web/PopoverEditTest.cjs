const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../../Web/scripts/popover-edit.js'), 'utf8');
const document = {
  createElement(tagName) {
    if (tagName === 'textarea') {
      // Mimics the browser: assigning innerHTML decodes entities into value
      return {
        set innerHTML(html) {
          this.value = String(html)
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#0?39;/g, "'")
            .replace(/&amp;/g, '&');
        },
      };
    }
    return {
      set textContent(value) {
        this.innerHTML = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      },
    };
  },
};
const window = {};
const Editor = vm.runInNewContext(`${script}\nBootstrapPopoverEditor`, { document, window });

test('popover buttons use escaped translated labels', () => {
  const editor = Object.create(Editor.prototype);
  editor.fieldId = 'field';
  editor.fieldType = 'text';
  editor.messages = { accept: "Save <'now'>", cancel: 'Abbrechen & close' };

  const html = editor.getPopoverContent();
  assert.match(html, /Save &lt;&#39;now&#39;&gt;/);
  assert.match(html, /Abbrechen &amp; close/);
  assert.doesNotMatch(html, />Aceptar<|>Cancelar</);
});

test('only text fields get a clear button with an escaped translated label', () => {
  const editor = Object.create(Editor.prototype);
  editor.messages = { clear: "Vider l'entrée" };

  editor.fieldType = 'text';
  const textHtml = editor.getInputHtml('field_edit_input');
  assert.match(textHtml, /class='searchclear bi bi-x-circle-fill popover-clear'/);
  assert.match(textHtml, /aria-label='Vider l&#39;entrée'/);

  editor.fieldType = 'number';
  editor.step = '1';
  assert.doesNotMatch(editor.getInputHtml('field_edit_input'), /popover-clear/);
});

function fakeEditor(tip = null) {
  const editor = Object.create(Editor.prototype);
  editor.popoverInstance = {
    tip,
    show() {
      editor.shown = true;
    },
    hide() {
      editor.shown = false;
    },
  };
  return editor;
}

test('opening an editor closes the one already open', () => {
  const first = fakeEditor();
  const second = fakeEditor();

  first.showPopover();
  assert.equal(Editor.openEditor, first);

  second.showPopover();
  assert.equal(first.shown, false);
  assert.equal(first.isPopoverOpen, false);
  assert.equal(second.shown, true);
  assert.equal(Editor.openEditor, second);

  // The late hidden event of the first editor must not clear the second
  first.onPopoverHidden();
  assert.equal(Editor.openEditor, second);

  second.closePopover();
  assert.equal(Editor.openEditor, null);
});

test('popover elements are looked up in the editor own popover only', () => {
  const ownElement = {};
  const tip = {
    querySelector(selector) {
      return selector === '.popover-save' ? ownElement : null;
    },
  };

  assert.equal(fakeEditor(tip).getPopoverElement('.popover-save'), ownElement);
  assert.equal(fakeEditor(null).getPopoverElement('.popover-save'), null);
});

test('numeric errors use the translated message appropriate to the field', async () => {
  const editor = Object.create(Editor.prototype);
  editor.input = { value: '-1' };
  editor.fieldType = 'number';
  editor.min = 0;
  editor.messages = { invalidInteger: 'Whole number', invalidNumber: 'Number' };
  editor.showError = (message) => {
    editor.error = message;
  };

  editor.step = '1';
  await editor.submit();
  assert.equal(editor.error, 'Whole number');

  editor.step = 'any';
  await editor.submit();
  assert.equal(editor.error, 'Number');
});

test('saving shows the shared toast from the global footer', () => {
  const shown = [];
  window.showToastById = (id) => shown.push(id);

  Object.create(Editor.prototype).showSuccessToast();
  assert.deepEqual(shown, ['inlineEditSavedToast']);

  delete window.showToastById;
  assert.doesNotThrow(() => Object.create(Editor.prototype).showSuccessToast());
});

test('typed inputs disable browser autocomplete', () => {
  const editor = Object.create(Editor.prototype);
  editor.messages = {};
  editor.step = '1';

  for (const fieldType of ['text', 'number', 'textarea']) {
    editor.fieldType = fieldType;
    assert.match(editor.getInputHtml('field_edit_input'), /autocomplete='off'/, fieldType);
  }
});

class TestEditor extends Editor {
  init() {}
}

test('stored values are decoded once for the editor', () => {
  const richText = new TestEditor({ fieldType: 'richtext', fieldValue: '&lt;p&gt;Tom &amp;amp; Jerry&lt;/p&gt;' });
  assert.equal(richText.fieldValue, '<p>Tom &amp; Jerry</p>');

  const text = new TestEditor({ fieldType: 'text', fieldValue: 'Ana &lt;ana@example.com&gt;' });
  assert.equal(text.fieldValue, 'Ana <ana@example.com>');

  assert.equal(new TestEditor({ fieldType: 'richtext', fieldValue: null }).fieldValue, null);
  assert.equal(new TestEditor({ fieldType: 'number', fieldValue: 5 }).fieldValue, 5);
});

function autocompleteEditor({ fieldType = 'text', menuVisible = false } = {}) {
  const calls = { autocomplete: [], tipListeners: [] };
  const $input = {
    userAutoComplete(url, callback) {
      calls.url = url;
      calls.select = callback;
    },
    autocomplete(...args) {
      calls.autocomplete.push(args);
      return { is: (selector) => selector === ':visible' && menuVisible };
    },
  };
  window.jQuery = () => $input;

  const editor = new TestEditor({ fieldType, autocompleteUrl: 'autocomplete.php?type=user' });
  editor.input = { value: '' };
  editor.clearError = () => {};
  editor.popoverInstance = {
    tip: {
      addEventListener(type, listener, capture) {
        calls.tipListeners.push({ type, listener, capture });
      },
    },
  };
  return { editor, calls };
}

test('choosing a suggested user fills the field with name and email', () => {
  const { editor, calls } = autocompleteEditor();
  editor.setupUserAutocomplete();

  assert.equal(calls.url, 'autocomplete.php?type=user');
  assert.deepEqual(calls.autocomplete[0], ['option', 'minLength', Editor.AUTOCOMPLETE_MIN_LENGTH]);

  calls.select({ item: { data: { Name: 'Ana Pérez', Email: 'ana@example.com' } } });
  assert.equal(editor.input.value, 'Ana Pérez <ana@example.com>');

  delete window.jQuery;
});

test('keys pressed while the suggestions menu is open are left to the menu', () => {
  const { editor, calls } = autocompleteEditor({ menuVisible: true });
  editor.setupUserAutocomplete();

  const [{ type, listener, capture }] = calls.tipListeners;
  assert.equal(type, 'keydown');
  assert.equal(capture, true);

  listener();
  assert.equal(editor.autocompleteMenuOpen, true);

  delete window.jQuery;
});

test('user suggestions are only set up for text fields with an autocomplete URL', () => {
  const { editor, calls } = autocompleteEditor({ fieldType: 'select' });
  editor.setupUserAutocomplete();
  assert.equal(calls.url, undefined);

  editor.fieldType = 'text';
  editor.autocompleteUrl = '';
  editor.setupUserAutocomplete();
  assert.equal(calls.url, undefined);

  delete window.jQuery;
});
