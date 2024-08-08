// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import AWS from "aws-sdk";

import { v4 as uuidv4 } from "uuid";

// const client = new DynamoDBClient({});
// const docClient = new AWS.DynamoDB.DocumentClient()
const docClient = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log("~~~EVENT~~~ ", event);
  console.log("~~~EVENT BODY~~~ ", event.body);

  const requestBody = JSON.parse(event.body);
  console.log("~~~Request Body~~~ ", requestBody);

  const eventId = uuidv4();
  console.log("~~~Event ID~~~ ", eventId);

  const createdAt = new Date().toISOString();
  console.log("~~~Date~~~ ", createdAt);

  const params = {
    TableName: "Events",
    Item: {
      id: eventId,
      principalId: requestBody.principalId,
      createdAt: createdAt,
      body: requestBody.content,
    },
  };

  try {
    const data = await docClient.put(params).promise();

    const res = {
      statusCode: 201,
      body: JSON.stringify({
        event: {
          id: eventId,
          principalId: requestBody.principalId,
          createdAt: createdAt,
          body: requestBody.content,
        },
      }),
    };

    console.log("~~~Res~~~ ", res);
    return res;
  } catch (error) {
    console.log("~~~Error~~~ ", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Could not save event to DynamoDB" }),
    };
  }
};
