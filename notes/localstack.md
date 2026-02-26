# localstack
## Configuration with AWS CLI 
To use the aws CLI with LocalStack, you must configure it to point to your local instance (usually http://localhost:4566). 

Set up a dedicated profile: It is recommended to create a specific AWS CLI profile for LocalStack to avoid accidentally using production credentials with your local environment.

```
aws configure --profile localstack
```

Provide dummy credentials and region: When prompted, enter a dummy AWS Access Key ID and AWS Secret Access Key, as LocalStack ignores their values. A default region should also be provided (e.g., us-east-1 or eu-west-1).
- AWS Access Key ID: test or any string starting with LSIA... or LKIA...
- AWS Secret Access Key: test or any string (ignored by LocalStack)
- Default region name: us-east-1
- Default output format: json (or your preference)

Specify the endpoint for each command: For every command you run, you must specify the --endpoint-url flag (usually http://localhost:4566) to direct the request to LocalStack.

```
aws s3 ls --profile localstack --endpoint-url=http://localhost:4566
```

## Naming buckets
https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html?icmpid=docs_console_unmapped#automatically-created-buckets

Use a UUID suffix