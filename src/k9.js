/**
 * K9 - A flexible, modular bot for the Discord chat service
 * Copyright (C) 2016 Section214, LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * @author      Daniel J Griffiths <dgriffiths@section214.com>
 * @license     GPL-2.0
 * @version     0.1.2
 */

'use strict';

// Setup globals... the fewer the better!
GLOBAL.k9version = '0.1.2';
GLOBAL.k9path = __dirname;
GLOBAL.bot = undefined;

// Load all the things!
let semver = require('semver');
let chalk = require('chalk');
let logger = require('./lib/core/logging.js');
let connection = require('./lib/core/connection.js');

// Banner
console.log(chalk.bold('\nK9 - A flexible, modular bot for the Discord chat service'));
console.log('=========================================================');
console.log(chalk.bold.blue('Version') + '          ' + GLOBAL.k9version);
console.log(chalk.bold.blue('Homepage') + '         http://section214.com/product/k9');
console.log(chalk.bold.blue('Author') + '           Daniel J Griffiths\n                 <dgriffiths@section214.com>');
console.log('=========================================================');

console.log('\nStarting K9...\nWe are in a car.\n');

// Version checks
if (! semver.satisfies(process.versions.node, '>=4')) {
    logger.log('error', 'K9 requires Node 4.0 or later. Please update Node to continue.');
    return;
}

// Go!
connection.connect();
