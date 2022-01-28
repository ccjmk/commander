import { Handler } from './commandsHandler';

export default class Widget extends Dialog {
  constructor(handler: Handler) {
    super(
      {
        title: 'FoundryCLI',
        content: `<div><input id="fcli-input" type="text" value="" placeholder="Type to show suggestions"></div>`, // TODO i18n this
        buttons: {},
        default: '',
      },
      {
        classes: [],
        width: 720,
        resizable: false,
      },
    );
    this.handler = handler;
  }
  handler;

  activateListeners(html: JQuery<HTMLElement>): void {
    const input = document.getElementById('fcli-input') as HTMLInputElement;
    input.addEventListener('keyup', (ev) => {
      if (ev.code !== 'Enter') return;
      const comamnd = (ev.target as HTMLInputElement).value;
      this.handler.execute(comamnd);
      this.close();
    });
    input.focus();
  }
}
