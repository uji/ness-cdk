import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NessApiCdk from '../lib/ness-api-cdk-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NessApiCdk.NessApiCdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
