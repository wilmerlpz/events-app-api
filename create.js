import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  console.log("process.env.TableName: ", process.env.TableName);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      eventId: uuid.v1(),
      name: data.name,
      description: data.description,
      mainImage: data.attachment,
      city: data.city,
      state:  data.state,
      country:  data.country,
      status: data.status,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      updatedAt: Date.now(),
      location: data.location
    }
  };

  console.log(data);
  console.log("Params:", params);

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false,  TableName: process.env.TableName, errormsg: e }));
  }
}
