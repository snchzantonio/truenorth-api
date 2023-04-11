#!/bin/bash
cd /usr/src/app
npm i
DEBUG=* NODE_ENV=development npm run start:dev
