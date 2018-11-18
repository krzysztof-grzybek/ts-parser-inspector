import { Editor } from './editor';
import { TokenList } from './token-list';
import { Compiler, Token } from './compiler';

class App {
  constructor(private editor: Editor, private compiler: Compiler, private tokenList: TokenList) {
  }

  init() {
    this.addEventListeners();
    this.resetState();
  }

  addEventListeners() {
    this.editor.on('change', this.onEditorChange.bind(this));
    this.tokenList.onTokenHover(this.onTokenMouseEnter.bind(this), this.onTokenMouseLeave.bind(this));
  }

  onEditorChange(e) {
    this.resetState();
  }

  resetState() {
    const tokenList: Token[] = this.compiler.compile(this.editor.getValue());
    this.tokenList.clear();
    tokenList.forEach(token => {
      this.tokenList.add(token);
    });
  }

  onTokenMouseEnter(e) {
    const a = this.compiler.posToLineAndPos(e.tokenPos);
    const b = this.compiler.posToLineAndPos(e.textPos);
    this.editor.markText(a, b);
  }

  onTokenMouseLeave() {
    this.editor.clearMarks();
  }
}

export { App }
