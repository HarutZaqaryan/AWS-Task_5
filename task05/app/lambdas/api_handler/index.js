// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// const client = new DynamoDBClient({});
// const docClient = new AWS.DynamoDB.DocumentClient()

import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.target_table || "Events";
console.log("~~~TableName~~~ ", tableName);

export const handler = async (event) => {
  console.log("~~~EVENT~~~ ", event);
  console.log("~~~EVENT BODY~~~ ", event.body);

  const requestBody = JSON.parse(event.body);
  console.log("~~~Request Body~~~ ", requestBody);

  console.log("~~~JSON Stringified~~~",JSON.stringify(requestBody));
  

  const eventId = uuidv4();
  console.log("~~~Event ID~~~ ", eventId);

  const createdAt = new Date().toISOString();
  console.log("~~~Date~~~ ", createdAt);

  const params = {
    TableName: tableName,
    Item: {
      id: eventId,
      principalId: requestBody.principalId,
      createdAt: createdAt,
      body: requestBody.content,
    },
  };

  try {
    const data = await docClient.put(params).promise();

    console.log("~~~Data~~~",data)

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
