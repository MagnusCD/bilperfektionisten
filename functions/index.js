const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // your email
    pass: "your-email-password", // your email password or app password
  },
});

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: user.email,
    subject: "Welcome to Our Service",
    text: `Hello ${user.displayName || user.email}, welcome to our service!`,
  };

  return transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully");
    }
  });
});

exports.sendBookingConfirmation = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate((snap) => {
    const booking = snap.data();
    const mailOptions = {
      from: "your-email@gmail.com",
      to: booking.email,
      subject: "Booking Confirmation",
      text: `Hello ${booking.name}, your booking is confirmed for ${booking.date} from ${booking.start} to ${booking.end}.`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent successfully");
      }
    });
  });

exports.sendBookingUpdate = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate((change) => {
    const booking = change.after.data();
    const mailOptions = {
      from: "your-email@gmail.com",
      to: booking.email,
      subject: "Booking Updated",
      text: `Hello ${booking.name}, your booking has been updated to ${booking.date} from ${booking.start} to ${booking.end}.`,
    };

    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent successfully");
      }
    });
  });
