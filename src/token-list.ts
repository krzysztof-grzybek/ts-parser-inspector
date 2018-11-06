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
    const tokenEl = document.createElement('li');
    tokenEl.classList.add('collection-item');
    tokenEl.innerHTML = `
      <div>
        <p class="token">
          <span class="key">token_kind: </span><span class="value">${tokenData.tokenKind}</span><br>
          <span class="key">token_value: </span><span class="value">${tokenData.tokenValue}</span><br>
          <span class="key">token_text: </span><span class="value">${tokenData.tokenText}</span><br>
          <span class="key">start_pos: </span><span class="value">${tokenData.startPos}</span><br>
          <span class="key">text_pos: </span><span class="value">${tokenData.textPos}</span><br>
          <span class="key">token_pos: </span><span class="value">${tokenData.tokenPos}</span>
        </p>
      </div>
    `;

    this.rootEl.prepend(tokenEl);
  }

  clear() {
    const tokens = this.rootEl.querySelectorAll('.collection-item');
    Array.from(tokens).forEach(tokenEl => {
      tokenEl.remove();
    });
  }
}

export { TokenList };
