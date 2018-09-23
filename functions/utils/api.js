//=======================================================================//
//     API functions                                                     //
//=======================================================================//

module.exports = {
  jsonError(status, publicMessage, message, err) {
    if (err) __logError(message, err);
    return {
      status: status,
      data: publicMessage,
    };
  },

  jsonSuccess(status, data) {
    return {
      status: status,
      data: data,
    };
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /*
   ** role : 'all' or 'ROLE' or ['role1', 'role2']
   */
  checkUserAuthorization(roles, twiteloToken) {
    return new Promise((resolve, reject) => {
      if (!roles || (typeof roles == 'string' && roles.toLowerCase() == 'all'))
        roles = config.constant.roles;
      if (typeof roles == 'string') roles = [roles.toUpperCase()];

      if (twiteloToken) {
        Server.fn.db
          .checkAuth(roles, twiteloToken)
          .then(user => {
            user.tokens = Server.jwt.decode(
              user.tokens,
              config.secret.jwtSecret,
            );
            resolve(user);
          }) // decode tokens && resolve user
          .catch(err => {
            if (err)
              reject(
                Server.fn.api.jsonError(
                  500,
                  'Internal server error',
                  '[DB] checkAuth() error',
                  err,
                ),
              );
            else reject(Server.fn.api.jsonError(403, 'Forbidden'));
          });
      } else
        return reject(Server.fn.api.jsonError(400, 'twiteloToken missing'));
    });
  },

  sendWelcomeJoinLeave(stats) {
    if (stats.join) {
      Server.fn.db.log('join', `New user: @${stats.username}`);
    } else {
      Server.fn.db.log('leave', `Delete user: @${stats.username}`);
    }

    return Promise.resolve(Server.fn.api.jsonSuccess(200, stats));
  },

  getAndUpdateGameData(game) {
    return new Promise((resolve, reject) => {
      Server.fn.dbMethods.tag
        .getTagsToUpdate(game.id, game.ratelimit.total)
        .then(results => {
          let tagsToUpdate = [];

          for (const result of results) {
            let tagToUpdate = {
              game_id: result.group[0],
              data_settings: result.group[1],
              game_account_info: result.group[2],
              tag_ids: {},
            };

            for (const tag of result.reduction) {
              tagToUpdate.tag_ids[tag.tag_id] = true;
            }

            tagsToUpdate.push(tagToUpdate);
          }

          if (tagsToUpdate.length <= 0) return resolve(null);
          else {
            Server.gameAPI[game.id]
              .updateFullGameData(game, tagsToUpdate)
              .then(recap => {
                Server.ratelimitCounters[game.id] = {
                  reqCounter: 0,
                  totalRequests: 0,
                  totalTags: 0,
                };
                return resolve(recap);
              });
          }
        })
        .catch(reject);
    });
  },
};
