#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DocumentAppStack } from '../lib/document-app-stack';

const app = new cdk.App();
const stack = new DocumentAppStack(app, 'DocumentAppStack');

cdk.Tags.of(stack).add('App', 'DocumentManagement');
cdk.Tags.of(stack).add('Environment', 'Development');
