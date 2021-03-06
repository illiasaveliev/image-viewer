# Part 4 – Add Image Viewer labeling function

## Create Image Viewer labeling function

1. Open **Visual Studio** and create a new project

     ![alt text](1.png)

2. Choose **AWS Lambda Project with Tests**

     ![alt text](2.png)

3. Build project and check that build has no errors

## Deploy Image Viewer labeling function

1. Open **Publish to AWS Lambda...** dialog

     ![alt text](3.png)

2. Enter **Function Name** **image-viewer-labeling** and press **Next**

     ![alt text](4.png)

3. Choose a new role base on **AWSLambdaFullAccess** policy and press **Upload**

## Configure S3 Trigger

1. Open **AWS Console** and go to the **Lambda** service.
2. Select **image-viewer-labeling** lambda function.
3. Press **Add Trigger** button.
4. Select **S3** and fill required parameters, then press **Add**
    - **Bucket** – select bucket with images
    - **Event type** – All object create events

     ![alt text](5.png)

## Add permissions to call AWS Rekognition service

1. Select **Configuration** part and then **Permissions** tab. In the **Execution Role** section press on role name and go to the IAM console.

     ![alt text](6.png)

2. Add a new policy to it, press **Attach policies**

     ![alt text](7.png)

3. Select **AmazonRekognitionFullAccess**

     ![alt text](8.png)

4. Press **Attach** policy

5. Use the same steps to attach **AmazonS3FullAccess** policy

6. Use the same steps to attach **AWSLambdaBasicExecutionRole** policy

7. Try to label new images.
    - Open the **Image Viewer** web site and upload new image.
    - Find new image in the table and examine created tags for it. It may take some time so use a **Refresh** button to update table

**Congrats!** You have completed the workshop! Do not forget to remove created resources. Follow instructions from the [Part 5 – Clean-up resources](../part5/part.md) section.
