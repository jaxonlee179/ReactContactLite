/*
* Methods for parsing the SNS notifications and emails
*/
const MailParser = require("mailparser-mit").MailParser;
const { Readable } = require('stream');

/**
 * Parses an email to extract required fields
 * @param {Stream} readableStream stream from which to read entire email text
 * @return {Object} fields {subject, from, to date, contentType, attachments}
 */
const parseEmail = async (readableStream) => {
    
    const email = await parse(readableStream)
    if (email.attachments){
        const rfc822 = extractRrfc822(email.attachments)
        if (rfc822){
            // A forwarded message is sometimed delivered as 'message/rfc822' attachment. 
            // Parse the attachment and use its text instead of that of the enclosing message
            email.attachments = email.attachments.length === 0 ? null : email.attachments;
            readableStream = Readable.from(Buffer.from(rfc822).toString());
            const attachedEmail = await parse(readableStream);
            email.text = attachedEmail.text;
            return new Promise((resolve, reject) => {
                resolve(email);
            })
        }
    }

    return new Promise((resolve, reject) => {
        resolve(email);
    })
}

const extractRrfc822 = attachments => {
    const i = attachments.findIndex(attachment => attachment.contentType === 'message/rfc822');
    if (i >= 0){
        // A forwarded message is sometimed delivered as 'message/rfc822' attachment. 
        // Parse the attachment and use its text instead of that of the enclosing message
        rfc822 = attachments[i];
        delete attachments[i];
        attachments = attachments.filter(attachment => attachment != null);
        return rfc822
    }
    return null
}

/**
 * Parses the email 
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
                from: parsed.from[0],
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
 * Creates a string from the stream
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
