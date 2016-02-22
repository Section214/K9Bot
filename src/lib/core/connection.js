/**
 * Connection handler
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Logging class
 *
 * @since       1.0.0
 */
class connection {


    /**
     * Get things started!
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    constructor() {}


    /**
     * Connect to Discord
     *
     * @since       1.0.0
     * @access      public
     * @return      {bool} True if connected successfully, false otherwise
     */
     connect() {
        let Discordie = require('discordie');
        let events = Discordie.Events;
        let client = new Discordie();
        let config = require(GLOBAL.k9path + '/lib/core/config.js');
        let logger = require(GLOBAL.k9path + '/lib/core/logging.js');
        let email = config.get('email');
        let password = config.get('password');

        // Bail if email or password is missing or invalid
        if(! email || email === 'The registered email address of the bot' ||
           ! password || password === 'The password for the registered email address') {
            if((! email && ! password) ||
               (! email && password === 'The password for the registered email address') ||
               (email === 'The registered email address of the bot' && ! password) ||
               (email === 'The registered email address of the bot' && password === 'The password for the registered email address')) {
                logger.notify('error', 'Please create or edit the config/auth.json file and specify the bot\'s email address and password!');
                process.exit(0);
            }
        }

        try {
            // Log into Discord
            client.connect({
                email: email,
                password: password
            });

            // Bail if email/pass is invalid
            client.Dispatcher.on(events.REQUEST_AUTH_LOGIN_ERROR, err => {
                logger.notify('error', err.error.message + ': Email address/password combination is invalid!');
                process.exit(0);
            });

            // Bail if gateway error occurred
            client.Dispatcher.on(events.REQUEST_GATEWAY_ERROR, err => {
                logger.notify('error', err.error.message + ': A gateway error occurred. Please try again.');
                process.exit(0);
            });

            // Connected!
            client.Dispatcher.on(events.GATEWAY_READY, err => {
                if(! err.error) {
                    logger.notify('info', 'Connected as ' + client.User.username);
                } else {
                    // How the fuck did we get here?!?
                    logger.notify('error', err.error.message);
                }
            });
        } catch(err) {
            logger.notify('error', 'An unknown error occurred. Please try again.\n' + err.message);
            process.exit(0);
        }
     }
}

module.exports = new connection();
