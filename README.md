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

The following diagram illustrates the entity relationships. Entity structures are defined using Mongoose Schema.

![](https://github.com/rtthomas/ReactContactLite/blob/master/documents/Entity-Relationship.gif)

Note that
- Attachments are not independent entities; they exist as an array of objects within an Email entity, and reference the attachment document stored in S3.
- Entity relationships are not enforced, such that e.g. an Appointment can be defined without specifying Company, Person or Position. This allows the user to specify details in a later edit  

## Client Design

The client is coded using "classic" React, i.e. it does not employ the hooks patterns. 

At startup the client prompts for an application password, simultaneously fetching all entities from the server. Upon password acceptance, if the entity retrieval is not finished, an activity spinner is displayed.

For each entity type, a source folder named for the type ("companies", etc.) contains the following files:
- `<Entity>List.js` displays a sortable table of all the entities
- `<Entity>.js` displays a modal popup for creating or editing an entity
- `<EntityACtions>.js` defines Redux asynchronous action constants an asynchronous `save<Entity>` action method for sending new or edited entities to the server
- `<Entity>Reducer.js` defines the Redux store for the entity type, containing an array of all the entities, and a map of the entities keyed on the entity's MongoDB ObjectId (key) field

Responsive behaviour of the entity table and entity popup components is implemented using the React styled-components package. The small form (<768 px) behavious of each is implemented in:
- `ResponsiveTable.js` switches from the column header and rows form to one where each entity is displayed one field label and value per row; in this display the table is not sortable
- `ResponsiveFoirm.js` switches from displaying the field labels to the left of the values to displaying them above the fields

## Configuration and Deployment

REMAINING SECTIONS UNDER CONSTRUCTION!!

At this time the project does not include any CI/CD capabilities. Below are the steps necessary to configure and deploy the application, assuming an AWS subscription has already been created.

1. On the [AWS IAM Service](https://console.aws.amazon.com/iam/home?region=us-west-2#/home) page create an AWS IAM account for accessing the Mongo database. Create an access key for it, note the account's Amazon Resource Name (ARN) and download the account credentials file containing the User name, Access Key ID and Secret access key.
2. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a database configured for AWS IAM access, specifying the ARN from Step 1.
3. On the AWS EC2 Service page, create an EC2 instance. It must be created in one of the regions which allows incoming smtp email, such as [us-east-1 (Oregon)](us-east-1) A T2 Micro instance should suffice.
4. Log into the instance and install NodeJS, as described [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html)
5. Clone this repository, proceed to the *client* folder, and excute the command `npm run build`
6. On the [AWS S3 Service page](https://s3.console.aws.amazon.com/s3/home) create a bucket to hold incoming emails.
7. On the [AWS Route53 Service page](https://console.aws.amazon.com/route53/home#DomainListing:), register a domain for the application 

#### Configuration Data

Item | Location | Description | Applied In 
--- | --- | --- | ---
CL_MONGODB_KEY_ID | env | * | NodeJS server
CL_MONGODB_ACCESS_KEY | env | * | NodeJS server
CL_MONGODB_PATH | env | * | NodeJS server
CL_EMAIL_BUCKET_NAME | env | * | *
CL_EMAIL_ATTACHMENT_PREFIX | env | * | *
CL_PORT | * | * | *
| * | * | *
| * | * | *
