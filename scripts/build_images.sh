#!/bin/bash

export ECR_MAIN_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
export ECR_SECONDARY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_SECONDARY_REGION}.amazonaws.com"

aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_MAIN_URI}
aws ecr get-login-password --region ${AWS_SECONDARY_REGION} | docker login --username AWS --password-stdin ${ECR_SECONDARY_URI}

echo "Creating images URIs"
export ECR_SOLARFLARE_BASE_IMAGE_URI="${ECR_SECONDARY_URI}/${ECR_SOLARFLARE_REPO_NAME}:0.1.0"
export ECR_SOLARFLARE_DEV_IMAGE_URI="${ECR_SECONDARY_URI}/${ECR_SOLARFLARE_REPO_NAME}:0.1.0"
export ECR_SOLARFLARE_PROD_IMAGE_URI="${ECR_SECONDARY_URI}/${ECR_SOLARFLARE_REPO_NAME}:0.1.0"


if [[ ${BUILD_BASE_IMAGE} == true ]]
then
  echo "************* BUILDING SOLARFLARE BASE IMAGE *****************"
  docker build -t solarflare_base:0.1.0 --progress=plain --no-cache --file DockerfileBase .

  echo "Tag Solarflare image for base"
  docker tag solarflare_base:0.1.0 $ECR_SOLARFLARE_BASE_IMAGE_URI

  echo "Push Solarflare image"
  docker push ${ECR_SOLARFLARE_BASE_IMAGE_URI}
  
else
  docker pull ${ECR_SOLARFLARE_BASE_IMAGE_URI}
  docker tag ${ECR_SOLARFLARE_BASE_IMAGE_URI} solarflare_base:0.1.0
fi

if [[ ${BUILD_ENVS} == "all" ]]
then
  echo "************* BUILDING SOLARFLARE DEV IMAGE *****************"
  docker build -t solarflare:dev --progress=plain --no-cache --build-arg env=build:dev .

  echo "############# TAG SOLARFLARE IMAGE FOR DEV  #################"
  docker tag solarflare:0.1.0 $ECR_SOLARFLARE_DEV_IMAGE_URI

  echo "------------- PUSH SOLARFLARE IMAGE FOR DEV -----------------"
  docker push ${ECR_SOLARFLARE_DEV_IMAGE_URI}


  echo "************* BUILDING SOLARFLARE PROD IMAGE *****************"
  docker build -t solarflare:prod --progress=plain --no-cache --build-arg env=build:prod .

  echo "-------------- TAG SOLARFLARE IMAGE FOR PROD  ----------------"
  docker tag solarflare:prod $ECR_SOLARFLARE_PROD_IMAGE_URI

  echo "-------------- PUSH SOLARFLARE IMAGE FOR PROD  ----------------"
  docker push ${ECR_SOLARFLARE_PROD_IMAGE_URI}

elif [[ ${BUILD_ENVS} == "dev" ]]
then
  echo "************* BUILDING SOLARFLARE DEV IMAGE *****************"
  docker build -t solarflare:0.1.0 --progress=plain --no-cache .

  echo "-------------- TAG SOLARFLARE IMAGE FOR DEV  ----------------"
  docker tag solarflare:0.1.0 $ECR_SOLARFLARE_DEV_IMAGE_URI

  echo "-------------- PUSH SOLARFLARE IMAGE FOR DEV  ----------------"
  docker push ${ECR_SOLARFLARE_DEV_IMAGE_URI}

elif [[ ${BUILD_ENVS} == "prod" ]]
then
  echo "************* BUILDING SOLARFLARE PROD IMAGE *****************"
  docker build -t solarflare:prod --progress=plain --no-cache --build-arg env=build:prod .

  echo "-------------- TAG SOLARFLARE IMAGE FOR PROD  ----------------"
  docker tag solarflare:prod $ECR_SOLARFLARE_PROD_IMAGE_URI

  echo "-------------- PUSH SOLARFLARE IMAGE FOR PROD  ----------------"
  docker push ${ECR_SOLARFLARE_PROD_IMAGE_URI}

else
  echo "Not a valid environment provided"
  echo ${BUILD_ENVS}
fi
