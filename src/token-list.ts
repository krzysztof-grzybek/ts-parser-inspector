import { Token } from './compiler';

type OnTokenHoverFunc  =
  (event: Token) => void

class TokenList {
  private onTokenMouseEnter: OnTokenHoverFunc;
  private onTokenMouseLeave: OnTokenHoverFunc;

  constructor(private rootEl: HTMLElement) {}

  add(tokenData: Token) {
    const tokenEl = document.createElement('li');
    tokenEl.classList.add('token-item');
    tokenEl.innerHTML = `
      <p class="token">
        <span class="key">token_kind: </span><code class="value">${tokenData.tokenKind}</code><br>
        <span class="key">token_text: </span><code class="value">${tokenData.tokenText}</code><br>
        <span class="key">start_pos: </span><code class="value">${tokenData.startPos}</code><br>
        <span class="key">text_pos: </span><code class="value">${tokenData.textPos}</code><br>
        <span class="key">token_pos: </span><code class="value">${tokenData.tokenPos}</code>
      </p>
    `;

    tokenEl.onmouseenter = () => {
      if (this.onTokenMouseEnter) {
        this.onTokenMouseEnter(tokenData);
      }
    };

    tokenEl.onmouseleave = () => {
      if (this.onTokenMouseLeave) {
        this.onTokenMouseLeave(tokenData);
      }
    };

    this.rootEl.prepend(tokenEl);
  }

  clear() {
    const tokens = this.rootEl.querySelectorAll<HTMLDivElement>('.token-item');
    Array.from(tokens).forEach(tokenEl => {
      delete tokenEl.onmouseenter;
      delete tokenEl.onmouseleave;
      tokenEl.remove();
    });
  }

  onTokenHover(onEnter: OnTokenHoverFunc, onLeave?: OnTokenHoverFunc) {
    this.onTokenMouseEnter = onEnter;
    this.onTokenMouseLeave = onLeave;
  }
}

export { TokenList };
