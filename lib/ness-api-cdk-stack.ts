import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

export class NessApiCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = "testBucket"
    const bucket = new s3.Bucket(this, bucketName )

    const handler = new lambda.Function(this, 'NessAPIFunction', {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./src/ness-function'),
      environment: {
        BUCKET: bucketName,
      }
    })

    bucket.grantReadWrite(handler)

    const api = new apigateway.RestApi(this, "testGateway", {
      restApiName: "testAPI",
    })
    const nessIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", nessIntegration);
  }
}
