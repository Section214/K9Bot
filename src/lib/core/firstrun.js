/**
 * First run config
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.3
 */

'use strict';


const Discordie = require('discordie');
const config = require(GLOBAL.k9path + '/lib/core/config.js');
const owner = GLOBAL.bot.Users.getBy('id', config.get('owner_id')).openDM();


/**
 * First run
 *
 * @since       0.1.3
 */
class firstrun {


    /**
     * Get things started!
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    constructor() {
        if(config.get('firstrun', false) !== true) {
            this.step = 1;
            this.go();
            this.command_processor();
        }
    }


    /**
     * Process firstrun config
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    go() {
        let trigger = config.get('trigger', '!');

        if(trigger === '`') {
            trigger = '"`"';
        } else {
            trigger = '`' + trigger + '`';
        }

        // Send initial message to owner
        owner.then(function(dm) {
            let message = 'Hello!\n\n' +
'My name is K9, and I am a flexible,\n' +
'modular bot for the Discord chat service.\n\n' +
'If you are receiving this message, it is\n' +
'because I have not yet received my initial\n' +
'programming.\n\n' +
'Let\'s do that now!\n\n' +
'...\n\n' +
'For starters, every command that I can\n' +
'process is initiated by a trigger. Right\n' +
'now, that trigger is ' + trigger + '\n\n' +
'Would you like to change the trigger?';

            dm.sendMessage(message);
        });
    }


    /**
     * Command processor
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    command_processor() {
        GLOBAL.bot.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (res) => {
            if(res.message.author.id !== GLOBAL.bot.User.id) {
                let command_string = res.message.content;
                let command        = command_string.toLowerCase();

                if(this.step === 1) {
                    switch(command) {
                        case 'yes':
                            this.step = 1.5;
                            this.setTrigger();
                            break;
                        default:
                            this.step = 2;
                            this.step2();
                            break;
                    }
                } else if(this.step === 1.5) {
                    config.set('trigger', command_string);
                    config.save('config');

                    this.step = 2;
                    this.step2();
                } else if(this.step === 2) {
                    switch(command) {
                        case 'whitelist':
                        case 'blacklist':
                        case 'role':
                            config.set('access_mode', command);
                            config.save('internal');

                            this.complete();
                            break;
                        default:
                            owner.then(function(dm) {
                                dm.sendMessage('I\'m sorry. "' + command_string + '" is not a valid role.\nPlease re-enter.');
                            });
                            break;
                    }
                }
            }
        });
    }


    /**
     * Change trigger
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    setTrigger() {
        owner.then(function(dm) {
            dm.sendMessage('Ok. What would you like to set as the trigger?');
        });
    }


    /**
     * Step 2
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    step2() {
        owner.then(function(dm) {
            let message = 'The next thing to set up is user access.\n' +
'By default, all users have access to every\n' +
'command. I actually support three different\n' +
'access modes:\n\n' +
'```Whitelist:     All user access is disallowed with the\n' +
'               exception of my owner. Users may be added\n' +
'               to a whitelist to allow access.\n' +
'Blacklist:     All user access is allowed. Users may be\n' +
'               added to a blacklist to disallow access.\n' +
'Role:          All user access is disallowed by default.\n' +
'               My owner can define access to commands based\n' +
'               on their Discord user role.```\n\n' +
'Enter "Whitelist", "Blacklist" or "Role" to choose.';

            dm.sendMessage(message);
        });
    }


    /**
     * Complete setup
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    complete() {
        owner.then(function(dm) {
            let message = 'Sounds good! That\'s all I have for you right now.\n' +
'Thanks, and have fun!';

            dm.sendMessage(message);

            config.set('firstrun', true);
            config.save('internal');
        });
    }
}

module.exports = new firstrun();
