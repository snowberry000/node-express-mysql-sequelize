const { Bookingcolor } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
  let err, bookingColor;
  let user = req.user.toWeb();

  let color_info = req.body;
  color_info.UserId = user.id;

  [err, bookingColor] = await to(Bookingcolor.create(color_info));
  if(err) return ReE(res, err, 422);

  return ReS(res, {bookingColor:bookingColor.toWeb()}, 201);
}
module.exports.create = create;

const get = async function(req, res){
  let err, bookingColor;
  let user = req.user.toWeb();
  [err, bookingColor] = await to(Bookingcolor.findOne({where: {UserId: user.id}}));
  if(err) return ReE(res, err, 422);    

  return ReS(res, {bookingColor:bookingColor?bookingColor.toWeb():null});
}
module.exports.get = get;

const update = async function(req, res){
  let err, bookingColor, data;
  bookingColor = req.bookingColor;
  data = req.body;
  bookingColor.set(data);

  [err, bookingColor] = await to(bookingColor.save());
  if(err){
      return ReE(res, err);
  }
  return ReS(res, {bookingColor:bookingColor.toWeb()});
}
module.exports.update = update;