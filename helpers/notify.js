const mailer = require('nodemailer')


var notify = {
  notifylist: function (list, lat, lng, devID) {
    var i, emails
    emails = list[0].email
    for (i = 1; i < list.length; i++) {
      emails = emails + ',' + list[i].email
    }

    var time = new Date()
    var offset = time.getTimezoneOffset()
    var istoffest = 330
    var ISTTime = new Date(time.getTime() + (istoffest + offset) * 60000)

    console.log(emails)
    var htmlbody = '<html><h3>SOS has been called!</h3><body><p>An SOS has been called by a device(' + String(devID) + ') linked to this email from the following location at ' + String(ISTTime.getHours()) + ':' + String(ISTTime.getMinutes()) + '</p><br><p>Please</p><a href = "http://maps.google.com?q=' + String(lat) + ',' + String(lng) + '">Click Here to view the location</a><p>where the SOS was called from.</p><br><p>This is an automated email Please do not reply</p><br><br><p>Helping Hand</p><br><p>Developer: AJ</p></body></html>'
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
