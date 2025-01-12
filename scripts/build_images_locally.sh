#!/bin/bash

if [[ ${BUILD_BASE_IMAGE} == true ]]
then
  echo "************* BUILDING SUNFYRE BASE IMAGE *****************"
  docker build -t solarflare:base --progress=plain --no-cache ./DockerImages/
fi
if [[ ${BUILD_ENVS} == "all" ]]
then
  echo "************* BUILDING SUNFYRE DEMO IMAGE *****************"
  docker build -t solarflare:noprod --progress=plain --no-cache --build-arg env=build:demo .

  echo "************* BUILDING SUNFYRE PROD IMAGE *****************"
  docker build -t solarflare:prod --progress=plain --no-cache --build-arg env=build:prod .
elif [[ ${BUILD_ENVS} == "demo" ]]
then
  echo "************* BUILDING SUNFYRE DEMO IMAGE *****************"
  docker build -t solarflare:noprod --progress=plain --no-cache --build-arg env=build:demo .

elif [[ ${BUILD_ENVS} == "prod" ]]
then
  echo "************* BUILDING SUNFYRE PROD IMAGE *****************"
  docker build -t solarflare:noprod --progress=plain --no-cache --build-arg env=build:prod .
else
  echo "Not a valid environment provided"
  echo ${BUILD_ENVS}
fi

