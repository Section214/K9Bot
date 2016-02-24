/**
 * 8 Ball Module
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @since       0.1.3
 */

'use strict';


/**
 * Config class
 *
 * @since       0.1.3
 */
class eightBall {


    /**
     * Get things started!
     *
     * @since       0.1.3
     * @access      public
     * @return      {void}
     */
    constructor() {}


    /**
     * Get a random response
     *
     * @since       0.1.3
     * @access      public
     * @return      {string} response The response to return
     */
    go() {
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

        return answers[Math.floor(Math.random()*answers.length)];
    }
}

module.exports = new eightBall();
