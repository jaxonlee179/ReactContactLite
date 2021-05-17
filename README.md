# ReactContactLite

This is a learning/demonstration project based on a React/NodeJS/MongoDB stack hosted on an Amazon Web Services (AWS). The application stack comprises:

- React/Redux responsive client
- NodeJS/ExpressJS server
- MongoDB repository

The AWS services employed are:

- EC2 Linux instance hosting NodeJS server
- MongoDB hosted on Atlas
- Simple Email Service (SES) for email reception
- Simple Storage Service (S3) storage for received emails and attachments
- Simple Notification Service (SNS) to publish email notification for the server
- Route53

## Functional Overview

ReactContactLite is a rudimentary contact management system supporting job search activities. The user can enter details for the following entity types:

- ***Companies***
- ***Persons***, optionally affiliated with a Company
- ***Positions***, describing a job posting by a Company, including links to the original source
- ***Appointments*** scheduled with a Person about a Position
- ***Encounters*** with a Person, in the form of a phone conversation or email correspondence

The application can receive but not send email. The user can cc the application, or forward mail received on his or her own account. The application parses received emails, extracting and storing any attachments. The original email and Text, Word and PDF attachments can be viewed in the browser.

All the entities listed above can be viewed in sortable tables, and selected for editing.

Access to the home page is restricted by a login dialog requiring a password configured during installation. 

## Architecture

The NodeJS server runs on a single Amazon EC2 T2 Micro instance running Amazon Linux. The database is hosted on the MongoDB Atlas service. The diagram below illustrates how emails are received and managed.

![](https://github.com/rtthomas/ReactContactLite/blob/master/documents/ReactcontactLite.gif)

## Server Design

The server implements a REST API for the five entity types defined previously, all of which are defined by the user, and for ***Email*** entities. 

Upon receipt of an Email Receipt Notification from the SNS service, the server retrieves the email from the S3 service. It then parses the email to identify headers and attachments. If an email is forwarded (i.e. not sent directly as Cc or Bcc,) the original is extracted by a second parsing phase. The Email entity is stored in the database. Extracted attachments are stored in the same S3 bucket as the original email object.

The following diagram illustrates the entity relationships. Note that Attachments are not independent entities; they exist as an array of objects within an Email entity, and reference the attachment document stored in S3. Entity structure is defined using Mongoose Schema.

![](https://github.com/rtthomas/ReactContactLite/blob/master/documents/Entity-Relationship.gif)

## Client Design

The client is coded using "classic" React, i.e. it does not employ the hooks patterns. At startup it retrieves all entities from the server.

For each entity type, a source folder named for the type ("companies", etc.) contains the following files:
- `<Entity>List.js` displays a sortable table of all the entities
- `<Entity>.js` displays a modal popup for creating or editing an entity
- `<EntityACtions>.js` defines Redux asynchronous action constants an asynchronous `save<Entity>` action method for sending new or edited entities to the server
- `<Entity>Reducer.js` defines the Redux store for the entity type, containing an array of all the entities, and a map of the entities keyed on the entity's MongoDB ObjectId (key) field

## Configuration and Deployment


