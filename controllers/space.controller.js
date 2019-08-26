const { Space } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, space;
    let space_info = req.body;

    [err, space] = await to(Space.create(space_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {space:space.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let venueId = req.params.venue_id;
    let err, spaces;

    [err, spaces] = await to(Space.findAll({where: {VenueId: venueId}}));
	if(err) return ReE(res, err, 422);

	let spaces_array = [];
    spaces_array = spaces.map(obj => obj.toWeb());

    return ReS(res, {spaces: spaces_array});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let space = req.space;

    return ReS(res, {space:space.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, space, data;
    space = req.space;
    data = req.body;
    space.set(data);

    [err, space] = await to(space.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {space:space.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let space, err;
    space = req.space;

    [err, space] = await to(space.destroy());
    if(err) return ReE(res, 'error occured trying to delete the space');

    return ReS(res, {message:'Deleted Space'}, 204);
}
module.exports.remove = remove;