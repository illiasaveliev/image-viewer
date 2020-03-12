# Part 1 – Create Image Viewer API

1. Open Visual Studio

    ![alt text](1.png)

2. Select

    ![alt text](2.png)

3. Add an ability to upload multiple images. Add the following method to the S3ProxyController

    ```c#
        [HttpPost]
        public async Task Post(List<IFormFile> files)
        {
            foreach (var file in files)
            {
                var seekableStream = new MemoryStream();
                await file.CopyToAsync(seekableStream);
                seekableStream.Position = 0;

                var putRequest = new PutObjectRequest
                {
                    BucketName = this.BucketName,
                    Key = file.FileName,
                    InputStream = seekableStream
                };

                try
                {
                    var response = await this.S3Client.PutObjectAsync(putRequest);
                    Logger.LogInformation($"Uploaded object {file.FileName} to bucket {this.BucketName}. Request Id: {response.ResponseMetadata.RequestId}");
                }
                catch (AmazonS3Exception e)
                {
                    this.Response.StatusCode = (int)e.StatusCode;
                    var writer = new StreamWriter(this.Response.Body);
                    writer.Write(e.Message);
                }
            }
        }
    ```

4. Modify Get method to return image tags. Replace it with the code below

    ```c#
        [HttpGet]
        public async Task<JsonResult> Get()
        {
            var listResponse = await this.S3Client.ListObjectsV2Async(new ListObjectsV2Request
            {
                BucketName = this.BucketName
            });

            try
            {
                this.Response.ContentType = "text/json";
                List<ImageModel> images = new List<ImageModel>();
                foreach(var obj in listResponse.S3Objects)
                {
                    var getTagsResponse = await this.S3Client.GetObjectTaggingAsync(new GetObjectTaggingRequest
                    {
                        BucketName = this.BucketName,
                        Key = obj.Key
                    });
                    images.Add(new ImageModel
                    {
                        Key = obj.Key,
                        ETag = obj.ETag,
                        LastModified = obj.LastModified,
                        Size = obj.Size,
                        Tags = getTagsResponse.Tagging.Select(t => new ImageTag { Tag = t.Key, Value = t.Value })
                        .OrderByDescending(t => t.Value).ToList()
                    });
                }

                return new JsonResult(images, new JsonSerializerSettings { Formatting = Formatting.Indented,
                    ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }
            catch(AmazonS3Exception e)
            {
                this.Response.StatusCode = (int)e.StatusCode;
                return new JsonResult(e.Message);
            }
        }
    ```

5. Add ImageModel. Create a new file Models/ImageModel.cs

    ```c#
    public class ImageModel
    {
        public string Key { get; set; }
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public string ETag { get; set; }
        public List<ImageTag> Tags { get; set; }
    }

    public class ImageTag
    {
        public string Tag { get; set; }
        public string Value { get; set; }
    }
    ```

6. Add missing references

    ```c#
    using Microsoft.AspNetCore.Http;
    using ImageViewer.API.Models;
    using Newtonsoft.Json.Serialization;
    ```

7. Enter the S3 Bucket name (AppS3Bucket) into **appsettings.json** file.
8. Build the project. Check that it compiled without errors.
9. Publish

    ![alt text](3.png)

10. In the opened dialog enter Stack Name

    ![alt text](4.png)

11. Create a new S3 Bucket. Press New button and come up with a unique bucket name. This bucket will be used for deployments. It will store archive with compiled binaries and CloudFormation template.

    ![alt text](5.png)

12. Press Next button. In the new dialog enter the BucketName where images will be stored.

    ![alt text](6.png)

13. Double check the used profile, region and other settings and press **Publish**.
14. Check publish status. Wait for the **CREATE_COMPLETE** state.

    ![alt text](7.png)

15. Test that APIs are working.

    - Upload test image to S3. Open AWS Management Console and go to S3 service. 
    - Select the created bucket for images. Press upload and choose any image on your computer.
    - Look at the stack outputs in the Visual Studio and grab the created API’s url. Copy AWS Serverless URL value, add /api/s3proxy/ suffix to it and call. For example, <https://x8tvwsuzlj.execute-api.eu-west-1.amazonaws.com/Prod/api/s3proxy/>
    - The request should return the list of uploaded S3 Images.
