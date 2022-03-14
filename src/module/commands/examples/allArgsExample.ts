import Command from '../../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../../utils/moduleUtils';

const allArgsCommand: Command = {
  name: 'test',
  namespace: MODULE_NAMESPACE,
  schema: 'test $str $num $bool $raw',
  args: [
    {
      name: 'str',
      type: ARGUMENT_TYPES.STRING,
    },
    {
      name: 'num',
      type: ARGUMENT_TYPES.NUMBER,
    },
    {
      name: 'bool',
      type: ARGUMENT_TYPES.BOOLEAN,
    },
    {
      name: 'raw',
      type: ARGUMENT_TYPES.RAW,
    },
  ],
  handler: ({ str, num, bool, raw }) => {
    ui.notifications?.info(`string: [${str}] - number: [${num}] - boolean: [${bool}]`);
    ui.notifications?.info(`raw: [${raw}]`);
  },
};
export default allArgsCommand;
