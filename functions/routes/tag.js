//=======================================================================//
//     TAG functions                                                     //
//=======================================================================//

module.exports = {
  /* Check parameters */

  checkParamsTagCreate(params) {
    return new Promise((resolve, reject) => {
      let tag = {
        tag_id: '',
        game_id: '',
        account_id: false,
        settings: {},
        data_settings: {},
      };

      // Check mandatory params
      if (params.tag_id && typeof params.tag_id == 'string')
        tag.tag_id = params.tag_id;
      else return reject(Server.fn.api.jsonError(400, 'Bad or Missing tag_id'));

      if (params.game_id && typeof params.game_id == 'string')
        tag.game_id = params.game_id;
      else
        return reject(Server.fn.api.jsonError(400, 'Bad or Missing game_id'));

      if (
        params.settings &&
        params.data_settings &&
        Server.gameTags[tag.game_id] &&
        Server.gameTags[tag.game_id][tag.tag_id]
      ) {
        for (const key in Server.gameTags[tag.game_id][tag.tag_id]
          .fieldSettings) {
          if (
            params.settings[key] != null &&
            ['boolean', 'string', 'number'].includes(
              typeof params.settings[key],
            )
          ) {
            tag.settings[key] = params.settings[key];
          } else
            return reject(
              Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`),
            );
        }
        for (const key in Server.gameTags[tag.game_id][tag.tag_id]
          .dataSettings) {
          if (
            params.data_settings[key] != null &&
            ['boolean', 'string', 'number'].includes(
              typeof params.data_settings[key],
            )
          ) {
            tag.data_settings[key] = params.data_settings[key];
          } else
            return reject(
              Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`),
            );
        }
      } else
        return reject(Server.fn.api.jsonError(400, 'Bad or Missing settings'));

      if (
        Server.gameTags[tag.game_id][tag.tag_id] &&
        Server.gameTags[tag.game_id][tag.tag_id].account
      ) {
        if (params.account_id && typeof params.account_id == 'string')
          tag.account_id = params.account_id;
        else
          return reject(
            Server.fn.api.jsonError(400, 'Bad or Missing account_id'),
          );
      } else tag.account_id = false;

      resolve(tag);
    });
  },

  checkParamsTagUpdateSettings(bodyParams, urlParams) {
    return new Promise((resolve, reject) => {
      let tag = {
        id: '',
        tag_id: '',
        game_id: '',
        account_id: false,
        settings: {},
        data_settings: {},
      };

      // Check mandatory params
      if (
        urlParams.id &&
        typeof urlParams.id == 'string' &&
        urlParams.id.length > 0
      )
        tag.id = urlParams.id;
      else return reject(Server.fn.api.jsonError(400, 'Bad or Missing id'));

      // Check mandatory params
      if (bodyParams.tag_id && typeof bodyParams.tag_id == 'string')
        tag.tag_id = bodyParams.tag_id;
      else return reject(Server.fn.api.jsonError(400, 'Bad or Missing tag_id'));

      if (bodyParams.game_id && typeof bodyParams.game_id == 'string')
        tag.game_id = bodyParams.game_id;
      else
        return reject(Server.fn.api.jsonError(400, 'Bad or Missing game_id'));

      if (
        bodyParams.settings &&
        bodyParams.data_settings &&
        Server.gameTags[tag.game_id] &&
        Server.gameTags[tag.game_id][tag.tag_id]
      ) {
        for (const key in Server.gameTags[tag.game_id][tag.tag_id]
          .fieldSettings) {
          if (
            bodyParams.settings[key] != null &&
            ['boolean', 'string', 'number'].includes(
              typeof bodyParams.settings[key],
            )
          ) {
            tag.settings[key] = bodyParams.settings[key];
          } else
            return reject(
              Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`),
            );
        }
        for (const key in Server.gameTags[tag.game_id][tag.tag_id]
          .dataSettings) {
          if (
            bodyParams.data_settings[key] != null &&
            ['boolean', 'string', 'number'].includes(
              typeof bodyParams.data_settings[key],
            )
          ) {
            tag.data_settings[key] = bodyParams.data_settings[key];
          } else
            return reject(
              Server.fn.api.jsonError(400, `Bad or Missing '${key}' setting`),
            );
        }
      } else
        return reject(Server.fn.api.jsonError(400, 'Bad or Missing settings'));

      if (
        Server.gameTags[tag.game_id][tag.tag_id] &&
        Server.gameTags[tag.game_id][tag.tag_id].account
      ) {
        if (bodyParams.account_id && typeof bodyParams.account_id == 'string')
          tag.account_id = bodyParams.account_id;
        else
          return reject(
            Server.fn.api.jsonError(400, 'Bad or Missing account_id'),
          );
      } else tag.account_id = false;

      resolve(tag);
    });
  },

  checkParamsTagID(params) {
    return new Promise((resolve, reject) => {
      // Check mandatory params
      if (params.id && typeof params.id == 'string' && params.id.length > 0)
        resolve(params.id);
      else return reject(Server.fn.api.jsonError(400, 'Bad or Missing id'));
    });
  },

  /* Functions */

  getAll(userID) {
    return new Promise((resolve, reject) => {
      Server.fn.dbMethods.tag
        .getAll(userID)
        .then(tags => resolve(tags))
        .catch(err =>
          reject(
            Server.fn.api.jsonError(
              500,
              "Can't get tags",
              '[DB] getAll() error',
              err,
            ),
          ),
        );
    });
  },

  createTag(userID, tag) {
    return new Promise(async (resolve, reject) => {
      if (tag.account_id)
        await Server.fn.dbMethods.account
          .get(userID, tag.account_id)
          .then(
            accounts => (tag.game_account_info = accounts[0].game_account_info),
          )
          .catch(() =>
            reject(
              Server.fn.api.jsonError(
                500,
                "Can't create tag : account not found",
              ),
            ),
          );
      else tag.game_account_info = null;

      tag.user_id = userID;
      tag.created = Date.now();
      tag.updated = Date.now();
      tag.included = false;
      tag.size = Server.fn.game.utils.getDataSize(
        Server.gameTags[tag.game_id][tag.tag_id],
        tag.settings,
      );

      if (!tag.size)
        return reject(
          Server.fn.api.jsonError(
            400,
            'Bad settings',
            'Bad settings? getDataSize() error',
            tag.settings,
          ),
        );

      // Check if game data already exist
      Server.fn.dbMethods.game_data
        .getByTagIDAndFilter(tag.tag_id, {
          game_id: tag.game_id,
          data_settings: tag.data_settings,
          game_account_info: tag.game_account_info,
        })
        .then(game_data => {
          // Set an example data value in tag
          tag.data = Server.gameTags[tag.game_id][tag.tag_id].exampleOriginal;

          // Add existing game data to tag
          if (game_data && game_data.length > 0) {
            tag.data = game_data[0].data;

            Server.fn.dbMethods.tag
              .insert(tag)
              .then(result => resolve(result.changes[0].new_val))
              .catch(err =>
                reject(
                  Server.fn.api.jsonError(
                    500,
                    "Can't create tag",
                    '[DB] createTag() error',
                    err,
                  ),
                ),
              );
          } else {
            // insert tag
            Server.fn.dbMethods.tag
              .insert(tag)
              .then(async result => {
                tag = result.changes[0].new_val;

                if (Server.gameTags[tag.game_id][tag.tag_id].useExample)
                  return resolve(tag);
                else {
                  // get tag game data (and update tag)
                  Server.gameAPI[tag.game_id].getDataOneByOne(
                    Server.game[tag.game_id],
                    tag.data_settings,
                    tag.game_account_info,
                    {
                      [tag.tag_id]: true,
                    },
                  );

                  resolve(tag);
                }
              })
              .catch(err =>
                reject(
                  Server.fn.api.jsonError(
                    500,
                    "Can't create tag",
                    '[DB] createTag() error',
                    err,
                  ),
                ),
              );
          }
        })
        .catch(err =>
          reject(
            Server.fn.api.jsonError(
              500,
              "Can't get game_data",
              '[game_data] createTag() error',
              err,
            ),
          ),
        );
    });
  },

  updateTagSettings(userID, tag) {
    return new Promise(async (resolve, reject) => {
      if (tag.account_id)
        await Server.fn.dbMethods.account
          .get(userID, tag.account_id)
          .then(
            accounts => (tag.game_account_info = accounts[0].game_account_info),
          )
          .catch(() =>
            reject(
              Server.fn.api.jsonError(
                500,
                "Can't update tag : account not found",
              ),
            ),
          );
      else tag.game_account_info = null;

      tag.size = Server.fn.game.utils.getDataSize(
        Server.gameTags[tag.game_id][tag.tag_id],
        tag.settings,
      );

      if (!tag.size)
        return reject(
          Server.fn.api.jsonError(
            400,
            'Bad settings',
            'Bad settings? getDataSize() error',
            tag.settings,
          ),
        );

      // Check if game data already exist
      Server.fn.dbMethods.game_data
        .getByTagIDAndFilter(tag.tag_id, {
          game_id: tag.game_id,
          data_settings: tag.data_settings,
          game_account_info: tag.game_account_info,
        })
        .then(game_data => {
          // Set an example data value in tag
          tag.data = Server.gameTags[tag.game_id][tag.tag_id].exampleOriginal;

          delete tag.tag_id;
          delete tag.game_id;

          // Add existing game data to tag
          if (game_data && game_data.length > 0) {
            tag.data = game_data[0].data;

            Server.fn.dbMethods.tag
              .update(userID, tag)
              .then(result => {
                if (result.replaced)
                  resolve(
                    Server.fn.api.jsonSuccess(200, result.changes[0].new_val),
                  );
                else resolve(Server.fn.api.jsonSuccess(200, false));
              })
              .catch(err =>
                reject(
                  Server.fn.api.jsonError(
                    500,
                    "Can't update tag",
                    '[DB] updateTagSettings() error',
                    err,
                  ),
                ),
              );
          } else {
            // update tag
            Server.fn.dbMethods.tag
              .update(userID, tag)
              .then(async result => {
                if (result.replaced) {
                  tag = result.changes[0].new_val;

                  if (Server.gameTags[tag.game_id][tag.tag_id].useExample)
                    return resolve(Server.fn.api.jsonSuccess(200, tag));
                  else {
                    // get tag game data (and update tag)
                    Server.gameAPI[tag.game_id].getDataOneByOne(
                      Server.game[tag.game_id],
                      tag.data_settings,
                      tag.game_account_info,
                      {
                        [tag.tag_id]: true,
                      },
                    );

                    resolve(Server.fn.api.jsonSuccess(200, tag));
                  }
                } else return resolve(Server.fn.api.jsonSuccess(200, false));
              })
              .catch(err =>
                reject(
                  Server.fn.api.jsonError(
                    500,
                    "Can't update tag",
                    '[DB] updateTagSettings() error',
                    err,
                  ),
                ),
              );
          }
        })
        .catch(err =>
          reject(
            Server.fn.api.jsonError(
              500,
              "Can't get game_data",
              '[game_data] updateTagSettings() error',
              err,
            ),
          ),
        );
    });
  },

  deleteTagFromProfile(user, id) {
    return new Promise((resolve, reject) => {
      const twitelo = {
        description: {
          content: user.twitelo.description.content
            .replace(`<{${id}}>`, '')
            .trim(),
        },
        name: {
          content: user.twitelo.name.content.replace(`<{${id}}>`, '').trim(),
        },
        location: {
          content: user.twitelo.location.content
            .replace(`<{${id}}>`, '')
            .trim(),
        },
      };

      Server.fn.dbMethods.user
        .update(user.id, {
          twitelo,
        })
        .then(() => resolve(id))
        .catch(err =>
          reject(
            Server.fn.api.jsonError(
              500,
              "Can't delete tag from profile",
              '[DB] deleteTagFromProfile() error',
              err,
            ),
          ),
        );
    });
  },

  deleteTag(userID, id) {
    return new Promise((resolve, reject) => {
      Server.fn.dbMethods.tag
        .delete(userID, id)
        .then(result =>
          resolve(
            Server.fn.api.jsonSuccess(200, result.deleted ? true : false),
          ),
        )
        .catch(err =>
          reject(
            Server.fn.api.jsonError(
              500,
              "Can't delete tag",
              '[DB] deleteTag() error',
              err,
            ),
          ),
        );
    });
  },

  addInfo(tag, isArray = false) {
    if (isArray) {
      let tagsInfo = [];

      for (const key in tag) {
        if (Server.gameTags[tag[key].game_id][tag[key].tag_id]) {
          tag[key].info = Server.gameTags[tag[key].game_id][tag[key].tag_id];
          tagsInfo.push(tag[key]);
        }
      }
      return Promise.resolve(Server.fn.api.jsonSuccess(200, tagsInfo));
    } else
      return Promise.resolve(
        Server.fn.api.jsonSuccess(
          200,
          ((tag.info = Server.gameTags[tag.game_id][tag.tag_id]), tag),
        ),
      );
  },
};
