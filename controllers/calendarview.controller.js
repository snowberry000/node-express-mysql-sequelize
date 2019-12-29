const { Calendarview, Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
  let err, calendarView;
  let user = req.user.toWeb();

  let view_info = req.body;
  view_info.UserId = user.id;

  [err, calendarView] = await to(Calendarview.create(view_info));
  if(err) return ReE(res, err, 422);

  return ReS(res, {calendarView:calendarView.toWeb()}, 201);
}
module.exports.create = create;

const get = async function(req, res){
  let err, calendarView;
  let user = req.user.toWeb();
  [err, calendarView] = await to(Calendarview.findOne({where: {UserId: user.id}}));
  if(err) return ReE(res, err, 422);    

  return ReS(res, {calendarView:calendarView?calendarView.toWeb():null});
}
module.exports.get = get;

const update = async function(req, res){
  let err, calendarView, data;
  calendarView = req.calendarView;
  data = req.body;
  calendarView.set(data);

  [err, calendarView] = await to(calendarView.save());
  if(err){
      return ReE(res, err);
  }
  return ReS(res, {calendarView:calendarView.toWeb()});
}
module.exports.update = update;

const getWithSubdomain = async function(req, res){  
  const subdomain = req.params.subdomain;
  [errCompany, company] = await to(Company.findOne({where: {subdomain: req.params.subdomain}}))
  if (errCompany) {
      return ReE(res, errCompany);
  }

  [err, calendarView] = await to(Calendarview.findOne({where: {UserId: company.UserId}}));
  if(err) return ReE(res, err, 422);    

  return ReS(res, {calendarView:calendarView?calendarView.toWeb():null});

}
module.exports.getWithSubdomain = getWithSubdomain;