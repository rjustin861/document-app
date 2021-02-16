import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as DocumentApp from '../lib/document-app-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new DocumentApp.DocumentAppStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
