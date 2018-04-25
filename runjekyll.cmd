@echo off
rem To install for the first time: https://rubyinstaller.org/downloads/; then run: gem install jekyll bundler
echo To update packages, 'cd' to the base directory and issue 'bundle update'
@call bundle exec jekyll build
@call bundle exec jekyll serve --incremental
rem pause