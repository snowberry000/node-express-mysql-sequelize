const { User } = require('../models');

const CONFIG = require('../config/config');

var utils = require('../services/stripe.service');

var stripe = require("stripe")(CONFIG.stripe_secret_key);

var request = require('request');

const { to, ReE, ReS } = require('../services/util.service');


function transferCardFunds(req, res) {
    const amount = req.body.amount;
    const currency = req.body.currency;
    const token = req.body.stripeToken;
    stripe.charges.create({
        amount: amount,
        currency: currency,
        source: token,
        description: 'Charge for xxx',
        receipt_email: 'bestservice-jinjin@hotmail.com',     //client receiver mail
        metadata: { 'id': amount }
    }).then(function (charge) {
        console.log(JSON.stringify(charge));
        return ReS(charge, { charge }, 201);
        //return result
    }, function (stripeErr) {
        console.log(stripeErr);
        return ReE(res, stripeErr, 420);
        //return error
    });
}

function setStripeAccountInfo(req, res) {

    let err, user, data;

    let postData = {
        'code': req['body']['stripe_auth_code'],
        'client_secret': CONFIG.stripe_secret_key,
        'grant_type': 'authorization_code'
    }
    console.log(postData);
    request.post(
        'https://connect.stripe.com/oauth/token',
        { json: postData },
        async function (error, response, body) {
            console.log(body);
            if (!error && response && response.statusCode === 200) {
                user = req.user;
                let dataObj = {
                    'stripe_user_id': body['stripe_user_id'],
                    'stripe_refresh_token': body['refresh_token'],
                    'stripe_token_type': body['token_type'],
                    'stripe_status': 1
                }
                console.log(dataObj);
                //Save Data to the in User database

                user.set(dataObj);

                [err, user] = await to(user.save());
                if (err) {
                    if (err.message == 'Validation error') err = 'The email address is already in use';
                    return ReE(res, err);
                }
                return ReS(res, { message: 'Updated User stripe info: ' + user.email });

            } else {
            }
        }
    );
}

async function transferFunds(req, res) {

    const amount = req.body.amount;
    const currency = req.body.currency;

    let userErr, user;
    [userErr, user] = await to(User.findOne({ where: { id: req.user.id } }));
    if (userErr) {
        if (userErr.message == 'Validation error') err = 'User does not exist!';
        return ReE(res, userErr);
    }
    
    console.log(user);
    stripe.charges.create({
        amount: amount,
        currency: currency,
        source: user['stripe_user_id'],
        description: 'Pay for booking',
        // receipt_email: result['email'],
        receipt_email: 'bestservice-jinjin@hotmail.com',        //client receiver mail
        metadata: { 'id': 10 }
    }).then(function (charge) {
        console.log(JSON.stringify(charge));
        return ReS(res, { charge }, 201);
    }, function (stripeErr) {
        console.log(stripeErr);
        return ReE(res, stripeErr, 422);        
    });

}

// function getReleaseFundUrl(req, res) {
//     var cb = function (result) {
//         utils.sendResponse(res, result);
//     }
//     stripeAccModel.getReleaseFundUrl(req, res, cb);
// }

// function getSetPreferencesStatus(req, res) {
//     var cb = function (result) {
//         utils.sendResponse(res, result);
//     }
//     stripeAccModel.getSetPreferencesStatus(req, res, cb);
// }

// function webhook(req, res) {
//     stripeAccModel.webhook(req, res);
// }

function getStripeDashboardLink(req, res) {
    stripe.accounts.createLoginLink(sRes[0]['stripe_user_id'], function (err, link) {
        if (err) {
            return ReE(res, err, 421);
        } else {
            return ReS(res, { 'url': link['url'] }, 201);
        }
    });
}

function getCreateStripeAccountLink(req, res, cb) {
    return ReS(res, { 'url': `https://connect.stripe.com/express/oauth/authorize?client_id=${CONFIG.stripe_client_id}` }, 201);
}

function realeaseFund(req, res) {
    stripe.transfers.create({
        amount: obj['rate'] * constant['CENT_TO_DOLLAR'],
        currency: 'usd',
        source_transaction: cRes[0]['stripe_charge_id'],
        destination: cRes[0]['seeker_details'][0]['stripe_user_id'],
        description: 'Charge for ' + jobId,
        metadata: { 'id': jobId, m_id: obj['_id'].toString() }
    }).then(function (transfer) {
        return ReS(charge, { status: status.toWeb() }, 201);
    }, function (stripeErr) {
        return ReE(res, stripeErr, 422);
    });
}

module.exports = {
    setStripeAccountInfo,
    transferFunds,
    transferCardFunds,
    // getReleaseFundUrl,
    // getSetPreferencesStatus,
    // webhook,
    getStripeDashboardLink,
    getCreateStripeAccountLink,
    realeaseFund
}
