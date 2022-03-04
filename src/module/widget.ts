import Command, { Suggestion } from './command';
import CommandHandler from './commandHandler';
import { getCommandSchemaWithoutArguments } from './utils/commandUtils';
import { MODULE_NAME, localize } from './utils/moduleUtils';

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
  private command?: Command;

  activateListeners() {
    this.input = document.getElementById('commander-input') as HTMLInputElement;
    this.setInputPlaceholder();

    this.input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Tab') ev.preventDefault();
    });
    this.input.addEventListener('keyup', (ev) => {
      // need keyUP to have the latest key registered
      const commandInput = (ev.target as HTMLInputElement).value;
      if (ev.code === 'Enter') {
        this.handler.execute(commandInput);
        this.close();
        return;
      }

      let commandSuggestions = this.handler.suggestCommand(commandInput);
      if (commandSuggestions?.length) {
        this.command = commandSuggestions[0]; // save 1st command as potential/command to be executed
        if (ev.code === 'Tab') {
          this.input.value = getCommandSchemaWithoutArguments(commandSuggestions[0]) + ' ';
          commandSuggestions = [commandSuggestions.shift()!];
        }
      }

      this.showCommandSuggestions(commandSuggestions);
      this.showArgumentSuggestions(this.handler.suggestArguments(commandInput));
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

  close(): Promise<void> {
    this.input.value = '';
    this.commandSuggestions.innerText = '';
    this.commandSuggestions.style.display = 'none';
    const widget = document.getElementById('commander');
    if (widget) widget.style.display = 'none';
    return super.close();
  }

  showCommandSuggestions = (cmdSuggestions?: Command[]) => {
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

  showArgumentSuggestions = (argSuggestions?: Suggestion[]) => {
    if (!argSuggestions) {
      this.argumentSuggestions.style.display = 'none';
      return;
    }
    let newSuggs: HTMLDivElement[] = [];
    const tooManyPlaceholder = '...';
    if (argSuggestions?.length) {
      argSuggestions.forEach((arg) => console.log(arg.displayName));
      if (argSuggestions.length > 5) {
        // if the array is too big, cut it at 5th position and append a ...
        argSuggestions.splice(4, argSuggestions.length - 4, { displayName: tooManyPlaceholder });
      }
      newSuggs = argSuggestions.map((arg) => {
        const div = document.createElement('div');
        div.className = 'commander-suggestion';
        div.innerText = arg.displayName.indexOf(' ') > -1 ? `"${arg.displayName}"` : arg.displayName;
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
