/**
 * Owner Module
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
 * Owner module class
 *
 * @since       0.1.3
 */
class ownerModule {


    /**
     * Check if the person requesting this is the bot owner!
     *
     * @since       0.1.6
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    isOwner(res) {
        let config = require(GLOBAL.k9path + '/lib/core/config.js');

        // Owner has all
        if(res.message.author.id === config.get('auth', 'owner_id')) {
            return true;
        }

        return false;
    }


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
        if(! this.isOwner(res)) {
            return;
        }

        if(! arguement || arguement === ' ') {
            utils.dm(res, 'You forgot to provide an invite URL!');
            return;
        }

        if(! utils.parseInviteCode(arguement)) {
            utils.dm(res, arguement + ' appears to be invalid!');
            return;
        }

        utils.connect(arguement);
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
        if(! this.isOwner(res)) {
            return;
        }

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
        this._disconnect(res);
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
        this._disconnect(res);
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
        this._disconnect(res);
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
        this._disconnect(res);
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
        this._disconnect(res);
    }


    /**
     * List all modules
     *
     * @since       0.1.6
     * @access      public
     * @param       {object} res The message resource
     * @return      {void}
     */
    _modules(res) {
        if(! this.isOwner(res)) {
            return;
        }

        let module_name = '';
        let module_list = '';

        all_modules.forEach(function(module) {
            module_name = string(module).strip('.js').s;

            if(module_name !== 'core' && module_name !== 'owner') {
                if(config.get('modules', module_name + ':enabled')) {
                    module_list = module_list + '[+] ' + module_name + '\n';
                } else {
                    module_list = module_list + '[-] ' + module_name + '\n';
                }
            }
        });

        utils.dm(res, 'Available modules:\n```' + module_list + '```');
        return;
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
        if(! this.isOwner(res)) {
            return;
        }

        let module_name  = '';
        let module_found = false;

        if(! arguement || arguement === ' ') {
            utils.dm(res, 'No module specified!');
            return;
        }

        arguement = arguement.toLowerCase();

        all_modules.forEach(function(module) {
            module_name = string(module).strip('.js').s;

            if(module_name === arguement) {
                if(config.get('modules', module_name + ':enabled') !== true) {
                    module_found = true;

                    config.set('modules', module_name + ':enabled', true);
                    config.save('modules');

                    GLOBAL.k9modules[module_name] = require(GLOBAL.k9path + '/lib/modules/' + module);

                    utils.dm(res, '"' + module_name + '" loaded!');
                    logger.log('info', module_name + ' loaded successfully');
                    return;
                } else {
                    module_found = true;

                    utils.dm(res, '"' + module_name + '" is already loaded!');
                    return;
                }
            }
        });

        if(! module_found) {
            utils.dm(res, '"' + arguement + '" not found!');
            logger.log('warn', arguement + ' not found!');
            return;
        }
    }


    /**
     * Alias for load
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _enable(res, arguement) {
        this._load(res, arguement);
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
        if(! this.isOwner(res)) {
            return;
        }

        let module_name  = '';
        let module_found = false;

        if(! arguement || arguement === ' ') {
            utils.dm(res, 'No module specified!');
            return;
        }

        arguement = arguement.toLowerCase();

        if(arguement === 'core' || arguement === 'owner') {
            module_found = true;
            utils.dm(res, 'The ' + arguement + ' module is required for my continued operation!');
            return;
        } else {
            all_modules.forEach(function(module) {
                module_name = string(module).strip('.js').s;

                if(module_name === arguement) {
                    if(config.get('modules', module_name + ':enabled') === true) {
                        module_found = true;

                        config.set('modules', module_name + ':enabled', false);
                        config.save('modules');

                        delete(GLOBAL.k9modules[module_name]);
                        utils.dm(res, '"' + module_name + '" unloaded!');
                        logger.log('info', module_name + ' unloaded successfully');
                        return;
                    } else {
                        module_found = true;

                        utils.dm(res, '"' + module_name + '" is not loaded!');
                        return;
                    }
                }
            });
        }

        if(! module_found) {
            utils.dm(res, '"' + arguement + '" not found!');
            logger.log('warn', arguement + ' not found!');
            return;
        }
    }


    /**
     * Alias for unload
     *
     * @since       0.1.5
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _disable(res, arguement) {
        this._unload(res, arguement);
    }
}

module.exports = new ownerModule();
