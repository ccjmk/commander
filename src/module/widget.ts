import CommandHandler from './CommandHandler';
import { MODULE_NAME, localize } from './utils';

export default class Widget extends Application {
  constructor(private readonly handler: CommandHandler) {
    super({
      popOut: false,
      minimizable: false,
      resizable: false,
      template: `modules/${MODULE_NAME}/templates/widget.html`,
    });
    this.handler = handler;
  }

  private input!: HTMLInputElement;
  private suggestions!: HTMLDivElement;

  activateListeners() {
    this.input = document.getElementById('commander-input') as HTMLInputElement;
    this.setInputPlaceholder();

    this.input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Tab') ev.preventDefault();
    });
    this.input.addEventListener('keyup', (ev) => {
      // need keyUP to have the latest key registered
      const commandInput = (ev.target as HTMLInputElement).value;
      const firstSpace = commandInput.indexOf(' ');
      const command = firstSpace < 1 ? commandInput : commandInput.substring(0, firstSpace);
      const suggestions = this.handler.suggestCommand(command);
      if (ev.code === 'Tab') {
        if (suggestions?.length === 1) {
          this.input.value = suggestions[0] + ' ';
        }
      }
      if (ev.code === 'Enter') {
        this.handler.execute(commandInput);
        this.close();
        return;
      }
      this.showSuggestions(suggestions);
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
      this.close();
    });
    document.addEventListener('keydown', (ev) => {
      if (this.rendered && ev.code === 'Escape') {
        this.close();
        ev.stopPropagation();
      }
    });
    this.input.focus();
  }

  close(): Promise<void> {
    this.input.value = '';
    this.suggestions.innerText = '';
    this.suggestions.style.display = 'none';
    const widget = document.getElementById('commander');
    if (widget) widget.style.display = 'none';
    return super.close();
  }

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
      let schema = `<div>${command.schema}</div>`;
      command.args.forEach((a) => {
        schema = schema.replace('$' + a.name, `<span class="commander-suggestion-${a.type}">$${a.name}</span>`);
      });
      $(schema).appendTo(div);
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

  private setInputPlaceholder() {
    const maxPlaceholder = parseInt(localize('Widget.PlaceholderMax') ?? 1);
    const n = Math.floor(Math.random() * maxPlaceholder) + 1; // random int
    this.input.placeholder = localize(`Widget.Placeholder${n}`);
  }
}
