const CONFIG = require('../config/config');
const nodemailer = require('nodemailer');
const jade = require('jade');

exports.sendWithTemplate = async (from, to, template, data) => {

  const templatePath = __dirname + `/../views/mails/${template}`;
  const subject = jade.renderFile(`${templatePath}/subject.jade`, data);
  const text = jade.renderFile(`${templatePath}/text.jade`, data);
  const html = jade.renderFile(`${templatePath}/html.jade`, data);

  return this.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments: data.attachments,
  });
};

exports.send = ({ from, to, subject, text, html, attachments }) => {

  let transporter = nodemailer.createTransport({
    host: CONFIG.email_host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: CONFIG.email_user, // generated ethereal user
      pass: CONFIG.email_pass // generated ethereal password
    }
  });

  const msg = {
    to,
    from,
    subject,
    text,
    html,
    attachments,
  };

  console.log(msg);
  const res = transporter.send(msg);
  console.log('email res', res);
  return res;
};

// Sample Email send Code

// const mail = require('./mail');
// mail.sendWithTemplate(settings.mail.tellAFriend, email, 'tellAFriend', {
//   subject,
//   emailMessage,
//   websiteUrl: settings.websiteUrl,
//   hostApiUrl: settings.hostApiUrl,
//   redirectLink: `${settings.websiteUrl}/signin`,
//   unsubscribeLink: `${settings.websiteUrl}/profile?page=/profile`,
// }).catch((mErr) => {
//   return res.status(500).send(errorHelper.formatError(errorHelper.internalServerErr));
// });
// res.send({
//   message: 'Message has been successfully shared.',
// });
