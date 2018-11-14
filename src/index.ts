import * as ts from 'typescript';
import { Editor } from './editor';
import { TokenList } from './token-list';
import { Compiler } from './compiler';
import { App } from './app';

import '../css/styles.scss';

(<any>window).ts = ts;

const defaultCode = 'const a = `asdf${sdfwes}asdffdwef`;';
const editor = new Editor(defaultCode);
const compiler = new Compiler();
const tokenList = new TokenList(document.getElementById('token-list'));

const app = new App(editor, compiler, tokenList);
app.init();
