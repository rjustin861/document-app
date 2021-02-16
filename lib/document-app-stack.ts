import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { Networking } from './networking';

export class DocumentAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new Bucket(this, 'DocumentBucket', {
      encryption: BucketEncryption.S3_MANAGED
    });

    const networkingStack = new Networking(this, 'My Networking', {
      maxAzs: 2
    });
    cdk.Tags.of(networkingStack).add('Module', 'Networking');
  }
}
