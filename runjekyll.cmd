@echo off
@call bundle exec jekyll build
@call bundle exec jekyll serve --incremental
rem pause