import * as cdk from '@aws-cdk/core';
import { Vpc, IVpc, SubnetType } from '@aws-cdk/aws-ec2';

interface NetworkingProps {
  maxAzs: number;
}

export class Networking extends cdk.Construct {
  public readonly myVpc: IVpc;

  constructor(scope: cdk.Construct, id: string, props: NetworkingProps) {
    super(scope, id);

    this.myVpc = new Vpc(this, 'My VPC', {
      cidr: '10.0.0.0/16',
      maxAzs: props.maxAzs,
      subnetConfiguration: [
        {
          name: 'Public Subnet',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private Subnet',
          subnetType: SubnetType.PRIVATE,
          cidrMask: 24
        }
      ]
    });
  }
}
