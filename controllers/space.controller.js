const { Space, Booking, Quote, Invoice, Venue } = require('../models');
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

    [errBookings, bookings] = await to(Booking.findAll({where: {spaceId: space.id}}))
    let bookingIds = bookings.map(item => item.id)
    
    // delete related invoices
    await to(Invoice.destroy({where: {BookingId: bookingIds}}));

    // delete related quotes
    await to(Quote.destroy({where: {BookingId: bookingIds}}));

    // delete related bookings
    await to(Booking.destroy({where: {id: bookingIds}}))

    return ReS(res, {message:'Deleted Space'}, 204);
}
module.exports.remove = remove;

const getAllUserSpaces = async function(req, res){

    let user_json = req.user.toWeb();

    let err, venues;

    [err, venues] = await to(Venue.findAll({where: {UserId: user_json.id}}));
    if(err) return ReE(res, err, 422);

    let venues_array = [];
    venues_array = venues.map(obj=>obj.id);

    let errSpaces, spaces;

    [errSpaces, spaces] = await to(Space.findAll({where: {VenueId: venues_array}}));
	if(errSpaces) return ReE(res, errSpaces, 422);

	let spaces_array = [];
    spaces_array = spaces.map(obj => obj.toWeb());

    return ReS(res, {spaces: spaces_array});
}
module.exports.getAllUserSpaces = getAllUserSpaces;
