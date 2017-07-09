@echo off
echo to update packages, cd to the base directory and issue 'bundle update'
@call bundle exec jekyll build
@call bundle exec jekyll serve --incremental
rem pause