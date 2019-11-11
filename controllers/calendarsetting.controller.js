const { Calendarsetting } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
  let err, calendarSetting;
  let user = req.user.toWeb();

  let settings = req.body;
  settings.UserId = user.id;

  [err, calendarSetting] = await to(Calendarsetting.create(settings));
  if(err) return ReE(res, err, 422);

  return ReS(res, {calendarSetting:calendarSetting.toWeb()}, 201);
}
module.exports.create = create;

const get = async function(req, res){
  let err, calendarSetting;
  let user = req.user.toWeb();
  [err, calendarSetting] = await to(Calendarsetting.findOne({where: {UserId: user.id}}));
  if(err) return ReE(res, err, 422);    

  return ReS(res, {calendarSetting:calendarSetting?calendarSetting.toWeb():null});
}
module.exports.get = get;

const update = async function(req, res){
  let err, calendarSetting, data;
  calendarSetting = req.calendarSetting;
  data = req.body;
  calendarSetting.set(data);

  [err, calendarSetting] = await to(calendarSetting.save());
  if(err){
      return ReE(res, err);
  }
  return ReS(res, {calendarSetting:calendarSetting.toWeb()});
}
module.exports.update = update;