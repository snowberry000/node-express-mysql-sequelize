const CONFIG = require('../config/config');
const nodemailer = require('nodemailer');
const jade = require('jade');
const sgMail = require('@sendgrid/mail');
const path = require('path');

exports.sendWithTemplate = async (from, to, template, data) => {

  const templatePath = path.join(__dirname, `/./../views/mails/${template}`);
  const subject = jade.renderFile(`${templatePath}/subject.jade`, data);
  const text = jade.renderFile(`${templatePath}/text.jade`, data);
  const html = jade.renderFile(`${templatePath}/html.jade`, data);

  return this.send({
    from: from || CONFIG.FROM_EMAIL,
    to,
    subject,
    text: text || '-',
    html: html || '-',
    attachments: data.attachments,
  });
};

exports.send = async({ from, to, subject, text, html, attachments }) => {
  sgMail.setApiKey(CONFIG.SEND_GRID_API_KEY);
  const msg = {
    to,
    from,
    subject,
    text,
    html,
    attachments,
  };

  console.log(msg);
  const res = await sgMail.send(msg);
  console.log('email res', res);
  return res;
};
