//=======================================================================//
//     	LOGS functions                                                   //
//=======================================================================//

module.exports.initLogs = () => {
  global.__log = str => {
    console.log(str);
    return str;
  };

  global.__logRecapGame = str => {
    console.log(str);
    return str;
  };

  global.__logRecapTwitter = str => {
    console.log(str);
    return str;
  };

  global.__logInfo = str => {
    console.info(str);
    return str;
  };

  global.__logUserAction = (str, data) => {
    return Promise.resolve(data);
  };

  global.__logError = (message, full) => {
    console.error(full);
    return full;
  };

  global.__logWarning = (message, full) => {
    console.warn(full);
    return full;
  };
};
