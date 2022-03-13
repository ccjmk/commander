import Command from './command';
import Suggestion from './suggestion';
import CommandHandler from './commandHandler';
import { getCommandSchemaWithoutArguments } from './utils/commandUtils';
import { MODULE_NAME, localize } from './utils/moduleUtils';

const ACTIVE = 'active';
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
  private commandSuggestions!: HTMLDivElement;
  private argumentSuggestions!: HTMLDivElement;
  private lastCommandSuggestion: Command[] = [];

  activateListeners() {
    this.input = document.getElementById('commander-input') as HTMLInputElement;
    this.setInputPlaceholder();

    this.input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Tab' || ev.code === 'ArrowUp' || ev.code === 'ArrowDown') {
        ev.preventDefault();
        return;
      }
    });
    this.input.addEventListener('keyup', ({ code }) => {
      // need keyUP to have the latest key registered
      const commandInput = this.input.value;

      if (code === 'Enter') {
        this.handleEnter(commandInput);
        return;
      }

      if (code === 'ArrowUp') {
        this.handleUp();
        return;
      }

      if (code === 'ArrowDown') {
        this.handleDown();
        return;
      }
      if (code === 'Tab') {
        this.handleTab();
      }
      this.renderSuggestions(commandInput);
    });

    this.input.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    this.commandSuggestions = document.getElementById('commander-cmd-suggestions') as HTMLDivElement;
    this.commandSuggestions.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    this.argumentSuggestions = document.getElementById('commander-args-suggestions') as HTMLDivElement;
    this.argumentSuggestions.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });

    const div = document.getElementById('commander') as HTMLElement;
    div.addEventListener('click', () => {
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

  handleTab(): void {
    if (this.lastCommandSuggestion.length) {
      this.input.value = getCommandSchemaWithoutArguments(this.lastCommandSuggestion[0]) + ' ';
      this.renderSuggestions(this.input.value);
    }
  }

  handleEnter(commandInput: string): void {
    const currentSuggestion = this.getSelectedSuggestion();
    if (currentSuggestion) {
      const commandInput = `${this.input.value.trim()} ${(currentSuggestion as HTMLElement).dataset.content} `;
      this.input.value = commandInput;
      this.setSuggestionActive(currentSuggestion, false);
      this.renderSuggestions(commandInput);
    } else {
      this.handler.execute(commandInput);
      this.close();
    }
  }

  handleUp(): void {
    const current = this.getSelectedSuggestion();
    if (current) {
      const prev = this.getPreviousSuggestion(current);
      if (prev) {
        this.setSuggestionActive(current, false);
        this.setSuggestionActive(prev, true);
      }
    } else {
      const lastSuggestion = this.getLastSuggestion();
      lastSuggestion && this.setSuggestionActive(lastSuggestion, true);
    }
    return;
  }
  handleDown(): void {
    const current = this.getSelectedSuggestion();
    if (current) {
      const next = this.getNextSuggestion(current);
      if (next) {
        this.setSuggestionActive(current, false);
        this.setSuggestionActive(next, true);
      }
    } else {
      const firstSuggestion = this.getFirstSuggestion();
      firstSuggestion && this.setSuggestionActive(firstSuggestion, true);
    }
    return;
  }

  setSuggestionActive(suggestion: Element, isActive: boolean): void {
    if (isActive) {
      suggestion.classList.add(ACTIVE);
    } else {
      suggestion.classList.remove(ACTIVE);
    }
  }

  getNextSuggestion(current: Element) {
    return current.nextElementSibling;
  }

  getPreviousSuggestion(current: Element) {
    return current.previousElementSibling;
  }

  getSelectedSuggestion() {
    return document.querySelector(`#commander-args-suggestions .${ACTIVE}`);
  }

  getFirstSuggestion() {
    return document.querySelector('#commander-args-suggestions .commander-suggestion:first-child');
  }

  getLastSuggestion() {
    return document.querySelector('#commander-args-suggestions .commander-suggestion:last-child');
  }

  close(): Promise<void> {
    this.input.value = '';
    this.commandSuggestions.innerText = '';
    this.commandSuggestions.style.display = 'none';
    const widget = document.getElementById('commander');
    if (widget) widget.style.display = 'none';
    return super.close();
  }

  renderSuggestions(commandInput: string) {
    const commandSuggestions = this.handler.suggestCommand(commandInput);
    this.renderCommandSuggestions(commandSuggestions);
    this.renderArgumentSuggestions(this.handler.suggestArguments(this.input.value));
    this.lastCommandSuggestion = commandSuggestions || [];
  }

  renderCommandSuggestions = (cmdSuggestions?: Command[]) => {
    if (!cmdSuggestions) {
      this.commandSuggestions.style.display = 'none';
      return;
    }
    let newSuggs: HTMLDivElement[] = [];
    if (cmdSuggestions.length === 1) {
      const command = cmdSuggestions[0];
      const div = document.createElement('div');
      div.className = 'commander-suggestion';
      let schema = `<div>${command.schema}</div>`;
      command.args.forEach((a) => {
        schema = schema.replace('$' + a.name, `<span class="commander-suggestion-${a.type}">$${a.name}</span>`);
      });
      $(schema).appendTo(div);
      newSuggs.push(div);
    } else {
      let cmdSuggestionNames = cmdSuggestions.map((c) => getCommandSchemaWithoutArguments(c));
      if (cmdSuggestions.length === 0) {
        cmdSuggestionNames = ['No matching commands found'];
      }
      newSuggs = cmdSuggestionNames.map((s) => {
        const div = document.createElement('div');
        div.className = 'commander-suggestion';
        div.innerText = s;
        return div;
      });
    }

    this.commandSuggestions.replaceChildren(...newSuggs);
    this.commandSuggestions.style.display = 'flex';
  };

  renderArgumentSuggestions = (argSuggestions?: Suggestion[]) => {
    if (!argSuggestions) {
      this.argumentSuggestions.style.display = 'none';
      return;
    }
    let newSuggs: HTMLDivElement[] = [];
    const tooManyPlaceholder = '...';
    if (argSuggestions?.length) {
      if (argSuggestions.length > 5) {
        // if the array is too big, cut it at 5th position and append a ...
        argSuggestions.splice(4, argSuggestions.length - 4, { content: tooManyPlaceholder });
      }
      newSuggs = argSuggestions.map((arg) => {
        const div = document.createElement('div');
        div.className = 'commander-suggestion';
        div.innerText = arg.content.indexOf(' ') > -1 ? `"${arg.content}"` : arg.content;
        div.dataset.content = arg.content;
        if (arg.icon) {
          const icon = document.createElement('i');
          icon.className = `${arg.icon} commander-suggestion-img`;
          div.prepend(icon);
        } else if (arg.img) {
          const img = document.createElement('img');
          img.className = 'suggestion-img';
          img.setAttribute('src', arg.img);
          div.prepend(img);
        }
        // div.addEventListener('click', (e) => { // TODO consider how to appropriately build into the existing input value without replacing already-written args before
        //   const suggestion = (e.target as HTMLElement).innerHTML;
        //   if (suggestion !== tooManyPlaceholder) {
        //     this.input.value = `${getCommandSchemaWithoutArguments(this.command!)} ${suggestion}`; // if we have argument suggestions 'command' is set
        //   }
        //   this.input.focus();
        // });
        return div;
      });
    }

    this.argumentSuggestions.replaceChildren(...newSuggs);
    this.argumentSuggestions.style.display = 'flex';
  };

  private setInputPlaceholder() {
    const maxPlaceholder = parseInt(localize('Widget.PlaceholderQuantity') ?? 1);
    const n = Math.floor(Math.random() * maxPlaceholder) + 1; // random int
    this.input.placeholder = localize(`Widget.Placeholder${n}`);
  }
}
