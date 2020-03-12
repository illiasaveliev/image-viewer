# Part 3 – Deploy Image Viewer Web application

1. Open command line in the web-app folder.
2. Prepare infrastructure for web application using the next command. It will create S3 Bucket where web site files will be stored and a CloudFront distribution to open web site to the world.

    ~~~bash
    aws cloudformation deploy --force-upload --no-fail-on-empty-changeset --stack-name "image-viewer-web-app" --template-file deploy.yml
    ~~~

3. Open the AWS Console, go to the CloudFormation service. Wait until image-viewer-web-app stack will be in completed state.
4. Examine outputs tab. Check the created CloudFront URL.
5. Open web-app\src\environments\environment.prod.ts file
6. Configure web application
    - serverUrl - the newly created Image Viewer API, for example, <https://x8tvwsuzlj.execute-api.eu-west-1.amazonaws.com/Prod/api/s3proxy/>
    - authUrl –  go to Cognito User Pool and get Domain URL plus add oauth2/ suffix. For example <https://test-image.auth.eu-west-1.amazoncognito.com/oauth2/>
    - clientId – go to Cognito User Pool-> App clients and get App client id
    - clientSecret - go to Cognito User Pool-> App clients and get App client secret
    - redirectUrl – put <https://d11slzr9srg2n2.cloudfront.net/auth/callback/>
7. Install all required dependencies: npm install
8. Build project using npm run build:prod command
9. Deploy compiled files to S3 using the next command

    ~~~bash
    aws s3 sync --cache-control 'no-cache' dist/ s3://image-viewer-web-app/Deploy/build
    ~~~

10. Go to the Cognito User Pool and configure App client settings. Add an additional Callback URL(s) after comma (,): <https://d11slzr9srg2n2.cloudfront.net/auth/callback/>

## Configure CORS to Image Viewer API

1. Open ImageViewer.Api project in the VisualStudio
2. Add the following lines to the appsettings.json file

    ~~~json
    "WebappRedirectUrl": "http://localhost:4200",
    "AdditionalCorsOrigins": " https://d11slzr9srg2n2.cloudfront.net"
    ~~~

3. Change AdditionalCorsOrigins to the create CloudFront URL
4. Open Startup file and add CORS configuration
    - Add private const

        ~~~c#
        private const string CorsPolicyName = "CorsPolicy";
        ~~~

    - In the ConfigureServices method add a few lines

        ~~~c#
        string[] corsOrigins = {
            Configuration.GetSection("WebappRedirectUrl").Value,
            Configuration.GetSection("AdditionalCorsOrigins").Value,
        };
        services.AddCors(options =>
        {
            options.AddPolicy(
                CorsPolicyName,
                builder => builder.WithOrigins(corsOrigins.Where(co => !stringIsNullOrEmpty(co)).ToArray())
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithExposedHeaders("Content-Disposition"));
        });
        ~~~

    - In the Configure method

        ~~~c#
        app.UseCors(CorsPolicyName);
        ~~~

5. Publish the new version of the API.

## Configure CORS for API Gateway

1. Go API Gateway, select Models and create an Empty model.

     ![alt text](1.png)

2. Go to Resources. Select {proxy+} method, then expand Actions dropdown and press Enable CORS.

     ![alt text](2.png)

3. Leave everything by default and press Enable CORS

     ![alt text](3.png)

4. Confirm

     ![alt text](4.png)

5. Open Actions dropdown and Deploy API.

## Access to Web application

Use real email to Sign up into the application. You need real email in order to enter verification code during the sign-up process. Or create a test user in the Cognito user pool following instructions from the point number 19

1. Open CloudFront URL in the browser. Enter any email\password combination and press Login, then you will be redirected to the Cognito login page.

1. Sign-up with real email

     ![alt text](5.png)

2. Create a test user

    - Open Image Viewer Cognito User pool
    - Select Users and groups tab
    - Press Create user button
    - Fill the form and press Create user

     ![alt text](6.png)

3. Sign in with a new user

     ![alt text](7.png)

4. Change password if needed.

5. Check that Image Viewer application works. Try to upload new images.
