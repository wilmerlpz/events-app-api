import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'eventId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET #name = :name, mainImage = :mainImage, description = :description, #location = :location, modifiedAt = :modifiedAt, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":name": data.name ? data.name : null,
      ":mainImage": data.attachment ? data.attachment : null,
      ":description": data.description ? data.description : null,
      ":location": data.location ? data.location : null,
      ":modifiedAt": Date.now(),
      ":updatedAt": Date.now()
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#location": "location"
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false,  TableName: process.env.TableName, errormsg: e }));
  }
}
