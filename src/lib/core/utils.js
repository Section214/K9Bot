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
        invite = config.get('config', 'invite');
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


/**
 * Get commands
 *
 * @since       1.0.0
 * @access      public
 * @param       {string} module The module to get commands for
 * @return      {string} command_string The command string
 */
function getCommands(module) {
    let string         = require('string');
    let config         = require(GLOBAL.k9path + '/lib/core/config.js');
    let command_string = '';
    let commands;
    let command;

    command_string = command_string + '**Module: ' + module + '**\n';

    commands = config.get('modules', module + ':commands');

    for(command in commands) {
        command_string = command_string + '*' + config.get('config', 'trigger', '!') + command;

        if(commands[command].param) {
            command_string = command_string + ' <' + commands[command].param + '>';
        }

        command_string = command_string + '*\n\t\t' + commands[command].desc;

        if(commands[command].aliases) {
            command_string = command_string + '\n\t\tAliases:';

            commands[command].aliases.forEach(function(alias) {
                command_string = command_string + ' ' + config.get('config', 'trigger', '!') + alias + ', ';
            });

            command_string = string(command_string).chompRight(', ').s;
        }

        command_string = command_string + '\n';
    }

    command_string = command_string + '\n';

    return command_string;
}


/**
 * Post message to channel
 *
 * @since       0.1.3
 * @access      public
 * @param       {object} res The message resource
 * @param       {string} message The message to post
 * @return      {void}
 */
function say(res, message) {
    if(typeof res === 'string') {
        let string  = require('string');
        let channel = string(res).chompLeft('<#').chompRight('>').s;
        channel = GLOBAL.bot.Channels.getBy('id', channel);

        channel.sendTyping();
        channel.sendMessage(message);
    } else {
        res.message.channel.sendTyping();
        res.message.channel.sendMessage(message);
    }
}


/**
 * Post message to user
 *
 * @since       0.1.3
 * @access      public
 * @param       {object} res The message resource
 * @param       {string} message The message to post
 * @return      {void}
 */
function reply(res, message) {
    res.message.channel.sendTyping();
    res.message.reply(message);
}


/**
 * DM user
 *
 * @since       0.1.3
 * @access      public
 * @param       {object} res The message resource
 * @param       {string} message The message to post
 * @return      {void}
 */
function dm(res, message) {
    let user = '';

    if(typeof res === 'string') {
        let string = require('string');
        user = string(res).chompLeft('<@').chompRight('>').s;
    } else {
        user = res.message.author.id;
    }

    user = GLOBAL.bot.Users.getBy('id', user);

    user.openDM().then(function(ch) {
        ch.sendTyping();
        ch.sendMessage(message);
    });
}


/**
 * Set bot status
 *
 * @since       1.0.3
 * @access      public
 * @param       {string] status The status message to show
 * @return      {void}
 */
function setStatus(status) {
    let config = require(GLOBAL.k9path + '/lib/core/config.js');

    // Get the default, if any
    if(! status) {
        status = config.get('config', 'default_status', false);
    }

    if(status) {
        GLOBAL.bot.User.setStatus(null, { name: status });
    }
}


module.exports = {
    parseInviteCode: parseInviteCode,
    connect:         connect,
    isBotMessage:    isBotMessage,
    fileExists:      fileExists,
    getCommands:     getCommands,
    say:             say,
    reply:           reply,
    dm:              dm,
    setStatus:       setStatus
};
