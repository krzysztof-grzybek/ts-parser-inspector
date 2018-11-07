import { Editor } from './editor';
import { Scanner } from './scanner';
import { TokenList } from './token-list';

class App {
  constructor(private editor: Editor, private scanner: Scanner, private tokenList: TokenList) {

  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.editor.on('change', this.onEditorChange.bind(this));
    document.getElementById('scan-btn').addEventListener('click', this.onScanBtnClick.bind(this));
    document.getElementById('reset-btn').addEventListener('click', this.onResetBtnClick.bind(this));
  }

  onEditorChange(e) {
    this.scanner.reset(this.editor.getValue());
    this.tokenList.clear();
    this.editor.clearMarks();
  }


  onScanBtnClick() {
    const token = this.scanner.scan();
    this.tokenList.add(token);
    const a = this.scanner.posToLineAndPos(token.tokenPos);
    const b = this.scanner.posToLineAndPos(token.textPos);
    this.editor.markText(a, b);
  }

  onResetBtnClick() {
    this.scanner.reset(this.editor.getValue());
    this.tokenList.clear();
    this.editor.clearMarks();
  }
}

export { App }
