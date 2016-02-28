/**
 * 8 Ball Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.3
 */

'use strict';


const utils  = require(GLOBAL.k9path + '/lib/core/utils.js');


/**
 * 8-ball Module class
 *
 * @since       0.1.3
 */
class eightBall {


    /**
     * Get a random response
     *
     * @since       0.1.3
     * @access      public
     * @param       {object} res The message resource
     * @param       {string} arguements The command arguements
     * @return      {void}
     */
    _8ball(res, arguement) {
        if(! arguement || arguement === ' ') {
            utils.reply(res, 'You forgot to ask a question!');
            return;
        }

        let answers = [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes – definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Signs point to yes',
            'Yes',
            'Reply hazy, try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            'Don\'t count on it',
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful'
        ];

        utils.reply(res, answers[Math.floor(Math.random()*answers.length)]);
    }
}

module.exports = new eightBall();
