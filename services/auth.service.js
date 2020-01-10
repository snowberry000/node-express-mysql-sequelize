const { User } 	    = require('../models');
const validator     = require('validator');
const { to, TE }    = require('../services/util.service');

const getUniqueKeyFromBody = function(body){// this is so they can send in 2 options unique_key or email and it will work
    let unique_key = body.unique_key;
    if(typeof unique_key==='undefined'){
        if(typeof body.email != 'undefined'){
            unique_key = body.email
        }else{
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async (userInfo) => {
    let unique_key, auth_info, err;

    auth_info={};
    auth_info.status='create';

    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('An email was not entered.');

    if(validator.isEmail(unique_key)){
        auth_info.method = 'email';
        userInfo.email = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err){
            console.log(err);
            TE(err.message);
        } 

        return user;

    }else{
        TE('A valid email was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async function(userInfo){//returns token
    let unique_key;
    let auth_info = {};
    auth_info.status = 'login';
    unique_key = getUniqueKeyFromBody(userInfo);

    if(!unique_key) TE('Please enter an email to login');


    // if(!userInfo.password) TE('Please enter a password to login');

    let user;
    if(validator.isEmail(unique_key)){
        auth_info.method='email';

        [err, user] = await to(User.findOne({where:{email:unique_key}}));
        if(err) TE(err.message);

    }else{
        TE('A valid email was not entered');
    }

    // if(!user) TE('Not registered');
    is_new = false;
    if (!user) {
        [err, user] = await to(User.create(userInfo));
        is_new = true;
    }
    // [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE(err.message);
    
    if (is_new) {
        const { Company } = require('../models');
        [errCompany, company] = await to(Company.create({
            UserId: user.id,
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
    }    

    return {user, is_new};

}
module.exports.authUser = authUser;