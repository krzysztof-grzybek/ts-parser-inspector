import { Editor } from './editor';
import { TokenList } from './token-list';
import { Compiler } from './compiler';
import { App } from './app';

import '../css/styles.scss';

const DEFAULT_CODE =
`function getIdentifierToken(): SyntaxKind.Identifier | KeywordSyntaxKind {
  // Reserved words are between 2 and 11 characters
  // long and start with a lowercase letter
  const len = tokenValue.length;
  if (len >= 2 && len <= 11) {
    const ch = tokenValue.charCodeAt(0);
    if (ch >= CharacterCodes.a && ch <= CharacterCodes.z) {
      const keyword = textToKeyword.get(tokenValue);
      if (keyword !== undefined) {
        return token = keyword;
      }
    }
  }
  return token = SyntaxKind.Identifier;
}
`;

const editor = new Editor(DEFAULT_CODE);
const compiler = new Compiler();
const tokenList = new TokenList(document.getElementById('token-list'));

const app = new App(editor, compiler, tokenList);
app.init();
