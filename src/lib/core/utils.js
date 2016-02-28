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
 * Get the server name from an invite
 *
 * @since       0.1.0
 * @return      {string} name The server name
 */
function getServerName() {
    let config    = require(GLOBAL.k9path + '/lib/core/config.js');
    let server_id = config.get('last_server_id');
    let server    = GLOBAL.bot.Guilds.get(server_id);

    if(server && server.name) {
        return server.name;
    } else {
        return null;
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
    getServerName:   getServerName,
    isBotMessage:    isBotMessage,
    fileExists:      fileExists
};
