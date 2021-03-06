import ArgumentType from './argumentType';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const stringArg: ArgumentType = {
  type: ARGUMENT_TYPES.STRING,
  replace: `([a-zA-Z0-9]+|"[^"]+")`,
  transform: (arg) => (arg.charAt(0) === '"' ? arg.substring(1, arg.length - 1) : arg),
};
export default stringArg;
