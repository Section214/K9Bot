/**
 * Core Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.5
 */

'use strict';


const fs          = require('fs');
const string      = require('string');
const utils       = require(GLOBAL.k9path + '/lib/core/utils.js');
const config      = require(GLOBAL.k9path + '/lib/core/config.js');
const logger      = require(GLOBAL.k9path + '/lib/core/logging.js');
const all_modules = fs.readdirSync(GLOBAL.k9path + '/lib/modules');


/**
 * Core module class
 *
 * @since       0.1.3
 */
class coreModule {


    /**
     * Join a given channel
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _join(res, arguements) {
        if(! arguements || arguements === ' ') {
            utils.reply(res, 'No channel specified!');
            return;
        }

        // Try to find and join the channel
        res.message.channel.guild.channels.forEach(channel => {
            if(channel.name === arguements && channel.type === 'voice') {
                channel.join();
            }
        });
    }


    /**
     * Leave active channels
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _leave(res) {
        res.message.channel.guild.channels.forEach(channel => {
            if(channel.joined) {
                channel.leave();
            }
        });
    }


    /**
     * Alias for leave
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _part(res) {
        this._leave(res);
    }


    /**
     * Set bot AFK
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _afk(res) {
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
    }


    /**
     * Nickname
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _nickname(res, arguement) {
        if(! arguement || arguement === ' ') {
            utils.dm(res, 'You forgot to give me a new name!');
            return;
        }

        GLOBAL.bot.User.edit(config.get('auth', 'password'), arguement);
    }


    /**
     * Alias for nickname
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _nick(res, arguement) {
        this._nickname(res, arguement);
    }


    /**
     * Ping pong
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _ping(res) {
        utils.dm(res, 'pong');
    }
}

module.exports = new coreModule();
