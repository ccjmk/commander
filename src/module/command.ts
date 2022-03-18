import Argument from './argument';

export default interface Command {
  name: string;
  namespace: string;
  description?: string;
  schema: string;
  args: Argument[];
  allow?: () => boolean;
  handler: (...params: any) => any;
}
