import Command from './command';
import Suggestion from './suggestion';
import CommandHandler from './commandHandler';
import { getCommandSchemaWithoutArguments } from './utils/commandUtils';
import { localize, MODULE_NAMESPACE } from './utils/moduleUtils';
import { getSetting, SETTING } from './settings';

const ACTIVE = 'active';
const TOO_MANY_PLACEHOLDER = '...';

export default class Widget extends Application {
  constructor(private readonly handler: CommandHandler) {
    super({
      popOut: false,
      minimizable: false,
      resizable: false,
      template: `modules/${MODULE_NAMESPACE}/templates/widget.html`,
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
        this.handleSubmitCommand(commandInput);
      } else if (code === 'ArrowUp') {
        this.handlePreviousSuggestion();
      } else if (code === 'ArrowDown') {
        this.handleNextSuggestion();
      } else if (code === 'Tab') {
        this.handleAcceptSuggestion(commandInput);
      } else {
        this.renderSuggestions(commandInput);
      }
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

  handleAcceptSuggestion(commandInput: string): void {
    const currentSuggestion = this.getSelectedSuggestion();
    // const firstSuggestion = this.getFirstSuggestion();

    // if (!currentSuggestion && firstSuggestion) {
    //   currentSuggestion = firstSuggestion;
    //   this.setSuggestionActive(firstSuggestion, true);
    // }

    if (currentSuggestion) {
      this.handleSubmitCommand(commandInput);
    } else if (this.lastCommandSuggestion.length) {
      const commandNameWithSpace = getCommandSchemaWithoutArguments(this.lastCommandSuggestion[0]) + ' ';
      if (commandInput.length < commandNameWithSpace.length) {
        this.input.value = commandNameWithSpace;
        this.renderSuggestions(this.input.value);
      }
    }
  }

  handleSubmitCommand(commandInput: string): void {
    const currentSuggestion = this.getSelectedSuggestion();
    if (currentSuggestion) {
      const index = this.input.value.lastIndexOf(' ');
      const lastCommand = this.input.value.substring(0, index);
      const suggestedContent = quoteIfContainsSpaces((currentSuggestion as HTMLElement).dataset.content ?? '');
      const commandInput = `${lastCommand} ${suggestedContent} `;
      this.input.value = commandInput;
      this.setSuggestionActive(currentSuggestion, false);
      this.renderSuggestions(commandInput);
    } else {
      this.handler.execute(commandInput);
      this.close();
    }
  }

  handlePreviousSuggestion(): void {
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

  handleNextSuggestion(): void {
    const current = this.getSelectedSuggestion();
    if (current) {
      const next = this.getNextSuggestion(current);
      if (next && nextSuggestionIsNotPlaceholder(next)) {
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
    this.commandSuggestions.replaceChildren();
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
      this.argumentSuggestions.replaceChildren();
      return;
    }
    argSuggestions.sort((a, b) => a.content.localeCompare(b.content));
    let newSuggs: HTMLDivElement[] = [];
    const maxSuggestions = getSetting(SETTING.MAX_SUGGESTIONS) as number;
    if (argSuggestions?.length) {
      if (argSuggestions.length > maxSuggestions) {
        // if the array is too big, cut it at MAXth position and append a ...
        const deleted = argSuggestions.splice(maxSuggestions, argSuggestions.length - maxSuggestions);
        argSuggestions.push({ content: `${TOO_MANY_PLACEHOLDER}(+${deleted.length})` });
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
          img.className = 'commander-suggestion-img';
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

    const firstSuggestion = this.getFirstSuggestion();
    if (firstSuggestion) {
      this.setSuggestionActive(firstSuggestion, true);
    }
  };

  private setInputPlaceholder() {
    const maxPlaceholder = parseInt(localize('Widget.PlaceholderQuantity') ?? 1);
    const n = Math.floor(Math.random() * maxPlaceholder) + 1; // random int
    this.input.placeholder = localize(`Widget.Placeholder${n}`);
  }
}
function quoteIfContainsSpaces(content: string) {
  content = content.trim();
  return content.indexOf(' ') > 0 ? `"${content}"` : content;
}

function nextSuggestionIsNotPlaceholder(next: Element) {
  return !(next as HTMLElement).dataset.content?.startsWith(TOO_MANY_PLACEHOLDER);
}
