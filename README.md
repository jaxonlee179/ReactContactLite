# ReactContactLite

ReactContactLite is a rudimentary contact management system, functionally similar to my old Angular [ContactLite](https://github.com/rtthomas/ContactLite) project. That project was designed for deployment on Google App Engine. This one is designed for deployment on AWS. The application stack comprises:

- React/Redux front end
- NodeJS/ExpressJS server
- MongoDB repository

The AWS services employed are:

- EC2 Amazon Linux hosting NodeJS server
- MongoDB hosted on Atlas
- SES for email reception
- S3 to store received emails and attachments
- SNS to publish email notification for the server
- Route53

## Functional Requirements

The ReactContactLite application allows the user to:

- define Company: an organization advertising directly for developers, or an employment agency or consulting firm
- Person: a contact at a Company
- Position: postings by a Company for a job
- Contact: A phone conversation or email with a Person concerning a Position
- Appointment: a time and date for meeting a Person from a Company

