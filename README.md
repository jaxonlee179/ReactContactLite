# ReactContactLite

ReactContactLite is a learning/demonstration project based on a React/NodeJS/MongoDB stack hosted on an AWS. It implements a rudimentary contact management system, functionally similar to my old Angular [ContactLite](https://github.com/rtthomas/ContactLite) project deployed on Google App Engine. 

The ReactContactLite application stack comprises:

- React/Redux front end
- NodeJS/ExpressJS server
- MongoDB repository

The AWS services employed are:

- EC2 Linux instance hosting NodeJS server
- MongoDB hosted on Atlas
- Simple Email Service (SES) for email reception
- S3 storage for received emails and attachments
- Simple Notofocation Service (SNS) to publish email notification for the server
- Route53

The full documentation is on the [Wiki](https://github.com/rtthomas/ReactContactLite/wiki). 



