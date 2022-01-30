import CommandHandler from './CommandHandler';
import { MODULE_NAME, localize } from './utils';

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
      if (ev.code === 'Tab') {
        // TODO handle tab?
      }
      if (ev.code === 'Enter') {
        this.handler.execute(commandInput);
        this.hide();
        return;
      }
      const firstSpace = commandInput.indexOf(' ');
      const command = firstSpace < 1 ? commandInput : commandInput.substring(0, firstSpace);
      this.showSuggestions(this.handler.suggestCommand(command));
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
    this.getInputPlaceholder();
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

  getInputPlaceholder() {
    const maxPlaceholder = parseInt(localize('Widget.PlaceholderMax'));
    const n = Math.floor(Math.random() * maxPlaceholder) + 1; // random int
    this.input.placeholder = localize(`Widget.Placeholder${n}`);
  }
}
