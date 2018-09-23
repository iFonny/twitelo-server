//=======================================================================//
//     GET                                                               //
//=======================================================================//

module.exports.getAll = () => {
  return r.table('trigger').run();
};

module.exports.getAllByGame = game_id => {
  return r
    .table('trigger')
    .getAll(game_id, {
      index: 'game_id',
    })
    .run();
};

//=======================================================================//
//     INSERT                                                            //
//=======================================================================//

//=======================================================================//
//     EDIT                                                              //
//=======================================================================//

//=======================================================================//
//     DELETE                                                            //
//=======================================================================//

//=======================================================================//
//     OTHER                                                             //
//=======================================================================//
