# ReactContactLite

This is a learning/demonstration project based on a React/NodeJS/MongoDB stack hosted on an Amazon Web Services (AWS). The application stack comprises:

- React/Redux responsive client
- NodeJS/ExpressJS server
- MongoDB repository

The AWS services employed are:

- EC2 Linux instance hosting NodeJS server
- MongoDB hosted on Atlas
- Simple Email Service (SES) for email reception
- Simple Storage SService (S3) storage for received emails and attachments
- Simple Notification Service (SNS) to publish email notification for the server
- Route53

The full documentation is on the [Wiki](https://github.com/rtthomas/ReactContactLite/wiki).

## Functional Overview

ReactContactLite is a rudimentary contact management system supporting job search activities. The user can enter details for:

- ***Companies***
- ***Persons***, optionally affiliated with a Company
- ***Positions***, describing a job posting, including links to the original source
- ***Appointments*** 
- ***Encounters***, in the form of a phone conversation or email correspondence

The application can receive but not send email. The user can cc the application, or forward mail received on his or her own account. The application parses received emails, extracting and storing any attachments. The original email and Text, Word and PDF attachments can be viewed in the browser.

All the entities listed above, plus emails, can ve viewed in sortable tables

## Architecture

The NodeJS server runs on a single Amazon EC2 T2 Micro instance running Amazon Linux. The database is hosted on the MongoDB Atlas service. The diagram below illustrates how emails are received and managed.

![ReactcontactLite](https://user-images.githubusercontent.com/1623386/118016063-cb311080-b309-11eb-9c87-4c12711147cd.gif)




