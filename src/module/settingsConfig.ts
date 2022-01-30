import { MODULE_NAME, getGame, localize } from './utils';

export function registerSettings(): void {
  getGame().settings.register(MODULE_NAME.toLowerCase(), 'debug', {
    name: localize('Settings.DebugMode.Name'),
    hint: localize('Settings.DebugMode.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => console.log(`${MODULE_NAME} | Debug mode > ${value}`),
  });
}
