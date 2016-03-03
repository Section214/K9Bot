/**
 * Chat Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.3
 */

'use strict';


const utils  = require(GLOBAL.k9path + '/lib/core/utils.js');


/**
 * Chat Module class
 *
 * @since       1.1.0
 */
class chat {


    /**
     * Tell a user or channel something
     *
     * @since       1.1.0
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _tell(res, arguements) {
        let string = require('string');
        let lookup;

        // Parse out 'to'
        let message = arguements.split(' ');

        if(message.length < 2) {
            utils.reply(res, 'You must specify a @user or #channel and a message!');
            return;
        }

        let to  = message.reverse().pop();
        message = message.reverse().join(' ');

        if(string(to).startsWith('<@')) {
            if(utils.isBotMessage(res.message.channel_id)) {
                utils.dm(to, message);
                return;
            } else {
                utils.say(res, to + ' ' + message);
                return;
            }
        } else if(string(to).startsWith('<#')) {
            utils.say(to, message);
            return;
        } else if(string(to).startsWith('@')) {
            lookup = GLOBAL.bot.Users.getBy('username', string(to).chompLeft('@'));

            if(lookup) {
                utils.dm(lookup.id, message);
                return;
            } else {
                utils.reply(res, 'I can\'t find the user ' + to + '!');
                return;
            }
        } else if(string(to).startsWith('#')) {
            lookup = GLOBAL.bot.Channels.getBy('name', string(to).chompLeft('#'));

            if(lookup) {
                utils.say(lookup.id, message);
                return;
            } else {
                utils.reply(res, 'I can\'t find the channel ' + to + '!');
                return;
            }
        } else {
            utils.reply(res, 'I won\'t talk to myself!');
            return;
        }
    }
}

module.exports = new chat();
