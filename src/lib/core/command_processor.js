/**
 * Command processor
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.0
 */

'use strict';


/**
 * Command processor class
 *
 * @since       0.1.0
 */
class command_processor {


    /**
     * Get things started!
     *
     * @since       0.1.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        let string      = require('string');
        let Discordie   = require('discordie');
        let logger      = require(GLOBAL.k9path + '/lib/core/logging.js');
        let config      = require(GLOBAL.k9path + '/lib/core/config.js');
        //let permissions = require(GLOBAL.k9path + '/lib/core/permissions.js');
        let utils       = require(GLOBAL.k9path + '/lib/core/utils.js');
        let modules     = require(GLOBAL.k9path + '/lib/core/modules.js');
        let trigger     = config.get('config', 'trigger', '!').toLowerCase();

        GLOBAL.bot.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (res) => {
            logger.notify('info', 'New message:\n  From: ' + res.message.author.username + '\n  Content: ' + res.message.content + '\n  Timestamp: ' + res.message.timestamp );

            let command_string = res.message.content;

            // Make sure we're talking to K9!
            if(! string(command_string.toLowerCase()).startsWith(trigger.toLowerCase()) && ! utils.isBotMessage(res.message.channel_id)) {
                return;
            }

            // Parse out any arguements
            command_string = command_string.split(' ');
            let command    = command_string.reverse().pop();
            let arguement  = command_string.reverse().join(' ');


            // Strip trigger
            command = string(command.toLowerCase()).chompLeft(trigger.toLowerCase()).s;

            // Find containing module
            let module = modules.search(command);

            // Prefix command
            command = '_' + command;

            // Run the command!
            if(module) {
                GLOBAL.k9modules[module][command](res, arguement);
            }
        });
    }
}

module.exports = new command_processor();
