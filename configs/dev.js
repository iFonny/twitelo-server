const config = {
  env: 'dev',
  server: {
    name: 'api-epitech-dev',
    url: 'localhost:4030',
    host: 'localhost',
    appURL: 'localhost',
    websiteURL: 'http://localhost:4030',
    port: 4030,
  },
  media: {
    url: 'http://localhost:4030/public/media',
    path: {
      root: '/public/media/dev',
    },
  },
  db: {
    name: 'epitech_twitelo_dev',
  },
};

// Exports module
module.exports = config;
