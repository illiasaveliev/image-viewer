# Deploy Compiled files

## Deploy API

1. Create bucket for source code **image-viewer-code**. Choose your bucket name and region

   ```bash
   aws s3api create-bucket --bucket image-viewer-code --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1
   ```

2. Copy file **ImageViewer.API.zip** with compiled API to **S3**. Note change bucket name to that you have created for code

    ```bash
    aws s3 cp ImageViewer.API.zip s3://image-viewer-code/
    ```

3. Deploy API using command. Change **ImageBucketName** where you will store images and **CodeBucketName** for bucket with source code

   ```bash
    aws cloudformation deploy --force-upload --no-fail-on-empty-changeset --stack-name 'image-viewer-api2' --template-file api.template --capabilities CAPABILITY_NAMED_IAM --parameter-overrides ImageBucketName="image-viewer-images" ShouldCreateBucket="true" CodeBucketName="image-viewer-code" CodeKey="ImageViewer.API.zip"
   ```

4. Go to [Part 1 – Configure CORS for S3](../../docs/part1/part.md#configure-cors-for-s3) section and perform futher steps

## Deploy Image Viewer Labeling function

1. Copy archive **ImageViewer.Labeling.zip** with compiled files to **S3**. Note change bucket name to that you have created

    ```bash
    aws s3 cp ImageViewer.Labeling.zip s3://image-viewer-code/
    ```

2. Deploy Labeling function using command. Change **BucketName** to that you have created for code

    ```bash
    aws cloudformation deploy --force-upload --no-fail-on-empty-changeset --stack-name 'image-viewer-labeling' --template-file labeling.yml --capabilities CAPABILITY_NAMED_IAM --parameter-overrides BucketName="image-viewer-code" CodeKey="ImageViewer.Labeling.zip"
    ```

3. Go to the [Part 4 – Configure S3 trigger](../../docs/part4/part.md#configure-s3-trigger) section and perform futher steps
