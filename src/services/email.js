
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'equipeplay2learn@gmail.com', 
    pass: 'hbxb enma msak yhjb', 
  },
});

export default transporter;
