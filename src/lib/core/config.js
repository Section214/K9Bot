/**
 * Handles working with configuration files
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


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
        let path       = require('path');
        let nconf      = require('nconf');
        let configRoot = path.join(GLOBAL.k9path, '../config/');

        // Define the available config files
        let configs = {
            'auth': 'auth.json'
        };

        Object.keys(configs).forEach(function(key) {
            nconf.file(key, {
                file: configRoot + configs[key]
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
        let val = this.nconf.get(key);

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
        return this.nconf.set(key, value);
    }


    /**
     * Reloads the config file
     *
     * @since       1.0.0
     * @access      public
     * @param       {bool} save - Whether or not to save before reloading
     * @return      {bool} True if reload succeeded, false otherwise
     */
    reload(save = false) {
        if(save) {
            save();
        }

        return this.nconf.reset();
    }


    /**
     * Saves the config file to disk
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    save() {
        let logger = require(this.path.join(GLOBAL.k9path + '/lib/core/logging.js'));

        Object.keys(this.configs).forEach(function() {
            this.nconf.save(function (err) {
                if(err) {
                    logger.log('error', err.message);
                    return;
                }

                logger.notify('info', 'Configuration saved successfully.');
            });
        });
    }
}

module.exports = new config();
