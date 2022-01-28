# Commander

Commander is a tool inspired vaguely inspired by the likes of `Launchy` or `Wox`, and a similar feeling like `SearchAnywhere`, that lets you run commands from a shortcut-invoked prompt.

This module provides the command-line and the API for registering new commands, and will provide some example and general-use commands. The command-line is opened by clicking Ctrl+Backtick (the ` right next to the 1 in english keyboards).

## API & Helpers

The module provides an API available at the Module instance, alongside some helper functions. You can access them by doing:
```js
const {api, helpers} = game.modules.get('commander');
```

### api.commands
Map of all registered command names and the respective commands.

### api.execute (commandString)
Receives a string and tries to execute that command; first it parses the command name and checked if the command is allowed. If so, gets the command schema and tries to match the input to it, extracting the arguments. Then calls the command's handler function with said arguments. 

### api.register (command, replace?)
Receives a Command to register; the command is only registered if it passes integrity checks and it does not already exist (commands are identified by `name`). You can replace existing commands by sending a boolean flag as second argument. Commands have to be of the following shape:

```ts
interface Command {
  name: string;
  description?: string;
  schema: string;
  args: Argument[];
  allow?: () => boolean;
  handler: (...params: any) => any;
}
interface Argument {
  name: string;
  type: ARGUMENT_TYPES;
}
enum ARGUMENT_TYPES {
  'string', // accepts spaces ONLY IF you write the next between quotes.
  'number', // accepts numbers with decimals. It's just parseFloat(arg), so be tame with the decimals. Consider yourself warned!
  'boolean', // accepts 'true', 'on', 'false', 'off'
  'raw', // returns the whole remaining input string. If used with other arguments this MUST BE LAST.
}
```

### helpers.hasRole (role)
Receives a string and tries to match it to a role from `CONST.USER_ROLES`. If it's a valid role, returns the allow callback function that will check for this role whenever a command using that function is invoked. Example:

```js
// while defining a new command..
api.register({
  name: "myCommand",
  allow: helpers.hasRole('TRUSTED'), // this command can be invoked by a user with role TRUSTED or more
  ...
})
```

### helpers.hasPermissions (...permissions)
Receives a list of permission strings, and tries to match them to a permission from `CONST.USER_PERMISSIONS`. If all listed permissions are valid, returns the allow callback function that will check for ALL of these permissions whenever a command using that function is invoked. Example:

```js
// while defining a new command..
api.register({
  name: "myCommand",
  allow: helpers.hasPermissions('ACTOR_CREATE', 'ITEM_CREATE'), // this command can be invoked by a user with both the ACTOR_CREATE and ITEM_CREATE permissions
  ...
})
```

## Creating and sharing commands
* PRs for adding new commands will be considered so long as they are system-agnostic.
* System-specific commands should live in their own module.

## Hooks
The tool provides the following hooks:

### commanderReady
>  Called when Commander has finished initialization. At this point, the keybinding is functional and the API is available. Receives the Commander instance ready to be used.

### commanderExecute
 > Called when Commander has been asked to run a command, either via the provided widget or directly via the API. Receives the execution string requested to be executed.

## Examples

Lets register two commands: one to show a notification with the sum of two numbers, and another to log on the console the user input (except for the command), but only available for ASSISTANT and GAMEMASTER roles.

### Sum
```js
let { api } = game.modules.get('commander')
api.register({
    name: "sum",
    schema: "sum $a $b", // this is what you write to use this command, replacing $a and $b for numbers
    args: [
        { name: "a", type: "number" },
        { name: "b", type: "number" },
    ],
    handler: ({a, b}) => { // param names need to match the names or the args[]
      ui.notifications?.info("the sum is "+(a+b))
    }
})
// you can now open the command-line and type "sum 3 5" or..
api.execute("sum 3 5");
```

### LogInput
```js
let { api, helpers } = game.modules.get('commander')
api.register({
    name: "logInput",
    schema: "logInput $text $args", // remember RAW arguments last.
    args: [
        { name: "text", type: "string" },
        { name: "args", type: "raw" },
    ],
    allow: helpers.hasRole('ASSISTANT'), // we use a helper to define the allow function
    handler: ({text, args}) => { 
      console.log(`The text argument is: ${text}`)
      console.log(args)
    }
})
// you can now open the command-line and type, or..
api.execute(`logInput "this is a string with spaces" 123 .456 " asdas" !#$%^&*()`);
```

## Development

### Prerequisites

In order to build this module, recent versions of `node` and `npm` are
required. Most likely, using `yarn` also works, but only `npm` is officially
supported. We recommend using the latest lts version of `node`. If you use `nvm`
to manage your `node` versions, you can simply run

```
nvm install
```

in the project's root directory.

You also need to install the project's dependencies. To do so, run

```
npm install
```

### Building

You can build the project by running

```
npm run build
```

Alternatively, you can run

```
npm run build:watch
```

to watch for changes and automatically build as necessary.

### Linking the built project to Foundry VTT

In order to provide a fluent development experience, it is recommended to link
the built module to your local Foundry VTT installation's data folder. In
order to do so, first add a file called `foundryconfig.json` to the project root
with the following content:

```
{
  "dataPath": "/absolute/path/to/your/FoundryVTT"
}
```

(if you are using Windows, make sure to use `\` as a path separator instead of
`/`)

Then run

```
npm run link-project
```

On Windows, creating symlinks requires administrator privileges, so unfortunately
you need to run the above command in an administrator terminal for it to work.

### Creating a release

The workflow works basically the same as the workflow of the [League Basic JS Module Template], please follow the
instructions given there.

## Licensing

This project is being developed under the terms of the
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT] for Foundry Virtual Tabletop.

MIT - for more info please read the LICENSE file.

[League Basic JS Module Template]: https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT]: https://foundryvtt.com/article/license/
