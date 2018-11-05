interface TokenData {
  tokenKind: string;
  tokenValue: string;
  tokenText: string;
  startPos: number;
  textPos: number;
  tokenPos: number;
}

class TokenList {
  constructor(private rootEl: HTMLElement) {}

  add(tokenData: TokenData) {
    const tokenEl = document.createElement('div');
    tokenEl.classList.add('token');
    tokenEl.innerHTML = `
      <span>tokenKind: </span><span>${tokenData.tokenKind}</span><br>
      <span>tokenValue: </span><span>${tokenData.tokenValue}</span><br>
      <span>tokenText: </span><span>${tokenData.tokenText}</span><br>
      <span>startPos: </span><span>${tokenData.startPos}</span><br>
      <span>textPos: </span><span>${tokenData.textPos}</span><br>
      <span>tokenPos: </span><span>${tokenData.tokenPos}</span>
    `;

    this.rootEl.appendChild(tokenEl);
  }
}

export { TokenList };
