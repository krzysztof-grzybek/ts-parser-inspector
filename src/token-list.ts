interface TokenData {
  tokenKind: string;
  tokenValue: string;
  tokenText: string;
  startPos: number;
  textPos: number;
  tokenPos: number;
}

type OnTokenHoverFunc  =
  (event: TokenData) => void


class TokenList {
  private onTokenMouseEnter: OnTokenHoverFunc;
  private onTokenMouseLeave: OnTokenHoverFunc;

  constructor(private rootEl: HTMLElement) {}

  add(tokenData: TokenData) {
    const tokenEl = document.createElement('li');
    tokenEl.classList.add('token-item');
    tokenEl.innerHTML = `
      <p class="token" start-pos="${tokenData.tokenPos}" end-pos="${tokenData.textPos}">
        <span class="key">token_kind: </span><code class="value">${tokenData.tokenKind}</code><br>
        <span class="key">token_text: </span><code class="value">${tokenData.tokenText}</code><br>
        <span class="key">start_pos: </span><code class="value">${tokenData.startPos}</code><br>
        <span class="key">text_pos: </span><code class="value">${tokenData.textPos}</code><br>
        <span class="key">token_pos: </span><code class="value">${tokenData.tokenPos}</code>
      </p>
    `;

    // TODO: remove event listeneres on DOM nodes remove
    tokenEl.addEventListener('mouseenter', (e) => {
      if (this.onTokenMouseEnter) {
        this.onTokenMouseEnter(tokenData);
      }
    });

    tokenEl.addEventListener('mouseleave', (e) => {
      if (this.onTokenMouseLeave) {
        this.onTokenMouseLeave(tokenData);
      }
    });
    this.rootEl.prepend(tokenEl);
  }

  clear() {
    const tokens = this.rootEl.querySelectorAll('.token-item');
    Array.from(tokens).forEach(tokenEl => {
      tokenEl.remove();
    });
  }

  onTokenHover(onEnter: OnTokenHoverFunc, onLeave?: OnTokenHoverFunc) {
    this.onTokenMouseEnter = onEnter;
    this.onTokenMouseLeave = onLeave;
  }
}

export { TokenList };
