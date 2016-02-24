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
        let permissions = require(GLOBAL.k9path + '/lib/core/permissions.js');
        let utils       = require(GLOBAL.k9path + '/lib/core/utils.js');
        let trigger     = config.get('trigger', '!').toLowerCase();

        GLOBAL.bot.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, (res) => {
            logger.notify('info', 'New message:\n  From: ' + res.message.author.username + '\n  Content: ' + res.message.content + '\n  Timestamp: ' + res.message.timestamp );

            let command_string = res.message.content;

            // Make sure we're talking to K9!
            if(! string(command_string.toLowerCase()).startsWith(trigger.toLowerCase()) && ! utils.isBotMessage(res.message.channel_id)) {
                return;
            }

            // Parse out any arguements
            command_string = command_string.split(' ');
            let command   = command_string.reverse().pop();
            let arguement = command_string.reverse().join(' ');

            // Strip trigger
            command = string(command.toLowerCase()).chompLeft(trigger.toLowerCase()).s;

            // Do all the things!
            if(permissions.hasAccess(res.message.author.id, command)) {
                switch(command) {
                    case 'ping':
                        res.message.reply('pong');
                        break;
                    case 'join':
                        if(! arguement || arguement === ' ') {
                            res.message.reply('No channel specified!');
                            return;
                        }

                        // Try to find and join the channel
                        res.message.channel.guild.channels.forEach(channel => {
                            if(channel.name === arguement && channel.type === 'voice') {
                                channel.join();
                            }
                        });
                        break;
                    case 'leave':
                    case 'part':
                        res.message.channel.guild.channels.forEach(channel => {
                            if(channel.joined) {
                                channel.leave();
                            }
                        });
                        break;
                    case 'afk':
                        let afk_id = res.message.channel.guild.afk_channel_id;

                        if(afk_id) {
                            res.message.channel.guild.channels.forEach(channel => {
                                if(channel.id === afk_id) {
                                    channel.join();
                                }
                            });
                        } else {
                            res.message.channel.guild.channels.forEach(channel => {
                                if(channel.joined) {
                                    channel.leave();
                                }
                            });
                        }
                        break;
                    case 'quit':
                    case 'shutdown':
                    case 'disconnect':
                    case 'die':
                    case 'goaway':
                    case 'bye':
                        logger.notify('info', 'Received exit command. Shutting down...');
                        res.message.channel.sendMessage('Bye!');
                        GLOBAL.bot.disconnect();
                        process.exit(0);
                        break;
                    case '8ball':
                        if(! arguement || arguement === ' ') {
                            res.message.reply('You forgot to ask a question!');
                            return;
                        }

                        let eightBall = require(GLOBAL.k9path + '/lib/modules/8ball.js');

                        res.message.reply(eightBall.go());
                        break;
                }
            }
        });
    }
}

module.exports = new command_processor();
