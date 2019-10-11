moment = require('moment');
config = require('../config/config');

const getCurrentDate = () => Date.now;

const getSuccessResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['SUCCESS'],
    status: resObj['STATUS']['SUCCESS'],
    message: resObj['MSG']['SUCCESS']
  }
}

const getErrorResObj = () => {
  var resObj = constant['RES_OBJ'];
  return {
    code: resObj['CODE']['FAIL'],
    status: resObj['STATUS']['FAIL'],
    message: resObj['MSG']['FAIL'],
    data: {}
  }
}

const callCB = (callback, resObj) => { (typeof(callback) === 'function') && callback(resObj); }

const sendResponse = (res, resObj) => { res.send(resObj); }

const log = (msg, value = null) => {
  if (config['showServerLog']) {
    console.log(msg, (value === null ? '' : value));
  }
}

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const getStripeErrorMsg = (errObj = null, key = 'message') => {
  let msg = constant['RES_OBJ']['MSG']['FAILED_DEPENDENCY'];
  if (errObj && errObj[key]) {
    msg = `${errObj[key]} | ${msg}`;
  }
  return msg;
}

const isObjectNotEmpty = (obj) => {
  return (obj !== null && typeof(obj) === 'object' && Object.keys(obj).length);
}

const convertUtcToEst = (date) => {
  return (date ? moment.utc(date).utcOffset(-5) : date);
}

const getCurrentEstDate = () => {
  return convertUtcToEst(new Date().toUTCString()).format(constant['DATE_FORMAT']);
}

const getStringifyObj = (obj = {}) => {
  try {
    return JSON.stringify(obj);
  } catch(ex) {
    return obj;
  }
}

module.exports = {
  getCurrentDate,
  getSuccessResObj,
  getErrorResObj,
  callCB,
  sendResponse,
  log,
  toTitleCase,
  getStripeErrorMsg,
  isObjectNotEmpty,
  convertUtcToEst,
  getCurrentEstDate,
  getStringifyObj,
}
