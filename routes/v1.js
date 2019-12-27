const express 			        					= require('express');
const router 			          					= express.Router();

const UserController 	      					= require('../controllers/user.controller');
const CompanyController     					= require('../controllers/company.controller');
const HomeController 	      					= require('../controllers/home.controller');
const VenueController       					= require('../controllers/venue.controller');
const SpaceController       					= require('../controllers/space.controller');
const StatusController      					= require('../controllers/status.controller');
const CustomerController    					= require('../controllers/customer.controller');
const BookingController    						= require('../controllers/booking.controller');
const StripeController                = require('../controllers/stripe.controller');
const BookingColorController          = require('../controllers/bookingcolor.controller');
const CalendarViewController          = require('../controllers/calendarview.controller');
const CalendarSettingController       = require('../controllers/calendarsetting.controller');
const UploadImageController           = require('../controllers/upload.controller');

const custom 	              = require('./../middleware/custom');

const passport      	      = require('passport');
const path                  = require('path');


require('./../middleware/passport')(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

router.post(    '/auth/register',           													UserController.create);
router.post(    '/auth/login',              													UserController.login);
router.get(     '/auth/login/:uuid',                                  UserController.loginWithUUID);
router.get(     '/auth/me',                														passport.authenticate('jwt', {session:false}), UserController.get);

router.get(     '/users',                   													passport.authenticate('jwt', {session:false}), UserController.getAll);
router.put(     '/users',                   													passport.authenticate('jwt', {session:false}), UserController.update);
router.delete(  '/users',                   													passport.authenticate('jwt', {session:false}), UserController.remove);

router.post(    '/venues',                  													passport.authenticate('jwt', {session:false}), VenueController.create);
router.get(     '/venues',    																				passport.authenticate('jwt', {session:false}), VenueController.getAll);
router.get(     '/venues/:venue_id',        													passport.authenticate('jwt', {session:false}), custom.venue, VenueController.get);
router.put(     '/venues/:venue_id',        													passport.authenticate('jwt', {session:false}), custom.venue, VenueController.update);
router.delete(  '/venues/:venue_id',        													passport.authenticate('jwt', {session:false}), custom.venue, VenueController.remove);

router.post(    '/spaces',                  													passport.authenticate('jwt', {session:false}), SpaceController.create);
router.get(     '/spaces/venue/:venue_id',  													passport.authenticate('jwt', {session:false}), SpaceController.getAll);
router.get(     '/spaces/:space_id',        													passport.authenticate('jwt', {session:false}), custom.space, SpaceController.get);
router.put(     '/spaces/:space_id',        													passport.authenticate('jwt', {session:false}), custom.space, SpaceController.update);
router.delete(  '/spaces/:space_id',        													passport.authenticate('jwt', {session:false}), custom.space, SpaceController.remove);
router.get(     '/userspaces',                                        passport.authenticate('jwt', {session:false}), SpaceController.getAllUserSpaces),
router.get(     '/spaces/subdomain/:subdomain',                       SpaceController.getAllWithSubdomain)

router.post(    '/statuses',                  												passport.authenticate('jwt', {session:false}), StatusController.create);
router.get(     '/statuses',  																				passport.authenticate('jwt', {session:false}), StatusController.getAll);
router.get(     '/statuses/:status_id',        												passport.authenticate('jwt', {session:false}), custom.status, StatusController.get);
router.put(     '/statuses/:status_id',        												passport.authenticate('jwt', {session:false}), custom.status, StatusController.update);
router.delete(  '/statuses/:status_id',        												passport.authenticate('jwt', {session:false}), custom.status, StatusController.remove);

router.post(    '/companies',               													passport.authenticate('jwt', {session:false}), CompanyController.create);
router.get(     '/companies',               													passport.authenticate('jwt', {session:false}), CompanyController.getAll);
router.get(     '/company',   																				passport.authenticate('jwt', {session:false}), CompanyController.get);
router.put(     '/companies/:company_id',   													passport.authenticate('jwt', {session:false}), custom.company, CompanyController.update);
router.delete(  '/companies/:company_id',   													passport.authenticate('jwt', {session:false}), custom.company, CompanyController.remove);
router.put(     '/companies/savesubdomain/:company_id',               passport.authenticate('jwt', {session:false}), custom.company, CompanyController.saveSubdomain);
router.get(     '/companies/subdomain/:subdomain',                    CompanyController.checkSubdomain)

router.post(    '/customers',               													passport.authenticate('jwt', {session:false}), CustomerController.create);
router.get(     '/customers',               													passport.authenticate('jwt', {session:false}), CustomerController.getAll);
router.get(     '/customers/:customer_id',   													passport.authenticate('jwt', {session:false}), custom.customer, CustomerController.get);
router.put(     '/customers/:customer_id',   													passport.authenticate('jwt', {session:false}), custom.customer, CustomerController.update);
router.delete(  '/customers/:customer_id',   													passport.authenticate('jwt', {session:false}), custom.customer, CustomerController.remove);

router.post(    '/bookings',               														passport.authenticate('jwt', {session:false}), BookingController.create);
router.get(     '/bookings',               														passport.authenticate('jwt', {session:false}), BookingController.getAll);
router.get(     '/bookings/:booking_id',   														passport.authenticate('jwt', {session:false}), custom.booking, BookingController.get);
router.put(     '/bookings/:booking_id',   														passport.authenticate('jwt', {session:false}), custom.booking, BookingController.update);
router.delete(  '/bookings/:booking_id',   														passport.authenticate('jwt', {session:false}), custom.booking, BookingController.remove);
router.get(     '/bookings/subdomain/:subdomain',                   BookingController.bookingWithSubdomain);

router.post(    '/bookings/:booking_id/quotes',         							passport.authenticate('jwt', {session:false}), BookingController.createQuote);
router.get(     '/bookings/:booking_id/quotes',         							passport.authenticate('jwt', {session:false}), BookingController.getAllQuotes);
router.get(     '/bookings/:booking_id/quotes/:quote_id',         		passport.authenticate('jwt', {session:false}), custom.quote, BookingController.getQuote);
router.put(     '/bookings/:booking_id/quotes/:quote_id',         		passport.authenticate('jwt', {session:false}), custom.quote, BookingController.updateQuote);
router.delete(  '/bookings/:booking_id/quotes/:quote_id',         		passport.authenticate('jwt', {session:false}), custom.quote, BookingController.removeQuote);

router.post(    '/bookings/:booking_id/invoices',         						passport.authenticate('jwt', {session:false}), BookingController.createInvoice);
router.get(     '/bookings/:booking_id/invoices',         						passport.authenticate('jwt', {session:false}), BookingController.getInvoices);
router.get(     '/bookings/invoices/all',         										passport.authenticate('jwt', {session:false}), BookingController.getAllInvoices);
router.get(     '/bookings/:booking_id/invoices/:invoice_id',         passport.authenticate('jwt', {session:false}), custom.invoice, BookingController.getInvoice);
router.put(     '/bookings/:booking_id/invoices/:invoice_id',         passport.authenticate('jwt', {session:false}), custom.invoice, BookingController.updateInvoice);
router.delete(  '/bookings/:booking_id/invoices/:invoice_id',         passport.authenticate('jwt', {session:false}), custom.invoice, BookingController.removeInvoice);

// router.post(    '/bookings/:booking_id/transferFunds',         				passport.authenticate('jwt', {session:false}), StripeController.transferFunds);
// router.post(    '/bookings/:booking_id/realeaseFund',         				passport.authenticate('jwt', {session:false}), StripeController.realeaseFund);
router.post(    '/bookings/transferCardFunds',         				        passport.authenticate('jwt', {session:false}), StripeController.transferCardFunds);

router.post(    '/bookings/getCreateStripeAccountLink',         			passport.authenticate('jwt', {session:false}), StripeController.getCreateStripeAccountLink);
router.post(    '/bookings/setStripeAccountInfo',         				    passport.authenticate('jwt', {session:false}), StripeController.setStripeAccountInfo);
router.post(    '/bookings/transferFunds',         				            passport.authenticate('jwt', {session:false}), StripeController.transferFunds);
router.post(    '/bookings/createPaymentIntent',                      passport.authenticate('jwt', {session:false}), StripeController.createPaymentIntent);

router.post(    '/bookings/getStripeDashboardLink',         				  passport.authenticate('jwt', {session:false}), StripeController.getStripeDashboardLink);
router.post(    '/bookings/realeaseFund',         			            	passport.authenticate('jwt', {session:false}), StripeController.realeaseFund);
router.post(    '/bookings/webhook',                                  passport.authenticate('jwt', {session:false}), StripeController.webhook);

router.post(    '/bookingcolor',               												passport.authenticate('jwt', {session:false}), BookingColorController.create);
router.get(     '/bookingcolor',   																		passport.authenticate('jwt', {session:false}), BookingColorController.get);
router.put(     '/bookingcolor/:bookingColor_id',   									passport.authenticate('jwt', {session:false}), custom.bookingColor, BookingColorController.update);

router.post(    '/calendarview',               												passport.authenticate('jwt', {session:false}), CalendarViewController.create);
router.get(     '/calendarview',   																		passport.authenticate('jwt', {session:false}), CalendarViewController.get);
router.put(     '/calendarview/:calendarView_id',   									passport.authenticate('jwt', {session:false}), custom.calendarView, CalendarViewController.update);
router.get(     '/calendarview/subdomain/:subdomain',                 CalendarViewController.getWithSubdomain)

router.post(    '/calendarsetting',                                   passport.authenticate('jwt', {session:false}), CalendarSettingController.create);
router.get(     '/calendarsetting',   																passport.authenticate('jwt', {session:false}), CalendarSettingController.get);
router.put(     '/calendarsetting/:calendarSetting_id',   					  passport.authenticate('jwt', {session:false}), custom.calendarSetting, CalendarSettingController.update);

router.post(    '/upload/image',                                      passport.authenticate('jwt', {session:false}), UploadImageController.uploadImage);
router.get(    '/read/image/:id',                                     UploadImageController.readImage);
router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)

//********* API DOCUMENTATION **********
router.use('/docs/api.json',                express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                         express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
