import ArgumentType from './argumentType';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const booleanArg: ArgumentType = {
  type: ARGUMENT_TYPES.BOOLEAN,
  replace: '(true|false|on|off)',
  transform: (arg) => arg?.toLowerCase() === 'true' || arg?.toLowerCase() === 'on',
};
export default booleanArg;
