// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// const client = new DynamoDBClient({});
// const docClient = new AWS.DynamoDB.DocumentClient()

//

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// const client = new DynamoDBClient({});
// const docClient = new AWS.DynamoDB.DocumentClient()

// import AWS from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

// const docClient = new AWS.DynamoDB.DocumentClient();
// const tableName = process.env.target_table || "Events";
// console.log("~~~TableName~~~ ", tableName);

// export const handler = async (event) => {
//   console.log("~~~EVENT~~~ ", event);
//   console.log("~~~EVENT BODY~~~ ", event.body);

//   const requestBody = JSON.parse(event.body);
//   console.log("~~~Request Body~~~ ", requestBody);

//   const eventId = uuidv4();
//   console.log("~~~Event ID~~~ ", eventId);

//   const createdAt = new Date().toISOString();
//   console.log("~~~Date~~~ ", createdAt);

//   const params = {
//     TableName: tableName,
//     Item: {
//       id: eventId,
//       principalId: requestBody.principalId,
//       createdAt: createdAt,
//       body: requestBody.content,
//     },
//   };

//   try {
//     const data = await docClient.put(params).promise();

//     const res = JSON.stringify({
//       statusCode: 201,
//       event: {
//         id: eventId,
//         principalId: requestBody.principalId,
//         createdAt: createdAt,
//         body: requestBody.content,
//       },
//     });
//     console.log("~~~Res~~~ ", res);
//     return res;
//   } catch (error) {
//     console.log("~~~Error~~~ ", error);

//     return JSON.stringify({
//       statusCode: 500,
//       message: "Could not save event to DynamoDB",
//     });
//   }
// };

import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.target_table || "Events";
console.log("~~~TableName~~~ ", tableName);
console.log("~~~TableName from env~~~ ", process.env.target_table);

export const handler = async (event) => {
  console.log("~~~EVENT~~~ ", event);
  console.log("~~~Event Type~~~", typeof event);


  // console.log("~~~Event Body~~~", event.body);
  // console.log("~~~Event Body Type~~~", typeof event.body);

  // const eBodyParsed = JSON.parse(event.body);
  // console.log("~~~eBodyParsed~~~", eBodyParsed);
  // console.log("~~~eBodyParsed type~~~", typeof eBodyParsed);

  // !
  // const validJson = JSON.parse(event.body.replace(/\\r\\n|\r\n|\n/g, ''));
  // console.log("~~~Valid Json",validJson);
  // console.log("~~~Valid Json",typeof validJson);
  

  const prId = event.principalId;
  console.log("~~~Principal ID From event~~~ ", prId);

  // !
  // const prId = validJson.principalId;
  // console.log("~~~Principal ID From event~~~ ", prId);

  const requestBody = event.content;
  console.log("~~~Request Body(event.content)~~~ ", requestBody);
  
  // !
  // const requestBody = validJson.content;
  // console.log("~~~Request Body(event.content)~~~ ", requestBody);

  const eventId = uuidv4();
  console.log("~~~UUID~~~ ", eventId);

  const createdAt = new Date().toISOString();
  console.log("~~~Created At~~~ ", createdAt);

  const params = {
    TableName: tableName,
    Item: {
      id: eventId,
      principalId: event.principalId,
      createdAt: createdAt,
      body: event.content,
    },
  };

  console.log("~~~Params~~~", params);

  try {
    const data = await docClient.put(params).promise();
    console.log("~~~EVENT in try~~~ ", event);
    console.log("~~~typeof EVENT in try~~~ ", typeof event);
    console.log("~~~typeof EVENT.CONTENT in try~~~ ", typeof event.content);
   

    const res = {
      statusCode: 201,
      event: {
        id: eventId,
        principalId: event.principalId,
        createdAt: createdAt,
        body: event.content,
      },
    };

    console.log("~~~Res~~~ ", res);
    return res;
  } catch (error) {
    console.log("~~~Error~~~ ", error);

    return JSON.stringify({
      statusCode: 500,
      message: "Could not save event to DynamoDB",
    });
  }
};
