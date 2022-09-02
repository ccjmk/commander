import Command from './command';
import ArgumentSuggestion from './argumentSuggestion';
import CommandHandler from './commandHandler';
import { getCommandSchemaWithoutArguments } from './utils/commandUtils';
import { localize, MODULE_NAMESPACE, getSetting, SETTING } from './utils/moduleUtils';

const ACTIVE = 'active';
const TOO_MANY_PLACEHOLDER = '...';

export default class Commander extends Application {
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
  private argSuggestionOffset = 0;

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
      const commandInput = this.input.value;

      switch (code) {
        case 'Enter':
          this.submitCommand(commandInput);
          break;
        case 'ArrowUp':
          this.previousArgSuggestion();
          break;
        case 'ArrowDown':
          this.nextArgSuggestion();
          break;
        case 'Tab':
          this.acceptSuggestion(commandInput);
          break;
        default:
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

  acceptSuggestion(commandInput: string): void {
    const currentSuggestion = getSelectedSuggestion();
    // const firstSuggestion = this.getFirstSuggestion();

    // if (!currentSuggestion && firstSuggestion) {
    //   currentSuggestion = firstSuggestion;
    //   this.setSuggestionActive(firstSuggestion, true);
    // }

    if (currentSuggestion) {
      this.submitCommand(commandInput);
    } else if (this.lastCommandSuggestion.length) {
      const commandNameWithSpace = getCommandSchemaWithoutArguments(this.lastCommandSuggestion[0]) + ' ';
      if (commandInput.length < commandNameWithSpace.length) {
        this.input.value = commandNameWithSpace;
        this.renderSuggestions(this.input.value);
      }
    }
  }

  submitCommand(commandInput: string): void {
    const currentSuggestion = getSelectedSuggestion();
    if (currentSuggestion) {
      const index = this.input.value.lastIndexOf(' ');
      const lastCommand = this.input.value.substring(0, index);
      const suggestedContent = quoteIfContainsSpaces((currentSuggestion as HTMLElement).dataset.content ?? '');
      const commandInput = `${lastCommand} ${suggestedContent} `;
      this.input.value = commandInput;
      deselectSuggestion(currentSuggestion);
      this.renderSuggestions(commandInput);
    } else {
      this.handler.execute(commandInput);
      this.close();
    }
  }

  previousArgSuggestion(): void {
    const current = getSelectedSuggestion();
    if (!current) {
      const lastSuggestion = getLastSuggestion();
      lastSuggestion && selectSuggestion(lastSuggestion);
      return;
    }
    const prev = getPreviousSuggestion(current);
    if (!prev) return;

    if (suggestionIsNotPlaceholder(prev)) {
      deselectSuggestion(current);
      selectSuggestion(prev);
    } else {
      if (this.argSuggestionOffset > 0) this.argSuggestionOffset--;
      this.renderArgumentSuggestions(this.handler.suggestArguments(this.input.value), this.argSuggestionOffset);
      const newFirst = getFirstSuggestion();
      if (!newFirst) return;
      const newNext = suggestionIsNotPlaceholder(newFirst) ? newFirst : getNextSuggestion(newFirst);
      if (!newNext) return;
      deselectSuggestion(getSelectedSuggestion());
      selectSuggestion(newNext);
    }
  }

  nextArgSuggestion(): void {
    const current = getSelectedSuggestion();
    if (!current) {
      const firstSuggestion = getFirstSuggestion();
      firstSuggestion && selectSuggestion(firstSuggestion);
      return;
    }
    const next = getNextSuggestion(current);
    if (!next) return;

    if (suggestionIsNotPlaceholder(next)) {
      deselectSuggestion(current);
      selectSuggestion(next);
    } else {
      this.argSuggestionOffset++;
      this.renderArgumentSuggestions(this.handler.suggestArguments(this.input.value), this.argSuggestionOffset);
      const newLast = getLastSuggestion();
      if (!newLast) return;
      const newNext = suggestionIsNotPlaceholder(newLast) ? newLast : getPreviousSuggestion(newLast);
      if (!newNext) return;
      deselectSuggestion(getSelectedSuggestion());
      selectSuggestion(newNext);
    }
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
    this.argSuggestionOffset = 0;
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

  renderArgumentSuggestions = (argSuggestions?: ArgumentSuggestion[], offset = 0) => {
    if (!argSuggestions) {
      this.argumentSuggestions.style.display = 'none';
      this.argumentSuggestions.replaceChildren();
      return;
    }
    argSuggestions.sort((a, b) => a.content.localeCompare(b.content));
    let newSuggs: HTMLDivElement[] = [];
    const maxSuggestions = getSetting(SETTING.MAX_SUGGESTIONS) as number;
    if (argSuggestions?.length) {
      if (offset) {
        argSuggestions = argSuggestions.slice(offset);
        argSuggestions.unshift({ content: `${TOO_MANY_PLACEHOLDER}(+${offset})` });
      }
      const offsetInLength = offset ? 1 : 0;
      if (argSuggestions.length - offsetInLength > maxSuggestions) {
        // if the array is too big, cut it at MAXth position and append a ...
        const deleted = argSuggestions.splice(maxSuggestions + offsetInLength, argSuggestions.length - maxSuggestions);
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
        return div;
      });
    }

    this.argumentSuggestions.replaceChildren(...newSuggs);
    this.argumentSuggestions.style.display = 'flex';
    const firstSuggestion = getFirstSuggestion();
    if (firstSuggestion) {
      selectSuggestion(firstSuggestion);
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

function suggestionIsNotPlaceholder(next: Element) {
  return !(next as HTMLElement).dataset.content?.startsWith(TOO_MANY_PLACEHOLDER);
}

function selectSuggestion(suggestion: Element) {
  suggestion.classList.add(ACTIVE);
}

function deselectSuggestion(suggestion: Element | null) {
  if (suggestion) suggestion.classList.remove(ACTIVE);
}

function getNextSuggestion(current: Element) {
  return current.nextElementSibling;
}

function getPreviousSuggestion(current: Element) {
  return current.previousElementSibling;
}

function getSelectedSuggestion() {
  return document.querySelector(`#commander-args-suggestions .${ACTIVE}`);
}

function getFirstSuggestion() {
  return document.querySelector('#commander-args-suggestions .commander-suggestion:first-child');
}

function getLastSuggestion() {
  return document.querySelector('#commander-args-suggestions .commander-suggestion:last-child');
}
