import FormData from 'form-data'
import Mailgun from 'mailgun.js'

const API_KEY = process.env.MAILGUN_API_KEY || ''
const DOMAIN = process.env.MAILGUN_DOMAIN ||''
    
    // const formData = require ('form-data')
    // const Mailgun = require ('mailgun.js')
export default async function handler(req, res) {
    console.log('Data', req.body);
    
    const {fname, lname,email,message, phone, reason, country} = req.body

    const mailgun = new Mailgun(FormData)
    const client = mailgun.client({username: 'api', key: API_KEY})

    const messageData = {
        from: 'ContactForm <contact@sandboxe67ac4f496fd4a0f8aa943d90feee9e0.mailgun.org>',
        to: 'elitelord3007@gmail.com',  
        subject: `${reason}`,
        text: `Hello,
        You have a new form entry from: ${fname} ${lname} ${email}
        
        ${message} 
        and their number is
        ${country} ${phone}`,
    }
    try{
    const emailRes = await client.messages
        .create(DOMAIN, messageData)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.error(err)
        })
    console.log(emailRes)
    } catch(err) {
        console.error("Error sending Email", err)
    }
    res.status(200).json({ submitted:true })
  }