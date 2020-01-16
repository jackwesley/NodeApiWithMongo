'use strict';

let config = require('../config');
let sendgrid = require('sendgrid')(config.sendgridkey)

exports.send = async (to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'hello@jackwesley.com',
        subject: subject,
        html: body
    });
}