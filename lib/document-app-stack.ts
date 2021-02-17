import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { Networking } from './networking';
import { DocumentManagementAPI } from './api';
import * as path from 'path';

export class DocumentAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new Bucket(this, 'DocumentBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    new BucketDeployment(this, 'Bucket Deployment', {
      sources: [Source.asset(path.join(__dirname, '..', 'documents'))],
      destinationBucket: bucket,
      memoryLimit: 512
    });

    const networkingStack = new Networking(this, 'My Networking', {
      maxAzs: 2
    });
    cdk.Tags.of(networkingStack).add('Module', 'Networking');

    const apiStack = new DocumentManagementAPI(this, 'My API', { bucket });
    cdk.Tags.of(apiStack).add('Module', 'API');
  }
}
