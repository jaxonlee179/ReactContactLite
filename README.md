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

The full documentation is on the [Wiki](https://github.com/rtthomas/ReactContactLite/wiki). 



