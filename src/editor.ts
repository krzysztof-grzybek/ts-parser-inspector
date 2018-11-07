class Editor {
  private del: any; // TODO: provide proper type
  private currentMark: any; // TODO: provider proper type

  constructor(defaultCode: string) {
    this.del = (window as any).CodeMirror(document.getElementById('editor'), {
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

  on(event: string, handler: Function) {
    this.del.on(event, handler);
  }

  markText(a: { line: number, ch: number }, b: { line: number, ch: number }) {
    this.clearMarks();
    this.currentMark = this.del.markText(a, b, { className: 'token-highlight' });
  }

  clearMarks() {
    if (this.currentMark) {
      this.currentMark.clear();
      this.currentMark = null;
    }
  }
}

export { Editor }
