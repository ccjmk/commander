export const MODULE_NAME = 'Commander';
export const MODULE_NAMESPACE = 'commander';

export enum ARGUMENT_TYPES {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  RAW = 'raw',
}

export const enum SETTING {
  DEBUG = 'debug',
  ONLY_GM = 'onlyGM',
  MAX_SUGGESTIONS = 'maxSuggestions',
  FIRST_TIME_MESSAGE = 'firstTimeMessage',
}

export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}

export function localize(key: string, data?: Record<string, unknown>) {
  key = `CMD.${key}`;
  if (data) {
    return getGame().i18n.format(key, data);
  } else {
    return getGame().i18n.localize(key);
  }
}

export function getSetting(key: SETTING) {
  return getGame().settings.get(MODULE_NAMESPACE, key);
}

export function setSetting(key: SETTING, value: any) {
  return getGame().settings.set(MODULE_NAMESPACE, key, value);
}

export function registerSettings(): void {
  getGame().settings.register(MODULE_NAMESPACE, SETTING.DEBUG, {
    name: localize('Settings.DebugMode.Name'),
    hint: localize('Settings.DebugMode.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => console.log(`${MODULE_NAME} | ${localize('Settings.DebugMode.Log', { value })}`),
  });

  getGame().settings.register(MODULE_NAMESPACE, SETTING.ONLY_GM, {
    name: localize('Settings.OnlyGM.Name'),
    hint: localize('Settings.OnlyGM.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  getGame().settings.register(MODULE_NAMESPACE, SETTING.MAX_SUGGESTIONS, {
    name: localize('Settings.MaxSuggestions.Name'),
    hint: localize('Settings.MaxSuggestions.Hint'),
    scope: 'world',
    config: true,
    type: Number,
    default: 7,
  });

  getGame().settings.register(MODULE_NAMESPACE, SETTING.FIRST_TIME_MESSAGE, {
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });
}

export function handleIntroMessage() {
  const userIsGM = getGame().user?.isGM;
  const firstTimeFlag = getSetting(SETTING.FIRST_TIME_MESSAGE);

  if (userIsGM && !firstTimeFlag) {
    setSetting(SETTING.FIRST_TIME_MESSAGE, true);
    ui.sidebar!.activateTab('chat');
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: 'Commander' }),
      blind: true,
      content: `<h2>Thanks for trying Commander!</h2>
      <p>By default, you can open the command launcher with \`(backquote)+Alt</p>
      <p>You can change the shortcut in the 'Configure Controls' menu.</p>
      <hr>
      <p>For starters, you can try the 'help' command, that will list all available commands by default.</p>
      <p>Hope you enjoy the tool, and be sure to go by our Github repo to log issues or suggestions!</p>
      <a href="https://github.com/ccjmk/commander">Github</a>
      `,
    });
  }
}
