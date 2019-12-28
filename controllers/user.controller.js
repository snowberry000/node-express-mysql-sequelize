const { User, Company }             = require('../models');
const authService                   = require('../services/auth.service');
const { to, ReE, ReS }              = require('../services/util.service');

const create = async function(req, res){
    const body = req.body;

    if(!body.unique_key && !body.email){
        return ReE(res, 'Please enter an email to register.');
    // } else if(!body.password){
    //     return ReE(res, 'Please enter a password to register.');
    }else{
        let err, user;

        [err, user] = await to(authService.createUser(body));
        if(err) return ReE(res, err, 422);
        
        let user_json = user.toWeb();
        delete user_json.password;

        [errCompany, company] = await to(Company.create({
            UserId: user_json.id,
            city: "",
            currency: "GBP",
            name: "",
            phone: "",
            postCode: "",
            street: "",
            vatId: "",
            vatRate: "20",
            logoImg: "",
            subdomain: "",
        }));

        return ReS(res, {message:'Successfully created new user.', user:user_json, token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const getAll = async function(req, res){
    let err, users;

    [err, users] = await to(User.findAll());
    if(err) return ReE(res, err, 422);

    let user_array = [];
    user_array = users.map(obj => {
        let user_obj = obj.toWeb();
        delete user_obj.password;
        return user_obj;
    });

    return ReS(res, {users: user_array});
}
module.exports.getAll = getAll;

const get = async function(req, res){
    let user = req.user;
    let user_obj = user.toWeb();

    delete user_obj.password;

    return ReS(res, {user:user_obj});
}
module.exports.get = get;

const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;

const login = async function(req, res){
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    let user_obj = user.user.toWeb();
    delete user_obj.password;

    return ReS(res, {token:user.user.getJWT(), user:{ ...user_obj, is_new:user.is_new}});
}
module.exports.login = login;

const loginWithUUID = async function(req, res){    
    [errUUID, userUUID] = await to(User.findOne({where: {uuid: req.params.uuid}}));
    if(errUUID) return ReE(res, errUUID, 422);

    [err, user] = await to(authService.authUser({email: userUUID.email}))
    if(err) return ReE(res, err, 422);
    
    return ReS(res, {token: user.user.getJWT(), user: user.user.toWeb()})
}
module.exports.loginWithUUID = loginWithUUID;

const loginWithEmailSubdomain = async function(req, res){
    [errCompany, company] = await to(Company.findOne({where: {subdomain: req.body.subdomain}}))

    if (errCompany || !company)
        return ReE(res, errCompany, 422)
            
    let errUser, userFind;
    [errUser, userFind] = await to(User.findOne({where: {email:req.body.email, id:company.UserId}}))
    if(errUser || !userFind)
        return ReE(res, errUser, 422)
    
    let err, user;
    [err, user] = await to(authService.authUser({email: userFind.email}))
    if(err) return ReE(res, err, 422);

    return ReS(res, {token: user.user.getJWT(), user: user.user.toWeb()})
}
module,exports.loginWithEmailSubdomain = loginWithEmailSubdomain;