/**
 * Urban Dictionary Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Urban Dictionary Module class
 *
 * @since       1.0.0
 */
class urban {


    /**
     * Get an Urban Dictionary definition
     *
     * @since       1.0.0
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _urban(res, arguement) {
        let urban = require('urban');
        let utils = require(GLOBAL.k9path + '/lib/core/utils.js');

        if(! arguement || arguement === ' ') {
            arguement = 'moron';
        }

        let response = urban(arguement);

        response.first(function(json) {
            utils.reply(res, '\"' + json.word + '" is defined as "' + json.definition + '"\nExample: "' + json.example + '"');
            return;
        });
    }
}

module.exports = new urban();
