// utils/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'equipeplay2learn@gmail.com', // seu e-mail
    pass: 'hbxb enma msak yhjb', // sua senha ou senha de app
  },
});

export default transporter;
