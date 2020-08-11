#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NessApiCdkStack } from '../lib/ness-api-cdk-stack';

const app = new cdk.App();
new NessApiCdkStack(app, 'NessApiCdkStack');
