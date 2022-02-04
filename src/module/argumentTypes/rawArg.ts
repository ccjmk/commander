import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../utils';

const rawArg: ArgumentType = {
  type: ARGUMENT_TYPES.RAW,
  replace: ' *?(.*)',
  last: true,
  transform: (arg) => arg,
};
export default rawArg;
