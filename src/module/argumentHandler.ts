import integerArg from './argumentTypes/integerArg';
import numberArg from './argumentTypes/integerArg';
import quotedStringArg from './argumentTypes/quotedStringArg';
import stringArg from './argumentTypes/stringArg';
import { ARGUMENT_TYPES } from './constants';

export const argumentMap = new Map<ARGUMENT_TYPES, ArgumentType>();
argumentMap.set(ARGUMENT_TYPES.NUMBER, numberArg);
argumentMap.set(ARGUMENT_TYPES.INTEGER, integerArg);
argumentMap.set(ARGUMENT_TYPES.STRING, stringArg);
argumentMap.set(ARGUMENT_TYPES.QUOTED_STRING, quotedStringArg);

export interface ArgumentType {
  type: ARGUMENT_TYPES;
  replace: string;
  transform: (regexMatch: string) => any;
}
