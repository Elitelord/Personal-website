// import FormData from 'form-data'
// import Mailgun from 'mailgun.js'

// const API_KEY = process.env.MAILGUN_API_KEY || ''
// const DOMAIN = process.env.MAILGUN_DOMAIN ||''
    
//     // const formData = require ('form-data')
//     // const Mailgun = require ('mailgun.js')
// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).end(); // Method Not Allowed
//       }
//     console.log('Data', req.body);
    
//     const {fname, lname,email,message, phone, reason, country} = req.body

//     const mailgun = new Mailgun(FormData)
//     const client = mailgun.client({username: 'api', key: API_KEY})

//     const messageData = {
//         from: 'ContactForm <contact@sandboxe67ac4f496fd4a0f8aa943d90feee9e0.mailgun.org>',
//         to: 'elitelord3007@gmail.com',  
//         subject: `${reason}`,
//         text: `Hello,
//         You have a new form entry from: ${fname} ${lname} ${email}
        
//         ${message} 
//         and their number is
//         ${country} ${phone}`,
//     }
//     try{
//     const emailRes = await client.messages
//         .create(DOMAIN, messageData)
//         .then((res)=>{
//             console.log(res)
//         })
//         .catch((err)=>{
//             console.error(err)
//         })
//     console.log(emailRes)
//     } catch(err) {
//         console.error("Error sending Email", err)
//     }
    
//     res.status(200).json({ submitted:true })
//   }

import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const API_KEY = process.env.MAILGUN_API_KEY || '';
const DOMAIN = process.env.MAILGUN_DOMAIN || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { fname, lname, email, message, phone, reason, country } = req.body;

    // Basic input validation (you can add more robust validation here)
    if (!fname || !lname || !email || !message || !phone || !reason || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({ username: 'api', key: API_KEY });

    const messageData = {
      from: 'ContactForm <contact@sandboxe67ac4f496fd4a0f8aa943d90feee9e0.mailgun.org>',
      to: 'elitelord3007@gmail.com',
      subject: `${reason}`,
      text: `Hello,\nYou have a new form entry from: ${fname} ${lname} (${email})\n\n${message}\n\nTheir phone number is: ${country} ${phone}`,
    };

    await client.messages
      .create(DOMAIN, messageData)
      .then((response) => {
        console.log('Email sent successfully:', response);
        res.status(200).json({ submitted: true, message: 'Email sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        res.status(500).json({ submitted: false, error: 'Error sending email' });
      });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ submitted: false, error: 'An unexpected error occurred' });
  }
}