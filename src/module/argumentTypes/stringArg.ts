import { ArgumentType } from '../ArgumentType';
import { ARGUMENT_TYPES } from '../utils';

const stringArg: ArgumentType = {
  type: ARGUMENT_TYPES.STRING,
  replace: `([a-zA-Z0-9]+|"[^"]+"|'[^']+')`,

  transform: (arg) => {
    console.log('on string transform'); // FIXME remove this
    console.log(arg);
    return ["'", '"'].includes(arg.charAt(0)) ? arg.substring(1, arg.length - 1) : arg;
  },
};
export default stringArg;
