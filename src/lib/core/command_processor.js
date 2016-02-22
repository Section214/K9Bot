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
        let Discordie = require('discordie');
        let logger = require(GLOBAL.k9path + '/lib/core/logging.js');

        GLOBAL.bot.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (res) => {
            logger.notify('info', 'New message:\n' + JSON.stringify(res.message, null, " ") + '\n' + res.message.content);
        });
    }
}

module.exports = new command_processor();
