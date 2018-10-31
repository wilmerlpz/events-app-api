import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: uuid.v1(),
      name: data.name,
      description: data.description,
      location:data.location,
      coordinates:data.coordinates, 
      status: data.status,
      category:data.category,
      country: data.country,
      state:data.state,
      city:data.city,
      attachment: data.attachment,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      updatedAt: Date.now(),
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
