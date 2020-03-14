# Deploy Compiled files

## Deploy API

1. Create bucket for source code **image-viewer-code**

   ```bash
   aws s3api create-bucket --bucket my-bucket-454 --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1
   ```

2. Extract **ImageViewer.API.zip**
3. Change Bucket name for images in the settings in the **appsettings.json** file
4. Create new **ImageViewer.API.zip** archive with updated settings
5. Copy file to **S3**. Note change bucket name to that you have created

    ```bash
    aws s3 cp ImageViewer.API.zip s3://image-viewer-code/
    ```

6. Open **api.template** file and change bucket name with source code in the next line

    ```json
    "CodeUri": "s3://image-viewer-code/ImageViewer.API.zip",
    ```

7. Deploy API using command. Change BucketName

   ```bash
    aws cloudformation deploy --force-upload --no-fail-on-empty-changeset --stack-name 'image-viewer-api' --template-file api.template --capabilities CAPABILITY_NAMED_IAM --parameter-overrides BucketName="image-viewer-images333" ShouldCreateBucket="true"
   ```
