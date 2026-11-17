const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../../Web/scripts/popover-edit.js'), 'utf8');
const document = {
  createElement() {
    return {
      set textContent(value) {
        this.innerHTML = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      },
    };
  },
};
const Editor = vm.runInNewContext(`${script}\nBootstrapPopoverEditor`, { document });

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

test('numeric errors use the translated message appropriate to the field', async () => {
  const editor = Object.create(Editor.prototype);
  editor.input = { value: '-1' };
  editor.fieldType = 'number';
  editor.min = 0;
  editor.messages = { invalidInteger: 'Whole number', invalidNumber: 'Number' };
  editor.showError = (message) => { editor.error = message; };

  editor.step = '1';
  await editor.submit();
  assert.equal(editor.error, 'Whole number');

  editor.step = 'any';
  await editor.submit();
  assert.equal(editor.error, 'Number');
});
