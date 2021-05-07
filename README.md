# ReactContactLite

ReactContactLite is a learning/demonstration project based on a React/NodeJS/MongoDB stack hosted on an AWS EC2 Linux server, with features relying other AWS services including S3, SES and SNS. It implements a rudimentary contact management system, functionally similar to my old Angular [ContactLite](https://github.com/rtthomas/ContactLite) project deployed on Google App Engine. 

The ReactContactLite application stack comprises:

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



