---
layout: page
title: Git workflow for contributing to OSM-Carto
comments: true
permalink: /git-workflow/
---

This document suggests guidelines on how contributors should operate when collaborating to OpenStreetMap Carto through [pull requests](https://en.wikipedia.org/wiki/Distributed_version_control#Pull_requests) (PRs) via [Git](https://en.wikipedia.org/wiki/Git) and [GitHub](https://en.wikipedia.org/wiki/GitHub).

The reference GitHub pages are the following:

- [GitHub's pull request guidance](https://help.github.com/articles/about-pull-requests/)
- [Collaborating with issues and pull requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/)
- [The fork and pull model](https://help.github.com/articles/about-collaborative-development-models/):
  - [Working with forks](https://help.github.com/articles/working-with-forks/)
  - [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)

Basically, the [Fork](https://en.wikipedia.org/wiki/Fork_(software_development)), [Branch](https://en.wikipedia.org/wiki/Branching_(version_control)) & [Pull model](https://help.github.com/articles/about-pull-requests/) adopted by OpenStreetMap Carto considers the following steps:

- Log to GitHub with your account (create one if you do not have it)
- Fork the OpenStreetMap Carto GitHub repository.
- Clone the forked repository to your local system.
- Add a Git remote for the original repository.
- Create a feature branch in which to place your changes.
- Make your changes to the new branch (and not to your master, which is needed to be set even with upstream:master). 
- Develop your changes in a separate directory (not directly to the staging folder) and, when finished, stage (copy) your changes to your local git folder related to the branch.
- Commit the changes to the branch and add an appropriate comment.
- Push the branch to GitHub.
- Open a pull request (PR) from the new branch to the original repo (and not to your master, which will always have 0 pull requests).
- Add appropriate comments to your PR.
- Your pull requests will then be reviewed and discussed.
- You might be asked to rework your code (in case, you have to perform some update on your development folder, followed by stage, commit, rebase and push operations)
- Clean up your branch after your pull request is merged.

Please, check also the reference documentation for setting up the environment and for contributing to OpenStreetMap Carto:

* [INSTALL](https://github.com/gravitystorm/openstreetmap-carto/blob/master/INSTALL.md)

* [CONTRIBUTE](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CONTRIBUTING.md)

This document assumes UNIX syntax. With Windows, use \ for folders instead of /.

## Introduction

[](We at OpenStreetMap Carto are happy about every piece of code that you contribute and we collected for you in this document relevant information that we think you should know before working on this repository. This is from one side to save us integration work, but from the other to save you frustration, in case the publishing workflow does not work as expected or if something is implemented in parallel.)

A good habit to get into is using topic branches for your work, while keeping the master branch untouched. You can then keep the master branch up-to-date with the main repository without worrying about merge conflicts.

### Reduce Merge Conflicts

By not working on the master branch, you ensure that the branch's history will not diverge from the main repository's master branch. This allows you to pull in updates from the main repository (gravitystorm/openstreetmap-carto) without merge conflicts.

### Organize and Isolate Contributes

By creating a topic branch for each contribution, you effectively isolate your changes into a single branch of history. As long as the topic branch is up-to-date, your changes will merge cleanly into the main repository. If your contributions cannot be merged cleanly, the repository maintainer may have to reject your contribution until you update it.

### Easier for the Maintainer

Maintainers like topic branches. It is easier to review the pull request and merge the commit into the main repository

### Other recommendations

- When considering to approach a first contribution, it would be useful to start addressing an already open issue: it helps you to get involved and reducing the number of open issues is appreciated by the community.
- If you have a new proposal which requires coding and you are new to this repo, a good practice would be to create an issue first, possibly introducing yourself to the community and discussing about your approach; doing this before beginning to develop could allow you to take advantage of suggestions from commenters and save coding time.
- Search for your topic in existing GitHub Issues within OpenStreetMap Carto (open or closed) before opening a new one; Openstreetmap-carto has a very rich issue log, which might already report aspects related to your topic.
- When creating an issue, consider reporting the expected behavior, the actual behavior and add links and screenshots illustrating the problem.
- [GitHub Desktop](https://desktop.github.com/) might be used by Windows or Mac users.
It is recommended to always use `git` commands directly (selecting *Open in Git Shell*). This way GitHub Desktop is exploited just as a monitor and not to issue commands (GitHub Desktop provides a too basic interface and does not clarify which git commands wraps; also, it uses merge vs. rebase).

## Git Workflow 

### Git distributed version control system

Check that [git](https://git-scm.com/documentation) is installed.

```shell
git --version
```

Otherwise (with Ubuntu):

```shell
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev libcurl4-gnutls-dev libexpat1-dev gettext unzip git unzip curl
```

Windows or Mac users might install [GitHub Desktop](https://desktop.github.com/), which optionally includes *git*.

If you are using GitHub Desktop, to issue git commands press the right key of the mouse on your project in the left panel, select
*Open in Git Shell*.

### Fork OpenStreetMap Carto repo

Access the original repository [https://github.com/gravitystorm/openstreetmap-carto](https://github.com/gravitystorm/openstreetmap-carto) after logging on to GitHub with your account.
In the top-right corner of the page, click *Fork*.

This will create your *origin* repository on GitHub. The Gravitystorm repository will be the *upstream*.

Check [this](https://help.github.com/articles/fork-a-repo/) for additional help.

### Check your user configuration

To get/check your user name:

```shell
git config user.name
```

To set/change the user name and email, use:

```shell
git config user.email "your_email@abc.com" # you might also use git config user.email "YourUser@users.noreply.github.com"
git config user.name "User name" 
```

The `--global` option of `git config` can be used to set the value for all repositories instead of the current one.

### Create a local clone of your fork

On GitHub, navigate to your fork of the openstreetmap-carto repository (*https://github.com/YOUR-USERNAME/openstreetmap-carto*, with your GitHub username instead of YOUR-USERNAME).

Under your repository name (NOT gravitystorm/upstream), click *Clone or download*.

If you have GitHub Desktop installed, you can press *Open in Desktop*

Otherwise, in the *Clone with HTTPs* section, click to copy the clone URL for the repository. Then open Git Bash and change directory to an appropriate folder (e.g., change to your home directory).  Type `git clone`, and then paste the URL you copied before. It will look like this, with your GitHub username instead of YOUR-USERNAME:

```shell
git clone https://github.com/YOUR-USERNAME/openstreetmap-carto.git
```

Press Enter. Your local clone will be created.

Now, you have a local copy of your fork of the OpenStreetMap Carto repository in the openstreetmap-carto sub-directory.

### Configure Git to sync your fork with the original repo

You need to verify that Git is configured to sync your fork with the original OpenStreetMap Carto repository.

Change directory to your local copy of the OpenStreetMap Carto repository

```shell
cd openstreetmap-carto
```

Remotes are like a nickname for the URL of a repository.

Get a list of existing remotes including URLs after the name:

```shell
git remote -v
```

If you correctly cloned the repo and are in its directory, you should have at least your origin repo:

```shell
git remote -v
origin  https://github.com/YOUR-USERNAME/openstreetmap-carto.git (fetch)
origin  https://github.com/YOUR-USERNAME/openstreetmap-carto.git (push)
```

If you do not have reference to the original *gravitystorm* repository (*upstream*), type the following command to configure it:

```shell
git remote add upstream https://github.com/gravitystorm/openstreetmap-carto.git
```

To also add remote origin from GitHub project:

```shell
git remote add origin https://github.com/YOUR-USERNAME/openstreetmap-carto.git
```

Then `git remote` should provide a complete configuration:

```shell
git remote -v
upstream    https://github.com/gravitystorm/openstreetmap-carto.git (fetch)
upstream    https://github.com/gravitystorm/openstreetmap-carto.git (push)
origin  https://github.com/YOUR-USERNAME/openstreetmap-carto.git (fetch)
origin  https://github.com/YOUR-USERNAME/openstreetmap-carto.git (push)
```

To list all your branches that you have already defined in your remote:

```shell
git branch -a
```

Then enter the following command:

```shell
git remote set-url --push upstream no_push
```

With the above command, you can `git pull` from the master but cannot *push* to upstream, so you are obliged to create a new branch for each new feature. When you push your feature branch to origin (your own fork), you'll be able to do a pull-request to Gravitystorm from your origin on Github.

To keep in sync with changes in Gravitystorm, you want to set up your repository so it pulls from upstream by default. This can be done with:

```shell
git config branch.master.remote upstream
git config branch.master.merge refs/heads/master
```

Optionally, you may also want to have easy access to all pull requests sent to the Gravitystorm repository:

```shell
git config --add remote.upstream.fetch '+refs/pull/*/head:refs/remotes/upstream/pr/*'
```

To read the git configuration, use `git config --list`.

### Update the master branch

If maintainers update the gravitystorm repo, their changes are not automatically reported in your fork and you need to manually issue the appropriate commands to set your *master* even with *upstream:master*.

Before developing on a branch, committing changes or pushing your code, you always need to check that your *master* is "even" with *origin/master*: this is performed by checking out your *master* branch and updating it with *gravitystorm/openstreetmap-carto* latest changes.

With the browser, access your remote GitHub repository and verify that you are even with upstream:master.

If you are using GitHub Desktop, right key on your project on the left panel, *View on GitHub* (your browser is opened to GitHub).

Verify the presence of the note "This branch is even with upstream:master." and that there is no mention like this one: "This branch is [n] commits behind upstream:master." In case, select *Open in Git Shell*, get the shell prompt and perform the following commands.

```shell
git checkout master
git pull upstream master
git push origin master
```

The above commands can be safely performed even if you are already even with upstream:master (and are suggested).

Note 1: if you followed the suggestion to apply changes on branches, leaving your *master* untouched, the synching operation shall always work without producing errors; nevertheless, if there are (unwanted) local changes, `git pull upstream master` fails; to discard local changes:

```shell
git reset --hard
git pull upstream master
```

Note 2: `git push origin master` might ask your GitHub user and password.

Note 3: Reset local master to a specific commit of the origin:

```shell
git checkout master
git reset --hard [commit ID]
git push --force origin master
```

Note 4: Display differences from local and origin master (it won't print any diff if there are no differences):

```shell
git diff master..origin/master
```

### Create a topic branch

The general workflow to perform a contribution through a branch is the following:
- On your GitHub repository (as a result of the previous fork), create a new branch
- Clone branch to your local PC (e.g., with GitHub Desktop if you are using it); save it in the default directory proposed by GitHub
- The development of your contribution shall be performed in a separate development folder (not directly in your GitHub local repository, named *staging area*).
- When the development is finished and it is fully tested, it can be published.

Now, create a topic branch named "*revised-feature*" from master, for a new revision of a feature you wish to propose.

You can name the topic branch anything, but it makes sense to use appropriate naming, possibly through a small number of characters (so that you can easily check it online via GitHub). Notice that the name of your branch will be visible to revisors and approvers, so it would be useful to take some time to consider an appropriate naming.

```shell
git checkout master
git checkout -b revised-feature
git branch
	master
  * revised-feature
```

This topic branch *revised-feature* is now isolated and branched off the history of your `master` branch.

### Summary of main commands managing branches

- List local branches (current branch highlighted with an asterisk):

  ```shell
  git branch
  ```

- List local and remote branches:

  ```shell
  git branch -a
  ```

- Switch to a specific branch (e.g., named *revised-feature* here):

  ```shell
  git checkout revised-feature
  ```
  
  You might get this error if you have unstaged changes: "Please, commit your changes or stash them before you can switch branches.".
  If you want remove all local changes from your working copy, simply stash them:
  
  ```shell
  git stash save --keep-index
  ```
  
  If you don't need them anymore, you now can drop that stash:
  
  ```shell
  git stash drop
  ```
  
- Create a new branch (e.g., named revised-feature) and checkout it:

  ```shell
  git checkout -b revised-feature
  ```

- Discard unstaged changes of a branch

  You can discard changes which are not yet committed by doing a reset (`git reset --hard`) or with the following:
  
  ```shell
  git clean -dfx
  git checkout .
  ```

### Updating a branch

If maintainers updated the gravitystorm repo, you first need to update your *master* to be even with *upstream:master* (see [Update the master branch](#update-the-master-branch)); then, you also need to update your branch with appropriate commands; consider meanwhile to combine (squash) your multiple commits into a single one, for future easier revision by maintainers and commenters.

Update your branch with the last commits of *upstream:master*, also combining multiple commits (squashing them into one):

```shell
git rebase -i origin/master
```

In general, you update a branch to either help revisors by synching your branch to be one commit ahead of upstream:master (e.g., after *upstream:master* received some merge), or to perform some updates.

`git rebase -i origin/master` might produce conflicts which need manual fixing (see below). After solving conflicts: `git rebase --continue`.

After issuing `git rebase -i origin/master`, if you have to perform updates, you can do them: implement coding in your separate development directory, then stage the updates to your git local folder; subsequently, you need to perform a commit (related to your updates), a new rebase (to squash your updates and the previous commit into a single one) and a push (to publish the update to your remote (and to the gravitystorm repo in case of existing PR). If no additional change is needed, you can directly issue a push (in case of active PR, revisors will see the changes after the push operation).

Push only after your updates are ready. When pushing, because of rebasing you need the *--force* flag:

```shell
git push --force
```

When rebasing, an editor will open and all the commits on your branch will be listed. If you only have one *pick* line, you simply need to mention that you rebased to the last upstream:master commit and leave all other subsequent comments; then save and close the editor. If you have multiple commits, it should look something like:

    pick 704c166 adding new file
    pick df1ece0 adding another file
    pick 226433d making a change
    pick d04306a making another change
    pick b0c7604 final commit for new feature

Squash all but one commit (unless you want several to be merged into master) and save; to do this, with the editor modify all subsequent *pick* words to *squash* and then save and close the editor:

    pick 704c166 adding new file
    squash df1ece0 adding another file
    squash 226433d making a change
    squash d04306a making another change
    squash b0c7604 final commit for new feature

The editor will open again and you will then be prompted to enter a new commit message; be precise and concise with this message, merging all the commit messages, because this message will substitute all previous ones and will be visible to maintainers and commenters (and checked by them to understand what you did). Also mention that you rebased to the last upstream:master commit. It is good practice to begin with the last comments. E.g.,

    **Title**

    Short description
    
    Latest changes:
    ...(detailed list)

Try anyway to be concise and always avoid long lines (especially in the title).

*git rebase* will stop when "pick" has been replaced with "edit" or when a command fails due to merge errors, to to give you an opportunity to fix the problem. When you are done editing and/or resolving conflicts, you can continue with `git rebase --continue`. Conversely, if you need to reset a stopped rebase operation, use the command `git rebase --abort`.

In case of conflicts, issue `git status` to get a list of files that need manual editing. Open the reported files in your text editor. Git automatically adds conflict markers to the affected areas. A conflict-marked area begins with <<<<<<< and ends with >>>>>>>. These are also known as the conflict markers. The two conflicting blocks themselves are divided by a =======.

You need to make sure to resolve all conflicts such that the files make sense, and everyone is happy.

After resolving a conflict, issue `git add [your edited filename]` and then `git rebase --continue`.

Notes:

  - If you only want to modify your last commit message, issue the following:
  
    ```shell
    git commit --amend
    git push --force
    ```
  
  - If you want to consolidate your last two commits into one:
  
    ```shell
    git rebase -i HEAD~2
    git push --force
    ```

Further documentation:

- https://git-scm.com/docs/git-rebase

- https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/

### Make File Changes

As mentioned, the development of your contribution shall be performed in a separate folder (so, not directly in your GitHub staging area).

    [ edit any file; e.g., some .mss files, maybe some .md files, maybe some symbols\<n<me>.svg file ]

Check the following pages:
* [CONTRIBUTE](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CONTRIBUTING.md)
* [CARTOGRAPHY](https://github.com/gravitystorm/openstreetmap-carto/blob/master/CARTOGRAPHY.md)

Copy all files changed/added with your development to your local git folder (staging area).

Notice that changed files are automatically managed by GitHub, but new ones are not automatically staged and 'git add' is needed:

```shell
git add <new files>
```

*git add* will stage the file changes. You can then commit the staged file(s) with *git commit*.

### Resetting File Changes

To overwrite local changes with the last commit of your current branch

```shell
git checkout HEAD file/to/overwrite
git pull
```

To overwrite local changes with the last commit of gravitystorm:

```shell
git checkout HEAD^ file/to/overwrite
git pull
```

### Check the status of your modifications

```shell
git status
  modified: [A_FILENAME]
```

git status shows that you have modified one file.

### Commit the File Changes

A good practice is to perform a dry-run before issuing the actual commit:

```shell
    git commit -a --dry-run
```

No command is executed when the *--dry-run* option is used. Nevertheless, the produced output is useful to check that everything is ready to be committed. You can also add the *-v* option to show the differences.

To use *vi* as editor (default would be *nano* for UNIX and notepad for Windows):

```shell
git config --global core.editor "vim"
```

Keeping the default editor is suggested with Windows.

Commit command:

```shell
git commit -a
```

An editor will open, requesting to enter the commit message which will become public and is important for revisors, so please take care to add:
- a summary of the commit in the first line (be concise, e.g. less than 80 characters)
- a blank line
- a concise description in multiline format (e.g., "List of changes:", followed by a bullet list)

Save the text and exit the editor.

After the commit, if you are using GitHub Desktop, you can check that the changes are valid.

### Commit More File Changes

You can go on producing additional commits in subsequent periods:

```shell
[ edit some file ]
git commit -am "[#11] Improved feature"
```

### Prepare to Send a Pull Request

Before sending the pull request, you should ensure that your changes merge cleanly with the main repository gravitystorm/openstreetmap-carto.

You can do this by pulling the latest changes from the main repository and rebasing the history of the master branch onto the topic branch *revised-feature*. Essentially, this will fast-forward your topic branch to the latest commit of the master.

```shell
git checkout master
git pull upstream master
git checkout revised-feature
git rebase master
git status
```

Alternatively, you can use `git merge master` instead of `git rebase master`, but your topic branches history may not be as clean.

Update your branch with the last commits of *upstream:master*, also combining multiple commits (squashing them into one):

```shell
git rebase -i origin/master
```

See previously detailed explanations.

### Share your Changes on GitHub

Verify that the prompt refers to the correct branch:

```shell
git checkout revised-feature
```

Push your topic:

```shell
git push
```

Or:

```shell
git push origin revised-feature
```

In case of "fatal: The current branch scripts-readme has no upstream branch.", use the following:

```shell
git push --set-upstream origin revised-feature
```

You might get an error in case of rebase. Issue then:

```shell
git push --force
```

By pushing your topic branch onto your GitHub fork, a gravitystorm/openstreetmap-carto maintainer can review and merge the topic branch into the main repository.

## Sending a Pull Request from GitHub

Open a web browser to your GitHub account's fork of the openstreetmap-carto repository.

If you are using GitHub Desktop, right key on your project on the left panel, "View on GitHub" (your browser is opened to GitHub). Verify that you are in YOUR GitHub Web repository and that you are logged.

You should see: "Your recently pushed branches: revised-feature" and "Compare & pull request button". Press it.

Alternatively, select your topic branch so that the pull request references the topic branch. Click the Pull Request button.

### Document your Pull Request

From the step before, you should already have a web browser opened to the gravitystorm GitHub repo, with "Open a pull request".

Alternatively, open a web browser to the gravitystorm GitHub repo and access pulls: https://github.com/gravitystorm/openstreetmap-carto/pulls

Then select yours.

Be very precise with title and description. If the title is not appropriate, modify it.

In the description text, repeat the title in bold (**title**), then leave a blank line, than introduce the aim of the PR and document it in detail, exploiting Markdown.

If the PR resolves an issue (e.g., issue 1234), mention:
```
Resolves #1234
```
Check also https://help.github.com/articles/closing-issues-via-commit-messages/

Test rendering; report links and sample images within the description, including *Before* and *After*.

Verify that "Allow edits from maintainers" is checked.

Press "Create pull request".

### Test automation

The repository supports [Travis CI](https://en.wikipedia.org/wiki/Travis_CI) for automatically testing each pull request and simplifying the integration process.

The file named [.travis.yml](https://github.com/gravitystorm/openstreetmap-carto/blob/master/.travis.yml), used to configure Travis CI, includes all testing sequences automatically performed by GitHub when a new commit is pushed or a pull request is submitted. A container-based build is activated, relevant files are verified, the project is compiled with *carto* and all resulting XML, SVG and lua transforms are validated for formal correctness.

A check result section appears when submitting the pull request and you should verify that all automatic verifications have passed.

A label reporting that some checks haven't completed yet is normal as the test automation takes time.

If you see at the end that checks have failed, there are problems in your PR that you need to fix and generally maintainers refrain from merging it.

To see the errors, click on Details in the section. This will bring up the Travis log. Green means that the test has passed. Red means there’s a problem.

### While Waiting, Continuing Crafting Commits

Since you worked on the topic branch instead of the master branch, you can continue working while waiting for the pull request to go through.

You can select another branch and go on working on it:

```shell
git checkout master
git pull upstream master
git checkout another_branch
```

You can create a new topic branch (be sure to create it from master):

```shell
git checkout master
git pull upstream master
git checkout -b new_feature
git branch -a
  * new_feature
	master
	revised-feature
```

## When your Pull Request is Accepted

```shell
git checkout master
git pull upstream master
git log 
```

You can now delete your topic branch, because it is now merged into the main repository and in master branch.

```shell
git branch -d revised-feature
git push origin :revised-feature
```

I know, deleting a remote topic branch is ugly (git push origin :revised-feature).

## If your Pull Request is Rejected

In this case, you just need to update your branch from the main repository and then address the rejection reason.

```shell
git checkout master
git pull upstream master
git checkout revised-feature
git rebase master
( edit / commit / edit / commit / rebase)
git push origin revised-feature
```

Edit the pull request message from your GitHub account, after accessing your PR.

## GitHub Desktop monitoring features

The following are useful monitoring elements offered by GitHub Desktop (the Windows/Mac sowtware provided by GitHub):

* [Comparison graph](https://help.github.com/desktop/guides/contributing/about-the-comparison-graph/)
  You can easily monitor whether you are at the same level of upstream:master, whether you branch might need a rebase, etc.

* [PowerShell-based Git Shell](https://git-scm.com/book/it/v2/Git-in-Other-Environments-Git-in-Powershell) that comes with GitHub Desktop.
  It exploits [posh-git](https://github.com/dahlbyk/posh-git#posh-git).
  * **`Cyan color`{:.cyan}**: your local branch matches its remote; the "=" shows that it is at the same commit level as the remote branch; a commit can be done; notice that, just after opening the shell, the first git prompt might not be in sync with the remote and can show that your branch is up-to-date with your origin at GitHub even if it is not; a `git pull` would be appropriate to be checked.
  * **`Green color`{:.green}**, "↑": branch ahead of its remote, meaning that you already performed a commit; needs a `git push`
  * **`Red color`{:.red}**, "↓": branch is behind its remote, needs a `git pull`
  * **`Yellow color`{:.gold}**, "↕": if not after rebasing, it might need `git pull` and then `git push`; in case of rebase completed locally, it might need a `git push --force`
  
  If you change the branch via GitHub Desktop, press enter in the posh-git command line to reflect this in the prompt.
  
  Check [prompt description](https://github.com/dahlbyk/posh-git#the-prompt) for further useful information.
  
* You also have the built-in git GUI: `gitk`

## Final recommendations
- Clone your GitHub repository, not gravitystorm/openstreetmap-carto
- Do not use your local GitHub repository for development; just copy there the modified files
- Do not modify the original repository you want to contribute, but fork it
- Do not modify the master branch of your fork, but create a new branch and do there your modifications and commits
- Do not push a contribution to your master, but to the origin repository you are contributing for
- Do no press keys mentioning "Close" by mistake, unless you really want to freeze an open discussion
- Avoid too many commits: you might squash them by doing a `git rebase -i origin/master` to your branch (and subsequently `git push --force`).
