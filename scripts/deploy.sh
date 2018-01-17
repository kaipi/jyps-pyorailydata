#!/bin/bash
case $1 in
  production)
    rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/ git@jyps.fi:/tmp/dataapp
    ;;
esac
