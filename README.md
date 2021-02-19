# ReactContactLite

Under development!

A simple app based on React, NodeJS, ExpressJS and MongoDB. It's a rudimentary contact management system, functionally similar to my old Angular [ContactLite](https://github.com/rtthomas/ContactLite) project. That project was designed for deployment on Google App Engine. This one is targetted at AWS, utilizing the following technologies:

- EC2 Amazon Linux instance hosting NodeJS server
- MongoDB hosted on Atlas
- SES instance for email reception
- S3 single bucket to hold emails and attachments
- SNS instance to publish email notification for the server

## Functional Requirements

It is based on a data model representing the following entities:

- Company: an organization advertising directly for developers, or an employment agency or consulting firm
- Person: a contact at a Company
- Position: postings by a Company for a job
- Contact: A phone conversation or email with a Person concerning a Position
- Appointment: a time and date for meeting a Person from a Company

