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
    
    let fields = await parse(readableStream)
    if (fields.attachments){
        const rfc822 = extractRrfc822(fields.attachments)
        if (rfc822){
            // A forwarded message is sometimed delivered as 'message/rfc822' attachment. 
            // Parse the attachment and use it instead of the enclosing message
            fields.attachments = fields.attachments.length === 0 ? null : fields.attachments;
            readableStream = Readable.from(Buffer.from(rfc822).toString());
            fields = await parse(readableStream)
            return new Promise((resolve, reject) => {
                resolve(fields);
            })
        }
    }
    
    if (fields.text && fields.text.length > 0){
        // If the message text is a forwarded message, replace
        // the 'wrapper' email with one parsed from the text
        const pattern = /- Forwarded Message -/i
        let text = fields.text;
        let i =  (text.search(pattern));
        if (i >= 0){
            i += '- Forwarded Message -'.length;
            while (text.charAt(i) === '-') {
                i++;
            } 
            text = text.substring(i)
            fields = parseEmbeddedForward(text);
        }
    }  

    return new Promise((resolve, reject) => {
        resolve(fields);
    })
}

const parseEmbeddedForward = text => {
    const fieldsToFind = [
        {label: 'from:',    pattern: /(F|f)rom.+\n/,  convertAddresses: true}, 
        {label: 'to:',      pattern: /(T|t)o.+\n/,    convertAddresses: true}, 
        {label: 'cc:',      pattern: /(C|c)c.+\n/,    convertAddresses: true}, 
        {label: 'bcc:',     pattern: /(B|b)cc.+\n/,   convertAddresses: true},
        {label: 'date:',    pattern: /(D|d)ate.+\n/ } ,
        {label: 'subject:', pattern: /(S|s)ubject.+\n/ } 
    ]
    const fields = {};
    fieldsToFind.forEach( ({ label, pattern, convertAddresses }) => {
        let key;
        let lines = text.match(pattern);
        if (lines){
            const line = lines[0];
            const key = label.substring(0, label.length - 1)
            let value = line.substring(label.length).trim()
            if (convertAddresses){
                value = convertAddressString(value)
            }
            fields[key] = value;
            text = text.replace(line, '');
        }
    })
    fields.from = fields.from[0];
    fields.text = text.trim();
    fields.contentType = 'text/plain';
    return fields
}

const convertAddressString = s => {
    const addresses = s.split(',').map( address => {
        const parts = address.split('<');
        address = { 
            name: parts[0].length > 0 ? parts[0].trim() : null,
            address: parts[1].substring(0, parts[1].length - 1)
        }
        return address
    });
    return addresses;
}


const log = (title, text) => {
    console.log('************************************************************')
    console.log(title);
    console.log('************************************************************')
    console.log(text)
    console.log('************************************************************')
    console.log('************************************************************')
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
