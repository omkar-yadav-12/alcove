// Constants
// TODO: use word wrap?
const H1 = "================================\n";
const H2 = "--------------------------------\n";

// Singleton
let ConsoleNotifier = null;

/**
 * Private initialization function
 */
function init()
{
  ConsoleNotifier = {
    getName: () => { return "console"; },
    /**
     * Send a message through the Console by appropriately formatting the
     * output format. Typically this is setup to route through the Logger
     * system (in our case log4js) but we will not assume that is always the
     * case, in case things are reconfigured.
     */
    send: (message) => {
      console.log('\n' + H1 + message.subject + '\n' + H2 + '\n' + message.shortMessage + '\n' + H1);
    }
  };
}

/**
 * Module pattern -- return singleton factory function.
 */
module.exports = () => {
  if (!ConsoleNotifier) init();
  return ConsoleNotifier;
};
