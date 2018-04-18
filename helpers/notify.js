const mailer = require('nodemailer')

var creds = require('./creds.js')

var notify = {
  notifylist: function (list, lat, lng) {
    var i, emails
    emails = list[0].email
    for (i = 1; i < list.length; i++) {
      emails = emails + ',' + list[i].email
    }
    console.log(emails)
    var htmlbody = '<html><h1>SOS has been called!</h1><h2>An SOS has been called by a device linked to this email at the following location</h2><body><a href = "http://maps.google.com?q=' + String(lat) + ',' + String(lng) + '">Click Here to view the location</a></body></html>'
    this.send(emails, htmlbody)
  },

  send: function send (emails, htmlbody) {
    var transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: creds.email,
        pass: creds.password
      }
    })

    var mailOptions = {
      from: creds.email,
      to: emails,
      subject: 'SOS Notification',
      html: htmlbody
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
}

module.exports = notify
