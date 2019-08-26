const { Customer } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, customer;
    let user = req.user.toWeb();

    let customer_info = req.body;
    customer_info.UserId = user.id;

    [err, customer] = await to(Customer.create(customer_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {customer:customer.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user_json = req.user.toWeb();
    let err, customers;

    [err, customers] = await to(Customer.findAll({where: {UserId: user_json.id}}));
    if(err) return ReE(res, err, 422);

    let customer_array = [];
    customer_array = customers.map(obj=>obj.toWeb());
    
    return ReS(res, {customers:customer_array});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let customer = req.customer;

    return ReS(res, {customer:customer.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, customer, data;
    customer = req.customer;
    data = req.body;
    customer.set(data);

    [err, customer] = await to(customer.save());
    if(err) return ReE(res, err);

    return ReS(res, {customer:customer.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let customer, err;
    customer = req.customer;

    [err, customer] = await to(customer.destroy());
    if(err) return ReE(res, 'error occured trying to delete the customer');

    return ReS(res, {message:'Deleted Customer'}, 204);
}
module.exports.remove = remove;