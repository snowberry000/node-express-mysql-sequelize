const { Status, Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const create = async function(req, res){
    let err, status;
    let status_info = req.body;
    let user = req.user.toWeb();

    status_info.UserId = user.id;

    [err, status] = await to(Status.create(status_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {status:status.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let user_json = req.user.toWeb();

    let err, statuses;

    [err, statuses] = await to(Status.findAll({where: {[Op.or]: [{UserId: user_json.id}, {type: 'default'}]}}));
	if(err) return ReE(res, err, 422);

	let statuses_array = [];
    statuses_array = statuses.map(obj => obj.toWeb());

    const defaultValues = ['Enquiry', 'Proposal', 'Accepted', 'Paid'];
    let newStatusArray = [];
    defaultValues.forEach(item => {
        let filteredOne = statuses_array.filter(itemOne => itemOne.name === item || itemOne.parentId === item);
        filteredOne.sort((a,b) => (a.order > b.order) ? 1 : -1);
        newStatusArray = [...newStatusArray, ...filteredOne];
    })

    const filteredOne = statuses_array.filter(item => item.type === 'custom' && item.parentId === null)
    filteredOne.sort((a,b) => (a.order > b.order) ? 1 : -1);
    newStatusArray = [ ...newStatusArray, ...filteredOne];

    return ReS(res, {statuses: newStatusArray});
}
module.exports.getAll = getAll;

const get = function(req, res){
    let status = req.status;

    return ReS(res, {status:status.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, status, data;
    status = req.status;
    
    if(status.type === 'default') return ReE(res, 'The default status can not be removed', 422);

    data = req.body;
    status.set(data);

    [err, status] = await to(status.save());
    if(err){
        return ReE(res, err, 422);
    }
    return ReS(res, {status:status.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let status, err;
    status = req.status;

    if(status.type === 'default') return ReE(res, 'The default status can not be removed', 422);

    [err, status] = await to(status.destroy());
    if(err) return ReE(res, 'error occured trying to delete the status', 422);

    return ReS(res, {message:'Deleted Status'}, 204);
}
module.exports.remove = remove;

const getAllWithSubdomain = async function(req, res){
    const subdomain = req.params.subdomain;
    [errCompany, company] = await to(Company.findOne({where: {subdomain: req.params.subdomain}}))
    if (errCompany) {
        return ReE(res, errCompany);
    }

    let err, statuses;

    [err, statuses] = await to(Status.findAll({where: {[Op.or]: [{UserId: company.UserId}, {type: 'default'}]}}));
	if(err) return ReE(res, err, 422);

	let statuses_array = [];
    statuses_array = statuses.map(obj => obj.toWeb());

    const defaultValues = ['Enquiry', 'Proposal', 'Accepted', 'Paid'];
    let newStatusArray = [];
    defaultValues.forEach(item => {
        let filteredOne = statuses_array.filter(itemOne => itemOne.name === item || itemOne.parentId === item);
        filteredOne.sort((a,b) => (a.order > b.order) ? 1 : -1);
        newStatusArray = [...newStatusArray, ...filteredOne];
    })

    const filteredOne = statuses_array.filter(item => item.type === 'custom' && item.parentId === null)
    filteredOne.sort((a,b) => (a.order > b.order) ? 1 : -1);
    newStatusArray = [ ...newStatusArray, ...filteredOne];

    return ReS(res, {statuses: newStatusArray});
}
module.exports.getAllWithSubdomain = getAllWithSubdomain;