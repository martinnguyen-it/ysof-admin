#!/bin/bash

set -e

env=$1
if [ -z "$1" ]; then
  echo "Param :env is required as $1"
  exit 1
fi

branch=$2
if [ -z "$2" ]; then
  echo "Param :branch is required as $2"
  exit 1
fi

echo "Deploying $2 branch to $1"
git fetch origin && git checkout $2 && git merge origin/$2

echo "Overwriting .env with .env.$1"

if [ "$1" = "production" ]; then
  echo 'Update environment for production'
  nano .env
else
  cp ".env.$1" .env
fi

echo "Rebuild docker"
docker compose -p "ysof_admin_fe_$1" -f docker-compose.yml -f "docker-compose.$1.yml" up -d --build --remove-orphans

echo "Deployed admin-fe app from branch $2 to $1"
# echo "Clear cache"
# docker system prune -f
exit 0
