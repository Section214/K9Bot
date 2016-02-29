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
const modules     = require(GLOBAL.k9path + '/lib/core/modules.js');
const all_modules = fs.readdirSync(GLOBAL.k9path + '/lib/modules');


/**
 * Core module class
 *
 * @since       0.1.3
 */
class coreModule {


    /**
     * Connect to a given server
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _connect(res, arguement) {
        if(! arguement || arguement === ' ') {
            utils.reply(res, 'You forgot to provide an invite URL!');
            return;
        }

        if(! utils.parseInviteCode(arguement)) {
            utils.reply(res, arguement + ' appears to be invalid!');
            return;
        }

        utils.connect(arguement);
    }



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
        this.leave(res);
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
     * Disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _disconnect(res) {
        logger.notify('info', 'Received exit command. Shutting down...');
        utils.say(res, 'Bye!');
        GLOBAL.bot.disconnect();
    }


    /**
     * Alias for disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _quit(res) {
        this.disconnect(res);
    }


    /**
     * Alias for disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _shutdown(res) {
        this.disconnect(res);
    }


    /**
     * Alias for disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _die(res) {
        this.disconnect(res);
    }


    /**
     * Alias for disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _goaway(res) {
        this.disconnect(res);
    }


    /**
     * Alias for disconnect
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _bye(res) {
        this.disconnect(res);
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
            utils.reply(res, 'You forgot to give me a new name!');
            return;
        }

        GLOBAL.bot.User.edit(config.get('password'), arguement);
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
        this.nickname(res, arguement);
    }


    /**
     * Load a module
     *
     * @since       0.1.6
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _load(res, arguement) {

    }


    /**
     * Unload a module
     *
     * @since       0.1.6
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _unload(res, arguement) {
        let module_name  = '';
        let module_found = false;

        if(! arguement || arguement === ' ') {
            utils.reply(res, 'No module specified!');
            return;
        }

        arguement = arguement.toLowerCase();

        if(arguement === 'core') {
            module_found = true;
            utils.reply(res, 'The core module is required for my continued operation!');
            return;
        } else {
            all_modules.forEach(function(module) {
                module_name = string(module).strip('.js').s;

                if(module_name === arguement) {
                    module_found = true;

                    config.set(module_name + ':enabled', false);
                    config.save('modules');

                    delete(GLOBAL.k9modules[module_name]);
                    utils.reply(res, '"' + module_name + '" unloaded!');
                    logger.log('info', module_name + ' unloaded successfully');
                    return;
                }
            });
        }

        if(! module_found) {
            utils.reply(res, '"' + arguement + '" not found!');
            logger.log('warn', arguement + ' not found!');
            return;
        }
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
        utils.reply(res, 'pong');
    }
}

module.exports = new coreModule();
