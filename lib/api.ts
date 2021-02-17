import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import { Runtime } from '@aws-cdk/aws-lambda';
import { IBucket } from '@aws-cdk/aws-s3';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { HttpApi, HttpMethod, IHttpApi } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

interface DocumentManagementAPIProps {
  bucket: IBucket;
}

export class DocumentManagementAPI extends cdk.Construct {
  public readonly httpApi: HttpApi;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: DocumentManagementAPIProps
  ) {
    super(scope, id);
    const getDocumentsFunction = new NodejsFunction(this, 'Get Documents API', {
      entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
      handler: 'getDocuments',
      runtime: Runtime.NODEJS_12_X,
      bundling: {
        externalModules: ['aws-sdk']
      },
      environment: {
        DOCUMENT_BUCKET_NAME: props.bucket.bucketName
      }
    });

    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(props.bucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');
    getDocumentsFunction.addToRolePolicy(bucketContainerPermissions);

    const bucketPermission = new PolicyStatement();
    bucketPermission.addResources(`${props.bucket.bucketArn}/*`);
    bucketPermission.addActions('s3:GetObject', 's3:PutObject');
    getDocumentsFunction.addToRolePolicy(bucketPermission);

    this.httpApi = new HttpApi(this, 'My API', {
      apiName: 'Document Management API',
      createDefaultStage: true,
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [HttpMethod.GET],
        maxAge: cdk.Duration.days(10)
      }
    });

    const lambdaProxyIntegration = new LambdaProxyIntegration({
      handler: getDocumentsFunction
    });

    this.httpApi.addRoutes({
      path: '/getDocuments',
      methods: [HttpMethod.GET],
      integration: lambdaProxyIntegration
    });

    //Output
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: this.httpApi.url!,
      exportName: 'APIEndpoint'
    });
  }
}
