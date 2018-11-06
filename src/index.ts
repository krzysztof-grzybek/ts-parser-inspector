import * as ts from 'typescript';
import { Scanner } from './scanner';
import { TokenList } from './token-list';

import '../css/styles.scss';

(<any>window).ts = ts;

const editor = createEditor();
const scanner = new Scanner(editor.getValue());
const tokenList = new TokenList(document.getElementById('token-list'));
let prevMarker;
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
  document.getElementById('reset-btn').addEventListener('click', onResetBtnClick);
}

function onChange(e) {
  scanner.reset(editor.getValue());
  tokenList.clear();
  if (prevMarker) {
    prevMarker.clear();
  }
}


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

function onResetBtnClick() {
  scanner.reset(editor.getValue());
  tokenList.clear();
  if (prevMarker) {
    prevMarker.clear();
  }
}


