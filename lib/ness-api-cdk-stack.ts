import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb';

export class NessApiCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const threadTable = ThreadTable(this, "threadTable")
    const userTable = UserTable(this, "userTable")

    const handler = new lambda.Function(this, 'NessAPIFunction', {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'main',
      code: lambda.Code.fromAsset('./appbin/ness-api-function'),
      environment: {
        // "DB_ENDPOINT": process.env.DB_ENDPOINT || "http://localhost:8000",
        // "FCM_CREDENTIALS_JSON_BASE64": process.env.FCM_CREDENTIALS_JSON_BASE64 || "",
        "DB_ENDPOINT": "http://localhost:8000",
        "FCM_CREDENTIALS_JSON_BASE64": "",
        // "AWS_REGION": process.env.AWS_DEFAULT_REGION || "",
        // "AWS_ACCESS_KEY_ID": "dammy",
        // "AWS_SECRET_ACCESS_KEY": "dammy",
      }
    })
    const lambdaIntegration = new apigateway.LambdaIntegration(handler)

    const gateway = new apigateway.RestApi(this, "nessAPIGateway", {
      restApiName: "nessAPI",
    })
    const queryResource = gateway.root.addResource("query", {
      defaultCorsPreflightOptions: {
        statusCode: 200,
        allowCredentials: true,
        allowOrigins: ["http://localhost:8080"],
        allowHeaders: ["*"],
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      defaultIntegration: lambdaIntegration,
    })
    queryResource.addMethod("post")

    threadTable.grantReadWriteData(handler)
    userTable.grantReadWriteData(handler)
  }
}

function ThreadTable(scope: cdk.Construct, name: string) {
  const table = new dynamodb.Table(scope, name, {
    tableName: "Thread",
    partitionKey: {
      name: "PK",
      type: AttributeType.STRING,
    },
    sortKey: {
      name: "SK",
      type: AttributeType.STRING,
    },
  })
  table.addLocalSecondaryIndex({
    indexName: "PK-CreatedAt-index",
    sortKey: {
      name: "CreatedAt",
      type: AttributeType.STRING,
    }
  })
  table.addLocalSecondaryIndex({
    indexName: "PK-Closed-index",
    sortKey: {
      name: "Closed",
      type: AttributeType.STRING,
    }
  })
  return table
}

function UserTable(scope: cdk.Construct, id: string) {
  const table = new dynamodb.Table(scope, id, {
    tableName: "User",
    partitionKey: {
      name: "PK",
      type: AttributeType.STRING,
    },
    sortKey: {
      name: "SK",
      type: AttributeType.STRING,
    },
  })
  table.addLocalSecondaryIndex({
    indexName: "PK-Name-index",
    sortKey: {
      name: "Name",
      type: AttributeType.STRING,
    }
  })
  table.addLocalSecondaryIndex({
    indexName: "PK-CreatedAt-index",
    sortKey: {
      name: "CreatedAt",
      type: AttributeType.STRING,
    }
  })
  return table
}
