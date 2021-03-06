import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { Cors } from '@aws-cdk/aws-apigateway';

export class NessApiCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const threadTable = ThreadTable(this, "threadTable")
    const userTable = UserTable(this, "userTable")

    const handler = new lambda.Function(this, 'NessAPIFunction', {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'ness-api-function',
      code: lambda.Code.fromAsset('./appbin/ness-api-function.zip'),
      environment: {
        "FCM_CREDENTIALS_JSON_BASE64": process.env.FCM_CREDENTIALS_JSON_BASE64 || '',
      }
    })

    new apigateway.LambdaRestApi(this, 'api', {
      handler: handler,
      restApiName: 'ness-api',
      defaultMethodOptions: {
        requestParameters: {
          'method.request.header.Cookie': false,
        }
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['http://localhost:8080'],
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      }
    })

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
