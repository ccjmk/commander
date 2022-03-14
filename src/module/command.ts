import Argument from './argument';

export default interface Command {
  name: string;
  description?: string;
  namespace: string;
  schema: string;
  args: Argument[];
  allow?: () => boolean;
  handler: (...params: any) => any;
}
