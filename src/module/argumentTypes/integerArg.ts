import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../constants';

const integerArg: ArgumentType = {
  type: ARGUMENT_TYPES.INTEGER,
  replace: '(-?(?:[0-9]+))?',
  transform: (arg) => {
    console.log('on integer transform'); // FIXME remove this
    console.log(arg);
    return parseInt(arg);
  },
};
export default integerArg;
