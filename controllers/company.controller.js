const { Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, company;
    let user = req.user.toWeb();

    let company_info = req.body;
    company_info.UserId = user.id;

    [err, company] = await to(Company.create(company_info));
    if(err) return ReE(res, err, 422);

    return ReS(res, {company:company.toWeb()}, 201);
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, companies;

    [err, companies] = await to(Company.findAll());
    if(err) return ReE(res, err, 422);

    let company_array = [];
    company_array = companies.map(obj=>obj.toWeb());
    
    return ReS(res, {companies:company_array});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let err, company;
    let user = req.user.toWeb();

    [err, company] = await to(Company.findOne({where: {UserId: user.id}}));
    if(err) return ReE(res, err, 422);
    
    return ReS(res, {company:company.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, company, data;
    company = req.company;
    data = req.body;
    company.set(data);

    [err, company] = await to(company.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {company:company.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let company, err;
    company = req.company;

    [err, company] = await to(company.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;