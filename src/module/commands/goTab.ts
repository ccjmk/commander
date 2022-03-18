import Command from '../command';
import { ARGUMENT_TYPES, MODULE_NAMESPACE } from '../utils/moduleUtils';

const goTabCommand: Command = {
  name: 'go',
  namespace: MODULE_NAMESPACE,
  description: 'Switches rightside tab (and focuses input for Chat tab)',
  schema: 'go $tab',
  args: [
    {
      name: 'tab',
      type: ARGUMENT_TYPES.STRING,
      suggestions: () => {
        const nav = document.querySelector('nav#sidebar-tabs');
        return Object.keys(ui.sidebar?.tabs ?? {}).map((content) => ({
          content,
          icon: nav?.querySelector(`[data-tab="${content}"] i`)?.className,
        }));
      },
    },
  ],
  allow: () => true,
  handler: ({ tab }) => {
    ui.sidebar!.activateTab(tab);
    if (tab === 'chat') {
      (document.querySelector('textarea#chat-message') as HTMLTextAreaElement)?.focus();
    }
  },
};
export default goTabCommand;
