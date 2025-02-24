
customElements.define('answer-component',
    class extends HTMLElement {
      constructor() {
        super();
        const template = document
          .getElementById('answer-component')
          .content;
        const shadowRoot = this.attachShadow({ mode: 'open' })
          .appendChild(template.cloneNode(true));
          
      }
    })

  customElements.define('input-component',
    class extends HTMLElement {
      constructor() {
        super();
        const template = document
          .getElementById('input-component')
          .content;
        const shadowRoot = this.attachShadow({ mode: 'open' })
          .appendChild(template.cloneNode(true));
      }
    })

  customElements.define('question-component',
    class extends HTMLElement {
      constructor() {
        super();
        const template = document
          .getElementById('question-component')
          .content;
        const shadowRoot = this.attachShadow({ mode: 'open' })
          .appendChild(template.cloneNode(true));
      }
    })