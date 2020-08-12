import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'
// import * as lambda from '@aws-cdk/aws-lambda'
// import * as path from 'path'

export class NessApiCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'TestBucket', {
      versioned: true,
    })

    // new lambda.Function(this, 'NessAPIFunction', {
    //   runtime: lambda.Runtime.GO_1_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset(path.join('src', 'ness-api-handler'))
    // })
  }
}
