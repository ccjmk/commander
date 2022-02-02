import { MODULE_NAME, getGame, localize, MODULE_ID } from './utils';

export function registerSettings(): void {
  getGame().settings.register(MODULE_ID, 'debug', {
    name: localize('Settings.DebugMode.Name'),
    hint: localize('Settings.DebugMode.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => console.log(`${MODULE_NAME} | ${localize('Settings.DebugMode.Log', { value })}`),
  });

  getGame().settings.register(MODULE_ID, 'onlyGM', {
    name: localize('Settings.OnlyDM.Name'),
    hint: localize('Settings.OnlyDM.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
}
