import * as ts from 'typescript';
import { Scanner } from './scanner';
import { TokenList } from './token-list';

(<any>window).ts = ts;

const editor = createEditor();
const scanner = new Scanner(editor.getValue());
const tokenList = new TokenList(document.getElementById('token-list'));
addEventListeners();

function createEditor() {
  return (window as any).CodeMirror(document.getElementById('editor'), {
    value: `const a = 123;
    const b = 432;`,
    gutters: ['CodeMirror-lint-markers'],
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true
  });
}

function addEventListeners() {
  editor.on('change', onChange);
  document.getElementById('scan-btn').addEventListener('click', onScanBtnClick);
}

function onChange(e) {
  console.clear();
  scanner.reset(editor.getValue());
}

let prevMarker;
function onScanBtnClick() {
  const token = scanner.scan();
  tokenList.add(token);
  const a = scanner.posToLineAndPos(token.tokenPos);
  const b = scanner.posToLineAndPos(token.textPos);
  if (prevMarker) {
    prevMarker.clear();
  }

  prevMarker = editor.markText(a, b, {className: 'token-highlight'});
}


