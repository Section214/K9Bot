/**
 * Utilities
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.0
 */

'use strict';


/**
 * Parse a Discord invite URL to retrieve the invite code
 *
 * @since       0.1.0
 * @param       {string} invite The invite URL
 * @return      {string|bool} code The parsed code, or false if invalid
 */
function parseInviteCode(invite) {
    let inviteRegex = /https?:\/\/discord\.gg\/([A-Za-z0-9-]+)\/?/;
    let code        = inviteRegex.exec(invite);

    if(code) {
        code = code[1];
    }

    return code;
}


/**
 * Join a server by invite
 *
 * @since       0.0.3
 * @access      public
 * @param       {string} The invite code for the channel to join
 * @return      {void}
 * @todo        Don't forcibly re-accept every time!
 */
function connect(invite) {
    let config = require(GLOBAL.k9path + '/lib/core/config.js');
    let logger = require(GLOBAL.k9path + '/lib/core/logging.js');
    let utils  = require(GLOBAL.k9path + '/lib/core/utils.js');

    if(! invite) {
        invite = config.get('invite');
    }

    // Bail if no invite is set
    if(! invite || invite === 'The invite URL for the server to connect to') {
        logger.notify('error', 'Please create or edit the config/auth.json file and specify an invite URL!');
        process.exit(0);
    }

    let code = utils.parseInviteCode(invite);

    if(code === null) {
        logger.notify('error', 'The specified invite link is invalid!');
        process.exit(0);
    } else {
        GLOBAL.bot.Invites.accept(code).then(function(res) {
            logger.notify('info', 'Connected to ' + res.guild.name);
        }, function() {
            logger.notify('warn', 'The invite link was not accepted.');
            return;
        });
    }
}


/**
 * Check if a message is a PM to the bot
 *
 * @since       0.1.0
 * @param       {string} channel_id The ID of the channel to check
 * @return      {bool} True if PM, false otherwise
 */
function isBotMessage(channel_id) {
    let channel = GLOBAL.bot.DirectMessageChannels.get(channel_id);

    return (! channel ) ? false : true;
}


/**
 * Check if a file exists
 *
 * @since       0.1.4
 * @param       {string} filepath The path to check
 * @param       {bool} isdir True to treat as directory
 * @return      {bool} exists True if exists, false otherwise
 */
function fileExists(filepath, isdir) {
    let fs     = require('fs');
    //let path   = require('path');
    let exists = false;

    if(filepath) {
        if(isdir) {
            try {
                exists = fs.statSync(filepath).isDirectory();
            } catch (e) {}
        } else {
            try {
                exists = fs.statSync(filepath).isFile();
            } catch (e) {}
        }
    }

    return exists;
}


module.exports = {
    parseInviteCode: parseInviteCode,
    connect:         connect,
    isBotMessage:    isBotMessage,
    fileExists:      fileExists
};
