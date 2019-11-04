const Company 			    = require('./../models').Company;
const Venue                 = require('./../models').Venue;
const Space                 = require('./../models').Space;
const Status                = require('./../models').Status;
const Customer              = require('./../models').Customer;
const Booking               = require('./../models').Booking;
const Quote                 = require('./../models').Quote;
const Invoice               = require('./../models').Invoice;
const Bookingcolor          = require('./../models').Bookingcolor;

const { to, ReE, ReS } = require('../services/util.service');

let company = async function (req, res, next) {
    let company_id, err, company;
    company_id = req.params.company_id;

    [err, company] = await to(Company.findOne({where:{id:company_id}}));
    if(err) return ReE(res, "err finding company", 422);

    if(!company) return ReE(res, "Company not found with id: "+company_id, 422);

    req.company = company;
    next();
}
module.exports.company = company;

let venue = async function (req, res, next) {
    let venue_id, err, venue;
    venue_id = req.params.venue_id;

    [err, venue] = await to(Venue.findOne({where:{id:venue_id}}));
    if(err) return ReE(res, "err finding venue", 422);

    if(!venue) return ReE(res, "Venue not found with id: "+venue_id, 422);
    
    req.venue = venue;
    next();
}
module.exports.venue = venue;

let space = async function (req, res, next) {
    let space_id, err, space;
    space_id = req.params.space_id;

    [err, space] = await to(Space.findOne({where:{id:space_id}}));
    if(err) return ReE(res, "err finding space", 422);

    if(!space) return ReE(res, "Space not found with id: "+space_id, 422);
    
    req.space = space;
    next();
}
module.exports.space = space;

let status = async function (req, res, next) {
    let status_id, err, status;
    status_id = req.params.status_id;

    [err, status] = await to(Status.findOne({where:{id:status_id}}));
    if(err) return ReE(res, "err finding status", 422);

    if(!status) return ReE(res, "Status not found with id: "+status_id, 422);
    
    req.status = status;
    next();
}
module.exports.status = status;

let customer = async function (req, res, next) {
    let customer_id, err, customer;
    customer_id = req.params.customer_id;

    [err, customer] = await to(Customer.findOne({where:{id:customer_id}}));
    if(err) return ReE(res, "err finding customer", 422);

    if(!customer) return ReE(res, "Customer not found with id: "+customer_id, 422);
    
    req.customer = customer;
    next();
}
module.exports.customer = customer;

let booking = async function (req, res, next) {
    let booking_id, err, booking;
    booking_id = req.params.booking_id;

    [err, booking] = await to(Booking.findOne({where:{id:booking_id}}));    
    if(err) return ReE(res, "err finding booking", 422);

    if(!booking) return ReE(res, "Booking not found with id: "+booking_id, 422);
    
    req.booking = booking;
    next();
}
module.exports.booking = booking;

let quote = async function (req, res, next) {
    let quote_id, err, quote;
    quote_id = req.params.quote_id;

    [err, quote] = await to(Quote.findOne({where:{id:quote_id}}));    
    if(err) return ReE(res, "err finding quote", 422);

    if(!quote) return ReE(res, "Quote not found with id: "+quote_id, 422);
    
    req.quote = quote;
    next();
}
module.exports.quote = quote;

let invoice = async function (req, res, next) {
    let invoice_id, err, invoice;
    invoice_id = req.params.invoice_id;

    [err, invoice] = await to(Invoice.findOne({where:{id:invoice_id}}));
    if(err) return ReE(res, "err finding invoice", 422);

    if(!invoice) return ReE(res, "Invoice not found with id: "+invoice_id, 422);
    
    req.invoice = invoice;
    next();
}
module.exports.invoice = invoice;

let bookingColor = async function (req, res, next) {
  let bookingColor_id, err, bookingColor;
  bookingColor_id = req.params.bookingColor_id;

  [err, bookingColor] = await to(Bookingcolor.findOne({where:{id:bookingColor_id}}));
  if(err) return ReE(res, "err finding bookingcolor", 422);

  if(!bookingColor) return ReE(res, "BookingColor not found with id: "+bookingColor_id, 422);

  req.bookingColor = bookingColor;
  next();
}
module.exports.bookingColor = bookingColor;
