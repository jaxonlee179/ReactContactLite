/*
* Methods for parsing the SNS notifications and emails
*/
const MailParser = require("mailparser-mit").MailParser;
const { Readable } = require('stream');

const parseEmail = async (readableStream) => {
    const email = await parse(readableStream)
    
    email.attachments.forEach( async attachment => {
        console.log('---------------------------------------------------------------')
        if (attachment.contentType === 'message/rfc822'){
            // This will become the text
            readableStream = Readable.from(Buffer.from(attachment.content).toString());
            const attachedEmail = await parse(readableStream);
            email.text = attachedEmail.text;
        }
    })
}
/**
 * Parses the email text and returns
 * @param readableStream a readable Stream
 */
const parse = async (readableStream) => {
        
    // Read the string 
    const email = await streamToString(readableStream)
    return new Promise((resolve, reject) => {
        const mailparser = new MailParser();
     
        // Set up event listener for end of parsing
        mailparser.on("end", function(parsed){
            // Return only the items of interest
            parsed = {
                text: parsed.text,
                contentType: parsed.headers['content-type'],
                subject: parsed.subject,
                from: parsed.from,
                to: parsed.to,
                date: parsed.date,
                attachments: parsed.attachments
            }
            resolve(parsed)
        });
        // Send the email to the parser
        mailparser.write(email);
        mailparser.end();
    })
}    

/**
 * Converts the response.Body object from Node 
 */
const streamToString = async (stream) => {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}

module.exports = parseEmail
