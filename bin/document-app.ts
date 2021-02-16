#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DocumentAppStack } from '../lib/document-app-stack';

const app = new cdk.App();
new DocumentAppStack(app, 'DocumentAppStack');
