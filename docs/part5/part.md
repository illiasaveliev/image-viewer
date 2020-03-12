# Part 5 – Clean-up resources

With a help of **CloudFormation** we can clean all the created resources within a few minutes.

1. Open **AWS Console**
2. Go to the **CloudFormation** service
3. Delete all created stacks
    - **image-viwer-api**
    - **image-viewer-web-app**
    - **image-viewer-labeling-function**
4. Go to the **Cognito User Pools** and delete **image-cognito-pool**
5. Go to the **S3** and check that all test buckets were removed.
