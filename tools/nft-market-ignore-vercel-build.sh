#!/usr/bin/env bash

## Name of the app to check. Change this to your application name!
APP=nft-market

echo ">> Testing if should proceed with vercel build..."

## skip build for not whitelisted release branch
if [[ -z ${BALANCE_ALLOWED_RELEASE_BRANCH+x} ]]; then
  echo "Not using BALANCE_ALLOWED_RELEASE_BRANCH, with branch: [${VERCEL_GIT_COMMIT_REF}]"
else
  echo "Using BALANCE_ALLOWED_RELEASE_BRANCH: [${BALANCE_ALLOWED_RELEASE_BRANCH}], with branch: [${VERCEL_GIT_COMMIT_REF}]"
  if [[ "${VERCEL_GIT_COMMIT_REF}" == "main" || "${VERCEL_GIT_COMMIT_REF}" == release* ]]; then
    if [[ "${VERCEL_GIT_COMMIT_REF}" != "${BALANCE_ALLOWED_RELEASE_BRANCH}" ]]; then
      echo "🛑 - Build cancelled"
      exit 0
    fi
  fi
fi

## Determine version of Nx installed
echo ">> Installing dependencies..."
NX_VERSION=$(node -e "console.log(require('./package.json').devDependencies['@nrwl/workspace'])")
TS_VERSION=$(node -e "console.log(require('./package.json').devDependencies['typescript'])")

## Install @nrwl/workspace in order to run the affected command
yarn add @nrwl/workspace@"$NX_VERSION" -D
yarn add typescript@"$TS_VERSION" -D

## Run the affected command, comparing latest commit to the one before that
echo ">> Checking if $APP is affected by latest commit..."
IS_APP_AFFECTED=$(npx nx affected:apps --plain --base HEAD~1 --head HEAD | grep $APP)

if [[ ! $IS_APP_AFFECTED ]]; then
  echo "🛑 - Build cancelled"
  exit 0
elif [[ $IS_APP_AFFECTED ]]; then
  echo "✅ - Build can proceed"
  exit 1
fi
