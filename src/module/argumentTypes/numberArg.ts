import { ArgumentType } from './ArgumentType';
import { ARGUMENT_TYPES } from '../utils/moduleUtils';

const numberArg: ArgumentType = {
  type: ARGUMENT_TYPES.NUMBER,
  replace: '([+-]?(?:[0-9]*[.])?[0-9]+)?',
  transform: (arg) => parseFloat(arg),
};
export default numberArg;
