const { Booking, Quote, Invoice, Venue, Space, Customer, User, Status } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const mail = require('../lib/mail');

const create = async function(req, res){
    let err, booking;
    let user = req.user.toWeb();

    let booking_info = req.body;
    booking_info.UserId = user.id;

    [err, booking] = await to(Booking.create(booking_info));
    if(err) return ReE(res, err, 422);

    let booking_obj = booking.toWeb();
    let venueErr, venue;
    [venueErr, venue] = await to(Venue.findOne({where: {id: booking_obj.venueId}}));

    if(venueErr || !venue)
        booking_obj.venue = null;
    else
        booking_obj.venue = venue.toWeb();

    let spaceErr, space;
    [spaceErr, space] = await to(Space.findOne({where: {id: booking_obj.spaceId}}));
    if(spaceErr || !space)
        booking_obj.space = null;
    else
        booking_obj.space = space.toWeb();

    let customerErr, customer;
    [customerErr, customer] = await to(Customer.findOne({where: {id: booking_obj.customerId}}));
    if(customerErr || !customer)
        booking_obj.customer = null;
    else
        booking_obj.customer = customer.toWeb();

    let ownerErr, owner;
    [ownerErr, owner] = await to(User.findOne({where: {id: booking_obj.ownerId}}));
    if(ownerErr || !owner)
        booking_obj.owner = null;
    else{
        booking_obj.owner = owner.toWeb();
        delete booking_obj.owner.password;
    }

    let statusErr, status;
    [statusErr, status] = await to(Status.findOne({where: {id: booking_obj.statusId}}));
    if(statusErr || !status)
        booking_obj.status = null;
    else
        booking_obj.status = status.toWeb();

    return ReS(res, {booking:booking_obj}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user_json = req.user.toWeb();
    let err, bookings;

    [err, bookings] = await to(Booking.findAll({where: {UserId: user_json.id}}));
    if(err) return ReE(res, err, 422);

    let booking_array = [];
    booking_array = await Promise.all(bookings.map(async(obj) => {
        let booking_obj = obj.toWeb();

        let venueErr, venue;
        [venueErr, venue] = await to(Venue.findOne({where: {id: booking_obj.venueId}}));

        if(venueErr || !venue)
            booking_obj.venue = null;
        else
            booking_obj.venue = venue.toWeb();

        let spaceErr, space;
        [spaceErr, space] = await to(Space.findOne({where: {id: booking_obj.spaceId}}));
        if(spaceErr || !space)
            booking_obj.space = null;
        else
            booking_obj.space = space.toWeb();

        let customerErr, customer;
        [customerErr, customer] = await to(Customer.findOne({where: {id: booking_obj.customerId}}));
        if(customerErr || !customer)
            booking_obj.customer = null;
        else
            booking_obj.customer = customer.toWeb();

        let ownerErr, owner;
        [ownerErr, owner] = await to(User.findOne({where: {id: booking_obj.ownerId}}));
        if(ownerErr || !owner)
            booking_obj.owner = null;
        else{
            booking_obj.owner = owner.toWeb();
            delete booking_obj.owner.password;
        }

        let statusErr, status;
        [statusErr, status] = await to(Status.findOne({where: {id: booking_obj.statusId}}));
        if(statusErr || !status)
            booking_obj.status = null;
        else
            booking_obj.status = status.toWeb();

        return booking_obj;
    }));

    return ReS(res, {bookings:booking_array});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let booking = req.booking;

    return ReS(res, {booking:booking.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, booking, data;
    booking = req.booking;
    data = req.body;
    booking.set(data);

    [err, booking] = await to(booking.save());
    if(err) return ReE(res, err);

    let booking_obj = booking.toWeb();
    let venueErr, venue;
    [venueErr, venue] = await to(Venue.findOne({where: {id: booking_obj.venueId}}));

    if(venueErr || !venue)
        booking_obj.venue = null;
    else
        booking_obj.venue = venue.toWeb();

    let spaceErr, space;
    [spaceErr, space] = await to(Space.findOne({where: {id: booking_obj.spaceId}}));
    if(spaceErr || !space)
        booking_obj.space = null;
    else
        booking_obj.space = space.toWeb();

    let customerErr, customer;
    [customerErr, customer] = await to(Customer.findOne({where: {id: booking_obj.customerId}}));
    if(customerErr || !customer)
        booking_obj.customer = null;
    else
        booking_obj.customer = customer.toWeb();

    let ownerErr, owner;
    [ownerErr, owner] = await to(User.findOne({where: {id: booking_obj.ownerId}}));
    if(ownerErr || !owner)
        booking_obj.owner = null;
    else{
        booking_obj.owner = owner.toWeb();
        delete booking_obj.owner.password;
    }

    let statusErr, status;
    [statusErr, status] = await to(Status.findOne({where: {id: booking_obj.statusId}}));
    if(statusErr || !status)
        booking_obj.status = null;
    else
        booking_obj.status = status.toWeb();

    return ReS(res, {booking:booking_obj});
}
module.exports.update = update;

const remove = async function(req, res){
    let booking, err;
    booking = req.booking;

    [err, booking] = await to(booking.destroy());
    if(err) return ReE(res, 'error occured trying to delete the booking');

    return ReS(res, {message:'Deleted Booking'}, 204);
}
module.exports.remove = remove;

const createQuote = async function(req, res){
    let booking_id = req.params.booking_id;

    let quote_info = req.body;
    quote_info.BookingId = booking_id;

    let err, quote;
    [err, quote] = await to(Quote.create(quote_info));
    if(err) return ReE(res, err, 422);

    let customerErr, customer;
    [customerErr, customer] = await to(Customer.findOne({where: {id: quote_info.customerId}}));

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let today = new Date();
    let dd = today.getDate();
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[today.getDay()];
    const date =  n + ',' + dd + ' ' + monthNames[today.getMonth()] + ' ' + yyyy + ' at ' + today.getHours() + ":" + today.getMinutes();

    const [netSubtotal, taxes, grandTotal] = computeCostItemsSummary(
      JSON.parse(quote_info.costItems),
      quote_info.discount
    );
    const slots = JSON.parse(quote_info.slots)
    let spaces = '';
    let duration = '';
    if (slots.length) {
      spaces = slots[0].kind;
      duration = slots[0].endHour - slots[0].startHour;
    }
    mail.sendWithTemplate('', customer.email, 'quotation', {
      subject: 'New Quotation',
      emailMessage: 'New Quotation',
      date: date,
      duration: "2 hours" || duration,
      spaces: spaces || "single-day" || quote_info.note || "Spaces",
      costItems: JSON.parse(quote_info.costItems),
      slots: JSON.parse(quote_info.slots),
      discount: quote_info.discount,
      netSubtotal, taxes, grandTotal,
      id: quote.id || 0,
    }).catch((mErr) => {
      console.log("mErr", mErr, mErr.response)
    });

    return ReS(res, {}, 201);
}
module.exports.createQuote = createQuote;

function computeCostItemsSummary(costItems, discount) {
  const netSubtotal =
    costItems &&
    costItems.reduce(
      (acc, item) =>
        acc + item.quantity * item.unitPrice * (1 - discount / 100),
      0
    );

  const taxes =
    costItems &&
    costItems.reduce(
      (acc, item) =>
        acc +
        (item.quantity * item.unitPrice * (1 - discount / 100) * item.vatRate) /
        100,
      0
    );

  const grandTotal = netSubtotal + taxes;

  return [netSubtotal.toFixed(2), taxes.toFixed(2), grandTotal.toFixed(2)];
}

const getAllQuotes = async function(req, res){
    let booking_id = req.params.booking_id;
    let err, quotes;

    [err, quotes] = await to(Quote.findAll({where: {BookingId: booking_id}}));
    if(err) return ReE(res, err, 422);

    let quote_array = [];
    quote_array = quotes.map(obj=>obj.toWeb());

    return ReS(res, {quotes:quote_array});
}
module.exports.getAllQuotes = getAllQuotes;

const getQuote = function(req, res){
    let quote = req.quote;

    return ReS(res, {quote:quote.toWeb()});
}
module.exports.getQuote = getQuote;

const updateQuote = async function(req, res){
    let err, quote, data;
    quote = req.quote;
    data = req.body;
    quote.set(data);

    [err, quote] = await to(quote.save());
    if(err) return ReE(res, err);

    return ReS(res, {quote:quote.toWeb()});
}
module.exports.updateQuote = updateQuote;

const removeQuote = async function(req, res){
    let quote, err;
    quote = req.quote;

    [err, quote] = await to(quote.destroy());
    if(err) return ReE(res, 'error occured trying to delete the quote');

    return ReS(res, {message:'Deleted Quote'}, 204);
}
module.exports.removeQuote = removeQuote;

const createInvoice = async function(req, res){
    let booking_id = req.params.booking_id;

    let invoice_info = req.body;
    invoice_info.BookingId = booking_id;

    let err, invoice;
    [err, invoice] = await to(Invoice.create(invoice_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {invoice:invoice.toWeb()}, 201);
}
module.exports.createInvoice = createInvoice;

const getInvoices = async function(req, res){
    let booking_id = req.params.booking_id;
    let err, invoices;

    [err, invoices] = await to(Invoice.findAll({where: {BookingId: booking_id}}));
    if(err) return ReE(res, err, 422);

    let invoice_array = [];
    invoice_array = invoices.map(obj=>obj.toWeb());

    return ReS(res, {invoices:invoice_array});
}
module.exports.getInvoices = getInvoices;

const getAllInvoices = async function(req, res){
    let err, invoices;

    [err, invoices] = await to(Invoice.findAll());
    if(err) return ReE(res, err, 422);

    let invoice_array = [];
    invoice_array = invoices.map(obj=>obj.toWeb());

    return ReS(res, {invoices:invoice_array});
}
module.exports.getAllInvoices = getAllInvoices;

const getInvoice = async function(req, res){
    let invoice = req.invoice;

    return ReS(res, {invoice:invoice.toWeb()});
}
module.exports.getInvoice = getInvoice;

const updateInvoice = async function(req, res){
    let err, invoice, data;
    invoice = req.invoice;
    data = req.body;
    invoice.set(data);

    [err, invoice] = await to(invoice.save());
    if(err) return ReE(res, err);

    return ReS(res, {invoice:invoice.toWeb()});
}
module.exports.updateInvoice = updateInvoice;

const removeInvoice = async function(req, res){
    let invoice, err;
    invoice = req.invoice;

    [err, invoice] = await to(invoice.destroy());
    if(err) return ReE(res, 'error occured trying to delete the invoice');

    return ReS(res, {message:'Deleted Invoice'}, 204);
}
module.exports.removeInvoice = removeInvoice;
