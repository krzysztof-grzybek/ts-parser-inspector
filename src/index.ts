import * as ts from 'typescript';
import { Scanner } from './scanner';
import { Editor } from './editor';
import { TokenList } from './token-list';
import { App } from './app';

import '../css/styles.scss';

(<any>window).ts = ts;

const defaultCode = `
  const a = 'tsParserInspector';
`;
const editor = new Editor(defaultCode);
const scanner = new Scanner(editor.getValue());
const tokenList = new TokenList(document.getElementById('token-list'));

const app = new App(editor, scanner, tokenList);
app.init();
