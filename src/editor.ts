import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

class Editor {
  private del: CodeMirror.Editor;
  private currentMark: CodeMirror.TextMarker;

  constructor(defaultCode: string) {
    this.del = CodeMirror(document.getElementById('editor'), {
      value: defaultCode,
      gutters: ['CodeMirror-lint-markers'],
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true
    });
  }

  getValue() {
    return this.del.getValue();
  }

  on(event: string, handler: (editor: CodeMirror.Editor) => void) {
    this.del.on(event, handler);
  }

  markText(a: { line: number, ch: number }, b: { line: number, ch: number }) {
    this.clearMarks();
    // TODO: remove type assertion after CodeMirror type fix
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30555
    this.currentMark = (this.del as any).markText(a, b, { className: 'token-highlight' });
  }

  clearMarks() {
    if (this.currentMark) {
      this.currentMark.clear();
      this.currentMark = null;
    }
  }
}

export { Editor }
