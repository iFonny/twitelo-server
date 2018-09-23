const devConfig = require('./dev');
const prodConfig = require('./prod');

// packages
const path = require('path');

// Datas
const env = process.env.NODE_ENV || devConfig.env;
let config = {};

// Switch between env
switch (env) {
  case 'dev': // Development
  case 'development':
    config = devConfig;
    break;

  case 'prod': // Production
  case 'production':
    config = prodConfig;
    break;
}

// Generic config

config.root = path.normalize(`${__dirname}/..`);

// Media
config.media.maxSize = '700'; // Kb / Limit twitter (d'apres la doc twitter - a verifier)
// Media paths
config.media.path.pp = `${config.media.path.root}/pp`; // Path des images de profil

// constant data (ex: list roles)
config.constant = require(`${config.root}/configs/constant`);
// secret configs
config.secret = require(`${config.root}/configs/secret`);

// Exports module
module.exports = config;
