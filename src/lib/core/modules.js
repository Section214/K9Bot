/**
 * Module loader
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.5
 */

'use strict';


const fs          = require('fs');
const string      = require('string');
const config      = require(GLOBAL.k9path + '/lib/core/config.js');
const all_modules = fs.readdirSync(GLOBAL.k9path + '/lib/modules');


/**
 * Module class
 *
 * @since       0.1.3
 */
class modules {


    /**
     * Get things started!
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    constructor() {
        let module_name = '';

        all_modules.forEach(function(module) {
            module_name = string(module).strip('.js').s;

            if(module_name === 'core' || module_name === 'management') {
                GLOBAL.k9modules[module_name] = require(GLOBAL.k9path + '/lib/modules/' + module);
            } else {
                if(config.get(module_name + ':enabled')) {
                    GLOBAL.k9modules[module_name] = require(GLOBAL.k9path + '/lib/modules/' + module);
                }
            }
        });
    }


    /**
     * Find active commands
     *
     * @since       0.1.5
     * @param       {string} command Command to check for
     * @return      {*} status {string} module name if enabled, false otherwise
     */
    search(command) {
        let module_name = '';
        let module_commands;
        let module_command;
        let aliases;
        let status = false;

        all_modules.forEach(function(module) {
            module_name = string(module).strip('.js').s;

            if(config.get(module_name + ':enabled')) {
                module_commands = config.get(module_name + ':commands');

                if(module_commands.hasOwnProperty(command)) {
                    status = module_name;
                } else {
                    for(module_command in module_commands) {
                        aliases = config.get(module_name + ':commands:' + module_command + ':aliases');

                        if(aliases) {
                            aliases.forEach(function(alias) {
                                if(alias === command) {
                                    status = module_name;
                                }
                            });
                        }
                    }
                }
            }
        });

        return status;
    }
}

module.exports = new modules();
