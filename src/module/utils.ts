export const MODULE_NAME = 'Commander';

export function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game;
}

export function localize(key: string, data?: Record<string, unknown>) {
  key = 'COMMANDER.' + key;
  if (data) {
    return getGame().i18n.format(key, data);
  } else {
    return getGame().i18n.localize(key);
  }
}

export enum ARGUMENT_TYPES {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  RAW = 'raw',
}
