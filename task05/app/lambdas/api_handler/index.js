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

  const prId = event.principalId;
  console.log("~~~Principal ID From event~~~ ", prId);

  const requestBody = event.content;
  console.log("~~~Request Body(event.content)~~~ ", requestBody);

  const eventId = uuidv4();
  console.log("~~~UUID~~~ ", eventId);

  const createdAt = new Date().toISOString();
  console.log("~~~Created At~~~ ", createdAt);

  // console.log("~~~JSON parsed event content~~~",JSON.parse(event.content));
  // console.log("~~~JSON parsed event content typeof~~~", typeof JSON.parse(event.content));
  // console.log("~~~JSON parsed id~~~",JSON.parse(event).principalId);
  // console.log("~~~JSON parsed id typeof~~~",typeof JSON.parse(event).principalId);

  // console.log("~~~JSON stringified event content~~~",JSON.stringify(event.content));
  // console.log("~~~JSON stringified event content typeof~~~", typeof JSON.stringify(event.content));
  // console.log("~~~JSON stringified id~~~",JSON.stringify(event).principalId);
  // console.log("~~~JSON stringified id typeof~~~",typeof JSON.stringify(event).principalId);

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
    const requestBody = JSON.parse(event.body);
    console.log("~~~EVENT in try~~~ ", event);
    console.log("~~~Request Body in try~~~ ", requestBody);

    console.log("~~~Data~~~", data);

    const res = JSON.stringify({
      statusCode: 201,
      event: {
        id: eventId,
        principalId: requestBody.principalId,
        createdAt: createdAt,
        body: requestBody.content,
      },
    });

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

// Expected: {\"statusCode\": 201, \"event\": {\"id\": \"UUID v4\", \"principalId\": \"int\", \"createdAt\": \"date time in ISO 8601 formatted string(2024-01-01T00:00:00.000Z|2024-01-01T00:00:00.000000)\", \"body\": \"any map '{' content '}'\"}};
// Actual:   {\"statusCode\": 201, \"event\": {\"id\": \"27b7b8eb-6d5a-454b-97cf-e4d090e8d993\",\"principalId\":10,\"createdAt\":\"2024-08-09T11:57:40.963Z\",\"body\":{\"param1\":\"value1\",\"param2\":\"value2\"}}}"
