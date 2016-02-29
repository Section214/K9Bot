/**
 * Weather Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.6
 */

'use strict';


const weatherjs = require('weather-js');
const conv      = require('temp-units-conv');
const utils     = require(GLOBAL.k9path + '/lib/core/utils.js');


/**
 * Weather Module class
 *
 * @since       0.1.6
 */
class weather {


    /**
     * Get the weather
     *
     * @since       0.1.6
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _weather(res, arguement) {
        if(! arguement || arguement === ' ') {
            utils.reply(res, 'I\'m a time traveler, not a psychic! Where are you?');
            return;
        }

        weatherjs.find({
            search: arguement,
            degreeType: 'F'
        }, function(err, response) {
            if(err) {
                utils.reply(res, "Skies are cloudy... just kidding. Weather forecasting is currently offline.");
                return;
            }

            let location = response[0].location.name;
            let tempf    = response[0].current.temperature;
            let tempc    = conv.f2c(tempf);
            let desc     = response[0].current.skytext.toLowerCase();

            utils.reply(res, "The weather in " + location + " is currently " + tempf + "°F/" + tempc + "°C and " + desc );
            console.log(response[0]);
        });
    }
}

module.exports = new weather();
