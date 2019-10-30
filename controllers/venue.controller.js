const { Venue, Booking, Quote, Invoice, } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, venue;
    let venue_info = req.body;
    let user = req.user.toWeb();

    venue_info.UserId = user.id;

    [err, venue] = await to(Venue.create(venue_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {venue:venue.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user_json = req.user.toWeb();

    let err, venues;

    [err, venues] = await to(Venue.findAll({where: {UserId: user_json.id}}));
		if(err) return ReE(res, err, 422);

		let venues_array = [];
		venues_array = venues.map(obj=>obj.toWeb());

    return ReS(res, {venues: venues_array});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let venue = req.venue;

    let spaces_array, spaces, venue_obj;

    [err, spaces] = await to(venue.getSpaces());
    if(err) return ReE(res, "err getting spaces");
    
    spaces_array = spaces.map(obj=>obj.toWeb());
    
    venue_obj = venue.toWeb();
    venue_obj.spaces = spaces_array;

    return ReS(res, {venue:venue_obj});
}
module.exports.get = get;

const update = async function(req, res){
    let err, venue, data;
    venue = req.venue;
    data = req.body;
    venue.set(data);

    [err, venue] = await to(venue.save());
    if(err){
        return ReE(res, err);
    }

    let spaces_array, spaces, venue_obj;

    [err, spaces] = await to(venue.getSpaces());
    if(err) return ReE(res, "err getting spaces");
    
    spaces_array = spaces.map(obj=>obj.toWeb());
    
    venue_obj = venue.toWeb();
    venue_obj.spaces = spaces_array;
    
    return ReS(res, {venue:venue_obj});
}
module.exports.update = update;

const remove = async function(req, res){
    let venue, err;
    venue = req.venue;

    [err, venue] = await to(venue.destroy());
    if(err) return ReE(res, 'error occured trying to delete the venue');

    // find related bookings
    [errBookings, bookings] = await to(Booking.findAll({where: {venueId: venue.id}}))
    let bookingIds = bookings.map(item => item.id)
    
    // delete related invoices
    await to(Invoice.destroy({where: {BookingId: bookingIds}}));

    // delete related quotes
    await to(Quote.destroy({where: {BookingId: bookingIds}}));

    // delete related bookings
    await to(Booking.destroy({where: {id: bookingIds}}))

    return ReS(res, {message:'Deleted Venue'}, 204);
}
module.exports.remove = remove;