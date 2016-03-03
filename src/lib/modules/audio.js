/**
 * Audio Core Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.1.0
 */

'use strict';


const utils  = require(GLOBAL.k9path + '/lib/core/utils.js');
const config = require(GLOBAL.k9path + '/lib/core/config.js');


/**
 * Audio Core Module class
 *
 * @since       1.1.0
 */
class audio {


    /**
     * Get things started!
     *
     * @since       1.1.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        let fs        = require('fs');
        let path      = require('path');
        let cache_dir = config.get('config', 'cache_dir');

        if(! cache_dir) {
            cache_dir = path.join(GLOBAL.k9path + '/cache');
        }

        // Ensure the cache directory exists
        if(! utils.fileExists(cache_dir, true)) {
            fs.mkdirSync(cache_dir);
        }
    }


    /**
     * Play a given file
     *
     * @since       1.1.0
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguement The command arguements
     * @return      {void}
     */
    _play(res, arguement) {
        if(! GLOBAL.bot.gatewaySocket.voiceState.channelId) {
            if(config.get('config', 'auto_join')) {
                let channel = res.message.author.getVoiceChannel(res.message.channel.guild);

                if(channel) {
                    channel.join();
                } else {
                    utils.reply(res, 'You aren\'t in a voice channel!');
                    return;
                }
            } else {
                utils.reply(res, 'I\'m not in a voice channel!');
                return;
            }
        }

        if(! arguement || arguement === ' ') {
            utils.reply(res, 'No song specified!');
            return;
        }
    }
}

module.exports = new audio();
