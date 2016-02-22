/**
 * Logging and notification handler
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';

const winston = require('winston');


/**
 * Logging class
 *
 * @since       1.0.0
 */
class logger {


    /**
     * Get things started!
     *
     * @since       1.0.0
     * @access      public
     * @return      {void}
     */
    constructor() {
        // Setup the transport for console (notification) logging
        this._c = new winston.Logger({
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    handleExceptions: true,
                    prettyPrint: true
                })
            ],
            exitOnError: false
        });


        // Setup the transport for file logging
        this._l = new winston.Logger({
            transports: [
                new winston.transports.Console({
                    colorize: true,
                }),
                new winston.transports.File({
                    filename: 'logs/k9.log',
                    json: false,
                    maxsize: 102400000,
                    zippedArchive: true
                })
            ]
        });
    }


    /**
     * Process a console notification
     *
     * @since       1.0.0
     * @access      public
     * @param       {string} type - The type of notification to output
     * @param       {string} message - The message to display
     * @return      {void}
     */
    notify(type, message){
        this._c.log(type, message);
    }


    /**
     * Process a logged notification
     *
     * @since       1.0.0
     * @access      public
     * @param       {string} type - The type of notification to output
     * @param       {string} message - The message to display
     * @return      {void}
     */
    log(type, message) {
        this._l.log(type, message);
    }
}

module.exports = new logger();
