import CommandHandler from './CommandHandler';
import { MODULE_NAME } from './constants';

export default class Widget {
  constructor(private readonly handler: CommandHandler) {
    this.handler = handler;
  }

  private widget!: HTMLDivElement;
  private input!: HTMLInputElement;
  private suggestions!: HTMLDivElement;

  render = async () => {
    const template = await renderTemplate(`modules/${MODULE_NAME}/templates/widget.html`, {});
    const parser = new DOMParser();
    const html = parser.parseFromString(template, 'text/html');
    this.widget = html.body.firstElementChild as HTMLDivElement;
    document.body.append(this.widget);

    this.input = document.getElementById('commander-input') as HTMLInputElement;
    this.input.addEventListener('keyup', (ev) => {
      const commandInput = (ev.target as HTMLInputElement).value;
      if (ev.code !== 'Enter') {
        this.showSuggestions(this.handler.suggestCommand(commandInput));
        return;
      }
      this.handler.execute(commandInput);
      this.hide();
    });

    this.input.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    this.suggestions = document.getElementById('commander-suggestions') as HTMLDivElement;
    this.suggestions.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });

    const div = document.getElementById('commander') as HTMLElement;
    div.addEventListener('click', (ev) => {
      this.hide();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.code === 'Escape') {
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
    this.suggestions.innerText = '';
    this.suggestions.style.display = 'none';
    this.widget.style.display = 'none';
  };

  showSuggestions = (suggs?: string[]) => {
    if (!suggs) {
      this.suggestions.style.display = 'none';
      return;
    }
    let newSuggs: HTMLDivElement[] = [];
    if (suggs.length === 1) {
      const command = this.handler.commands.get(suggs[0])!;
      const div = document.createElement('div');
      div.className = 'commander-suggestion';
      let scheme = `<div>${command.scheme}</div>`;
      command.args.forEach((a) => {
        scheme = scheme.replace('$' + a.name, `<span class="commander-suggestion-${a.type}">$${a.name}</span>`);
      });
      $(scheme).appendTo(div);
      newSuggs.push(div);
    } else {
      if (suggs.length === 0) {
        suggs = ['No matching commands found'];
      }
      newSuggs = suggs.map((s) => {
        const div = document.createElement('div');
        div.className = 'commander-suggestion';
        div.innerText = s;
        return div;
      });
    }

    this.suggestions.replaceChildren(...newSuggs);
    this.suggestions.style.display = 'flex';
  };
}
