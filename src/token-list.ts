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
          <span class="key">token_kind: </span><code class="value">${tokenData.tokenKind}</code><br>
          <span class="key">token_text: </span><code class="value">${tokenData.tokenText}</code><br>
          <span class="key">start_pos: </span><code class="value">${tokenData.startPos}</code><br>
          <span class="key">text_pos: </span><code class="value">${tokenData.textPos}</code><br>
          <span class="key">token_pos: </span><code class="value">${tokenData.tokenPos}</code>
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
