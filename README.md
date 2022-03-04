# github-actions-test

## 👋 Welcome:

This repository documents the process of triggering the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) end to end testing. 

Once setup correctly, any repository within the [AOEU](https://github.com/theartofeducation) organization can trigger the e2e 
workflow which provides feedback utilizing a full suite of automated tests. 

## 📚 Resources:

* Github Actions experience is helpful but not necessary. Documentation on [creating a repository dispatch event](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) 
is available for further reading.

* If Github Actions is new to you, keep in mind that the file of the format has to follow a specific pattern. You can read more 
about this format in the [Workflow syntax for Github Actions document](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions).

* Since the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) repository is private, you will need the 
Github Actions Test ACCESS_TOKEN to run the trigger successfully. This is located in the Software Engineering Team section in our Password Manager.
## 📝 Notes: 

* No need to clone the github-actions-test repository. Just follow the outlined steps and you will get where you want to be. 
## 🚶🏽 Steps:

1. From your repository, open your ci.yml file found in the .github->workflows folder
2. Copy the github workflow in the [ci.yml in this repository](/github-actions-test/.github/workflows/ci.yml
3. Add the copied workflow into your repository's ci.yml
4. In your browser, open up the repository you are using in github
5. Click the repository settings and click "Secrets" from the left hand navigation menu
6. Click "Actions"
7. Click "New repository secret"
8. Open the Software Engineering Team in the Password Manager and copy the Github Actions Test ACCESS_TOKEN value
9. Back in Github, in the name field, input ACCESS_TOKEN 
10. In the value field, paste the ACCESS_TOKEN value
11. Click "Add Secret"
12. Back in your repository on your local environment, make any change to your code and push to your current branch
13. In your branch in Github, you should see a successful check of the API call to the E2E repository
 ```Run curl \
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed

    0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
    100    64    0     0  100    64      0    374 --:--:-- --:--:-- --:--:--   372
    100    64    0     0  100    64      0    374 --:--:-- --:--:-- --:--:--   372
```
14. ✨ Watch the magic happen in the [aoeu-e2e workflows page](https://github.com/theartofeducation/aoeu-e2e/actions/workflows/ci.yml)

## 🤔 What's Happening here?:

* In this scenario, we have two separate repos that need to "talk" to one another to get feedback. 
   * Repo A = the E2E tests that we need to trigger to run
   * Repo B = any repo in the AOEU orgnization, public or private

* Repo A Setup:
   * Within the Github Actions Workflow file, the [repository_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch) webhook event payload is required. This enables the /dispatch url to run successfully from Repo B. 
   * Also required is the [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) webhook event. The /dispatch url will fail without this event. 

* What Repo A Setup looks like: 
```on:
  repository_dispatch:
  workflow_dispatch:
  push:
```
* Repo B Setup:
   * Within the Github Actions Workflow file, there is the corresponding [repository_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch) webhook event payload. This is required. 
   * In the `jobs:` action, you'll  have the `test:`, `name:` (use any name that is recognizable to you), `runs-on:`, `steps:`, and `-run:`.
   * Included in the `-run:` is the url that calls the E2E dispatch workflow, with the `ACESS_TOKEN` that validates the credentials. The `-d '{"ref":"main"}'` referrences the branch you want to run the tests against in the E2E repo. 
   * 🌶️ Hot Tip: You can run against any branch in E2E by changing the branch name of the `ref`. Example: '{"ref":"`insert-github-branch-here`"}'`

* What Repo B Setup looks like: 
   * ```name: github-actions-test ci
        on:
        push:
        workflow_dispatch:
        jobs:
        test:
            name: Run GA Workflow from E2E
            runs-on: ubuntu-latest
            steps:
            - run: |
                curl \
                -X POST \
                -H "Accept: application/vnd.github.everest-preview+json" \
                https://api.github.com/repos/theartofeducation/aoeu-e2e/actions/workflows/ci.yml/dispatches \
                -u ${{ secrets.ACCESS_TOKEN }} \
                -d '{"ref":"main"}'
