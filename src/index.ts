import { Editor } from './editor';
import { TokenList } from './token-list';
import { Compiler } from './compiler';
import { App } from './app';

import '../css/styles.scss';

const DEFAULT_CODE = `
class MyCustomClass {
  constructor(private something: string) {
    this.init();
  }
  
  init() {
    this.myString = 'asdf';
  }
}
`;

const editor = new Editor(DEFAULT_CODE);
const compiler = new Compiler();
const tokenList = new TokenList(document.getElementById('token-list'));

const app = new App(editor, compiler, tokenList);
app.init();
