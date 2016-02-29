/**
 * Connection handler
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.0.2
 */

'use strict';

const Discordie = require('discordie');
const config    = require(GLOBAL.k9path + '/lib/core/config.js');
const logger    = require(GLOBAL.k9path + '/lib/core/logging.js');
const utils     = require(GLOBAL.k9path + '/lib/core/utils.js');


/**
 * Logging class
 *
 * @since       0.0.2
 */
class connection {


    /**
     * Get things started!
     *
     * @since       0.0.2
     * @access      public
     * @return      {void}
     */
    constructor() {
        GLOBAL.bot = new Discordie();
    }


    /**
     * Connect to Discord
     *
     * @since       0.0.2
     * @access      public
     * @return      {bool} True if connected successfully, false otherwise
     */
     connect() {
        let email      = config.get('auth', 'email');
        let password   = config.get('auth', 'password');
        let token      = config.get('internal', 'token');
        let login_type = 'password';

        // Can we login with a token?
        if(token) {
            login_type = 'token';
        } else {
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
        }

        // Log into Discord
        if(login_type === 'password') {
            GLOBAL.bot.connect({
                email: email,
                password: password
            });
        } else {
            GLOBAL.bot.connect({
                token: token
            });
        }

        // Bail if email/pass is invalid
        GLOBAL.bot.Dispatcher.on(Discordie.Events.REQUEST_AUTH_LOGIN_ERROR, err => {
            logger.notify('error', err.error.message + ': Email address/password combination or token is invalid!');
            process.exit(0);
        });

        // Bail if gateway error occurred
        GLOBAL.bot.Dispatcher.on(Discordie.Events.REQUEST_GATEWAY_ERROR, err => {
            logger.notify('error', err + ': A gateway error occurred. Please try again.');
            process.exit(0);
        });

        // Connected!
        GLOBAL.bot.Dispatcher.on(Discordie.Events.GATEWAY_READY, err => {
            if(! err.error) {
                // Save the login token
                if(! token) {
                    config.set('internal', 'token', GLOBAL.bot.token);
                    config.save('internal');
                }

                logger.notify('info', 'Connected as ' + GLOBAL.bot.User.username);

                // Connect to default server
                if(GLOBAL.bot.Guilds.size === 0) {
                    utils.connect();
                }

                let connected_to = '';

                if(GLOBAL.bot.Guilds.size === 1) {
                    connected_to = 'Connected to ';

                    GLOBAL.bot.Guilds.toArray().forEach(function(guild){
                        connected_to = connected_to + guild.name;
                    });
                } else {
                    connected_to = 'Connected to:';

                    GLOBAL.bot.Guilds.toArray().forEach(function(guild){
                        connected_to = connected_to + '\n' + '        + ' + guild.name;
                    });
                }

                logger.notify('info', connected_to);

                // Load command processor
                require(GLOBAL.k9path + '/lib/core/command_processor.js');
            } else {
                // How the fuck did we get here?!?
                logger.notify('error', err.error.message);
            }
        });

        // Attempt to reconnect if disconnected
        GLOBAL.bot.Dispatcher.on(Discordie.Events.DISCONNECTED, (err) => {
            let delay = 5000;
            let sdelay = Math.floor(delay/100)/10;

            if(err.error.message.indexOf('gateway') >= 0) {
                logger.notify('warn', 'Disconnected from gateway, reconnecting in ' + sdelay + ' seconds');
            } else {
                logger.notify('warn', 'Failed to login or get gateway, reconnecting in ' + sdelay + ' seconds');
            }
            setTimeout(this.connect, delay);
        });
    }
}

module.exports = new connection();
