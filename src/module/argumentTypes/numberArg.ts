import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../utils';

const numberArg: ArgumentType = {
  type: ARGUMENT_TYPES.NUMBER,
  replace: '([+-]?(?:[0-9]*[.])?[0-9]+)?',

  transform: (arg) => {
    console.log('on number transform'); // FIXME remove this
    console.log(arg);
    return parseFloat(arg);
  },
};
export default numberArg;
