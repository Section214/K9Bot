/**
 * Handles working with configuration files
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';

const path        = require('path');
const nconf       = require('nconf');
const config_root = path.join(GLOBAL.k9path, '../config/');

// Define the available config files
const configs = {
    'internal': 'internal.json',
    'auth': 'auth.json'
};


/**
 * Config class
 *
 * @since       1.0.0
 */
class config {


    /**
     * Get things started!
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        let config_path;

        Object.keys(configs).forEach(function(key) {
            if(key === 'internal') {
                config_path = path.join(GLOBAL.k9path, '/lib/core/configs/');
            } else {
                config_path = config_root;
            }

            nconf.file(key, {
                file: config_path + configs[key]
            });
        });
    }


    /**
     * Get a config value with an optional fallback
     *
     * @since       1.0.0
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
     * @since       1.0.0
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
     * @since       1.0.0
     * @access      public
     * @param       {bool} save - Whether or not to save before reloading
     * @return      {bool} True if reload succeeded, false otherwise
     */
    reload(save) {
        if(save) {
            save();
        }

        return nconf.reset();
    }


    /**
     * Saves a config file to disk
     *
     * @since       1.0.0
     * @access      public
     * @param       string handle The handle of a specific config file to save
     * @return      {void}
     */
    save(handle) {
        let logger = require(path.join(GLOBAL.k9path + '/lib/core/logging.js'));
        let config_path;

        if(handle) {
            if(configs.hasOwnProperty(handle)) {
                if(handle === 'internal') {
                    config_path = path.join(GLOBAL.k9path, '/lib/core/configs/');
                } else {
                    config_path = config_root;
                }

                nconf.save(config_path + configs[handle], function (err) {
                    if(err) {
                        logger.log('error', err.message);
                        return;
                    }

                    logger.notify('info', 'Configuration saved successfully.');
                });
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
     * @since       1.0.3
     * @access      public
     * @return      {void}
     */
    save_all() {
        Object.keys(configs).forEach(function(key) {
            save(key);
        });
    }
}

module.exports = new config();
