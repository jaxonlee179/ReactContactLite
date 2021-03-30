const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// rference: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples-sending-email.html
const REGION = "us-west-2";

/**
 * Sends a message comprising a single sender, single receiver, subject and text body
 */
exports.sendSimple = async (from, to, subject, text) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: "<Insert the here>",
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Confirmation",
            }
        },
        Source: from 
    }; 
        
    const ses = new SESClient({ region: REGION });
    await ses.send(new SendEmailCommand(params));
}


