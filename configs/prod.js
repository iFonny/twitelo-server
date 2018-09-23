const config = {
  env: 'prod',
  server: {
    name: 'api-epitech',
    url: 'localhost:4031',
    host: 'twitelo-api.en-f.eu',
    appURL: 'https://twitelo.en-f.eu',
    websiteURL: 'https://twitelo-api.en-f.eu',
    port: 4031,
  },
  media: {
    url: 'https://twitelo-api.en-f.eu/public/media',
    path: {
      root: '/public/media/prod',
    },
  },
  db: {
    name: 'epitech_twitelo',
  },
};

// Exports module
module.exports = config;
