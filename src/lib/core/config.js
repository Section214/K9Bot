/**
 * Handles working with configuration files
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.0.1
 */

'use strict';

const path         = require('path');
const nconf        = require('nconf');
const logger       = require(path.join(GLOBAL.k9path + '/lib/core/logging.js'));
const utils        = require(path.join(GLOBAL.k9path + '/lib/core/utils.js'));
const user_configs = path.join(GLOBAL.k9path, '../config/');
const core_configs = path.join(GLOBAL.k9path, '/lib/core/configs/');

// Define the available config files
const configs = {
    'internal': 'internal.json',
    'modules': 'modules.json',
    'auth': 'auth.json',
    'config': 'config.json'
};


/**
 * Config class
 *
 * @since       0.0.1
 */
class config {


    /**
     * Get things started!
     *
     * @since       0.0.1
     * @access      public
     * @return      {void}
     */
    constructor() {
        Object.keys(configs).forEach(function(key) {
            if(utils.fileExists(user_configs + configs[key])) {
                nconf.file(key, {
                    file: user_configs + configs[key]
                });
            } else {
                if(utils.fileExists(core_configs + configs[key])) {
                    nconf.file(key, {
                        file: core_configs + configs[key]
                    });
                } else {
                    logger.log('error', 'Config file ' + configs[key] + ' not found!');
                    return;
                }
            }
        });
    }


    /**
     * Get a config value with an optional fallback
     *
     * @since       0.0.1
     * @access      public
     * @param       {string} key - The key to retrieve
     * @param       {*} fallback - An optional fallback value
     * @return      {*} val - The value of the retrieved key
     */
    get(key, fallback) {
        let val = nconf.get(key);

        if(! val) {
            val = fallback;
        }

        return val;
    }


    /**
     * Set (or update) a config value
     *
     * @since       0.0.1
     * @access      public
     * @param       {string} key - The key to set
     * @param       {*} value - The value to set
     * @return      {bool} True if set succeeded, false otherwise
     */
    set(key, value) {
        return nconf.set(key, value);
    }


    /**
     * Reloads the config file
     *
     * @since       0.0.1
     * @access      public
     * @param       {bool} save - Whether or not to save before reloading
     * @return      {bool} True if reload succeeded, false otherwise
     */
    reload(save) {
        if(save) {
            this.save();
        }

        return nconf.reset();
    }


    /**
     * Saves a config file to disk
     *
     * @since       0.0.1
     * @access      public
     * @param       string handle The handle of a specific config file to save
     * @return      {void}
     */
    save(handle) {
        if(handle) {
            if(configs.hasOwnProperty(handle)) {
                if(utils.fileExists(user_configs + configs[handle])) {
                    nconf.save(user_configs + configs[handle], function (err) {
                        if(err) {
                            logger.log('error', err.message);
                            return;
                        }

                        logger.notify('info', 'Configuration saved successfully.');
                    });
                } else {
                    if(utils.fileExists(core_configs + configs[handle])) {
                        nconf.save(core_configs + configs[handle], function (err) {
                            if(err) {
                                logger.log('error', err.message);
                                return;
                            }

                            logger.notify('info', 'Configuration saved successfully.');
                        });
                    } else {
                        logger.log('error', 'Config file ' + configs[handle] + ' not found!');
                        return;
                    }
                }
            }
        } else {
            logger.log('silly', 'No config file specified!');
            return;
        }
    }


    /**
     * Saves ALL config files... you probably don't want this!
     * This function ONLY exists for doing a sanity check when K9 quits
     *
     * @since       0.0.3
     * @access      public
     * @return      {void}
     */
    save_all() {
        Object.keys(configs).forEach(function(key) {
            this.save(key);
        });
    }
}

module.exports = new config();
