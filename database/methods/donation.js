//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getAllPrivate = () => {
  return r.table('donation').run();
};

module.exports.getAllPublic = () => {
  return r
    .table('donation')
    .pluck('id', 'name', 'from', 'address', 'amount', 'symbol', 'created')
    .run();
};

//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

module.exports.insert = document => {
  return r
    .table('donation')
    .insert(document)
    .run();
};

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//
