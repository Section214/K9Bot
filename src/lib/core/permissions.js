/**
 * Permissions handler
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.0
 */

'use strict';


/**
 * Command processor class
 *
 * @since       0.1.0
 */
class permissions {


    /**
     * Get things started!
     *
     * @since       0.1.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        //let acl     = require('acl');
        //let config  = require(GLOBAL.k9path + '/lib/core/config.js');
        //let logger  = require(GLOBAL.k9path + '/lib/core/logging.js');
        //let client  = require('redis').createClient(config.get('redis_port', 6379), config.get('redist_host', '127.0.0.1'), {no_ready_check: true});
        //let backend = new acl.redisBackend(client);
    }


    /**
     * Check if a user can run a given command
     *
     * @since       0.1.0
     * @access      public
     * @param       {string} user_id The ID of the requesting user
     * @param       {string} command The command to check
     * @return      {bool} True if allowed, false otherwise
     */
    hasAccess(user_id, command) {
        let config = require(GLOBAL.k9path + '/lib/core/config.js');

        // Owner has all
        if(user_id === config.get('owner_id')) {
            return true;
        }

        return false;
    }
}

module.exports = new permissions();
