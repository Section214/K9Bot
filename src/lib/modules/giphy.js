/**
 * Giphy Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       1.0.0
 */

'use strict';


/**
 * Giphy Module class
 *
 * @since       1.0.0
 */
class giphy {


    /**
     * Get a random gif
     *
     * @since       1.0.0
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _giphy(res, arguement) {
        let utils   = require(GLOBAL.k9path + '/lib/core/utils.js');
        let config  = require(GLOBAL.k9path + '/lib/core/config.js');
        let api_key = config.get('config', 'giphy_api_key', '');
        let rating  = config.get('config', 'giphy_rating', false);
        let giphy   = require('giphy-api')(api_key);

        if(! arguement || arguement === ' ') {
            arguement = false;
        }

        giphy.random({
            tag: arguement,
            rating: rating,
            fmt: 'json'
        }, function(err, img) {
            if(err) {
                utils.reply(res, 'Oh my Giphy! Something went wrong...');
                return;
            }

            utils.reply(res, img.data.image_url);
            return;
        });
    }
}

module.exports = new giphy();
