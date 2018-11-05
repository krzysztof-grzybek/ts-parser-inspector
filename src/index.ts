import * as ts from "typescript";

(<any>window).ts = ts;
let  scanner = ts.createScanner(ts.ScriptTarget.ES5, true, ts.LanguageVariant.Standard, '' );

addEventListeners();

function addEventListeners() {
  document.getElementById('input-code').addEventListener('input', onTextareaInput);
  document.getElementById('scan-btn').addEventListener('click', onScanBtnClick);
}

function onTextareaInput(e) {
  console.clear();
  scanner = ts.createScanner(
    ts.ScriptTarget.ES5,
    true,
    ts.LanguageVariant.Standard,
    (<HTMLTextAreaElement>e.target).value
  );
}

function onScanBtnClick() {
  const tokenKind = ts.SyntaxKind[scanner.scan()];
  const tokenValue = scanner.getTokenValue();
  const tokenText = scanner.getTokenText();

  const startPos = scanner.getStartPos();
  const textPos = scanner.getTextPos();
  const tokenPos = scanner.getTokenPos();

  console.log({ tokenKind, tokenValue, lexeme: tokenText, startPos, textPos, tokenPos })
}
