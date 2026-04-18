# ECR

ECR stands for Elastic Container Registry. Basically AWS's docker registry.

## Pricing

According to [their website](https://aws.amazon.com/ecr/pricing/), unfortunately there's no perpetual free tier for private registries. For public registries, you can host 50 GB. I guess there's no real reason a hobby project can't be public.

Beyond free tier limits, container storage is $0.10 per GB-month. Which is pretty darn cheap.

Apparently my account should have $200 in free credits which expire after 12 months. As long as I stick to one or two containers in the registry and it doesn't exceed 1 GB per month, this would amount to less than 1% of the free tier.

So I think the way to go is to create a private repo and we'll just need to remember to turn it off in a year if nothing becomes of this. 

## Commands

To retrieve an auth token and authenticate the docker client:

```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 038462757834.dkr.ecr.us-east-1.amazonaws.com
```

When building the container, make sure to tag it with the path we named the ECR repository:

```
docker buildx build -f apps/api/Dockerfile.awslambda --platform linux/arm64 --provenance=false -t 038462757834.dkr.ecr.us-east-1.amazonaws.com/mi-casa/api:latest .
```

Push the container:

```
docker push 038462757834.dkr.ecr.us-east-1.amazonaws.com/mi-casa/api:latest
```