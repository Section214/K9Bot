/**
 * Command processor
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Command processor class
 *
 * @since       1.0.0
 */
class command_processor {


    /**
     * Get things started!
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        let string      = require('string');
        let Discordie   = require('discordie');
        let logger      = require(GLOBAL.k9path + '/lib/core/logging.js');
        let config      = require(GLOBAL.k9path + '/lib/core/config.js');
        let permissions = require(GLOBAL.k9path + '/lib/core/permissions.js');
        let utils       = require(GLOBAL.k9path + '/lib/core/utils.js');
        let trigger     = config.get('trigger', '!').toLowerCase();

        GLOBAL.bot.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (res) => {
            logger.notify('info', 'New message:\n  From: ' + res.message.author.username + '\n  Content: ' + res.message.content + '\n  Timestamp: ' + res.message.timestamp );

            let command = res.message.content.toLowerCase();

            // Make sure we're talking to K9!
            if(! string(command).startsWith(trigger) && ! utils.isBotMessage(res.message.channel_id)) {
                return;
            }

            console.log('processing');

            command = string(command).chompLeft(trigger).s;

            console.log(command);

            if(permissions.hasAccess(res.message.author.id, command)) {
                switch(command) {
                    case 'ping':
                        res.message.reply('pong');
                        break;
                }
            }
        });
    }
}

module.exports = new command_processor();
