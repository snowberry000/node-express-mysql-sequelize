const CONFIG = require('../config/config');

var utils = require('../services/stripe.service');

// var stripe = require("stripe")(CONFIG.stripe_secret_key);
var stripe = require("stripe")('sk_test_j77QBEGhvKzFCVAqKrtKWhWH002Q2pTrzl');

var request = require('request');

const { to, ReE, ReS } = require('../services/util.service');
// function setStripeAccountInfo(req, res) {
//     var cb = function (result) {
//         utils.sendResponse(res, result);
//     }
//     stripeAccModel.setStripeAccountInfo(req, res, cb);
// }

function transferCardFunds(req, res) {
    const amount = req.body.amount;
    const currency = req.body.currency;
    const token = req.body.stripeToken;
    stripe.charges.create({
        amount: amount,
        currency: currency,
        source: token.id,
        description: 'Charge for xxx',
        metadata: { 'id': amount },
    }).then(function (charge) {
        return ReS(res, charge, 201);
        //return result
    }, function (stripeErr) {
        console.log(stripeErr);
        return ReE(res, stripeErr, 420);
        //return error
    });
}

function transferFunds(req, res) {

    // let authData = {
    //     'response_type': 'code',
    //     'client_id': 'ca_DCOD0B6Wd86NOq7esAPJtpqe8jpC67vg',
    //     'scope': 'read_write'
    // }

    // request.get('https://connect.stripe.com/express/oauth/authorize', { json: authData }, function (error, response, body) {
    //     console.log(body);
    let postData = {
        'code': 'ac_FyBwUourghSiDVH0ec8Jlak6BvyGmFq5',
        'client_secret': 'sk_test_aYOHJ7Ock7MKVGeJjxfp8Jyz00ULOy4Dz6',
        'grant_type': 'authorization_code'
    }
    request.post('https://connect.stripe.com/oauth/token', { json: postData }, function (error, response, body) {
        if (!error && response && response.statusCode === 200) {
            console.log(body);
            let dataObj = {
                'user_id': '111',
                'stripe_user_id': body['stripe_user_id'],
                'stripe_refresh_token': body['refresh_token'],
                'stripe_token_type': body['token_type']
            }
            console.log(dataObj);
            stripe.charges.create({
                amount: 100,
                currency: 'usd',
                source: body['stripe_user_id'],
                description: 'Charge for ',
                // receipt_email: result['email'],
                receipt_email: 'truegardener555@gmail.com',
                metadata: { 'id': 10 }
            }).then(function (charge) {
                console.log(JSON.stringify(charge));
                return ReS(charge, { charge }, 201);
                //return result
            }, function (stripeErr) {
                console.log(stripeErr);
                return ReE(res, stripeErr, 422);
                //return error
            });
        } else {
            console.log('err');
            return ReE(res, 'err', 423);
        }
    });
    // });

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
            return ReE(err, err, 421);
        } else {
            return ReS(link, { 'url': link['url'] }, 201);
        }
    });
}

function getCreateStripeAccountLink(req, res, cb) {
    // return ReS(charge, { 'url': `https://connect.stripe.com/express/oauth/authorize?client_id=${stripeClientId}&state=${role}_${jobId}` }, 201);
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
    // setStripeAccountInfo,
    transferFunds,
    transferCardFunds,
    // getReleaseFundUrl,
    // getSetPreferencesStatus,
    // webhook,
    getStripeDashboardLink,
    getCreateStripeAccountLink,
    realeaseFund
}
