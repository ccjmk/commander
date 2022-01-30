import CommandHandler from './CommandHandler';
import { MODULE_NAME } from './constants';

export default class Widget {
  constructor(private readonly handler: CommandHandler) {
    this.handler = handler;
  }

  private widget!: HTMLDivElement;
  private input!: HTMLInputElement;

  render = async () => {
    const template = await renderTemplate(`modules/${MODULE_NAME}/templates/widget.html`, {});
    const parser = new DOMParser();
    const html = parser.parseFromString(template, 'text/html');
    this.widget = html.body.firstElementChild as HTMLDivElement;
    document.body.append(this.widget);

    this.input = document.getElementById('commander-input') as HTMLInputElement;
    this.input.addEventListener('keyup', (ev) => {
      if (ev.code !== 'Enter') return;
      const command = (ev.target as HTMLInputElement).value;
      this.handler.execute(command);
      this.hide();
    });

    this.input.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    const suggestions = document.getElementById('commander-suggestion') as HTMLElement;
    suggestions.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });

    const div = document.getElementById('commander') as HTMLElement;
    div.addEventListener('click', (ev) => {
      this.hide();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        this.hide();
      }
    });
  };

  show = () => {
    this.input.value = '';
    this.widget.style.display = 'block';
    this.input.focus();
  };

  hide = () => {
    this.input.value = '';
    this.widget.style.display = 'none';
  };
}
