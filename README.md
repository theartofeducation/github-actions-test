# github-actions-test

## 👋 Welcome:

This repository documents the process of triggering the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) end to end testing. 

Once setup correctly, any repository within the [AOEU](https://github.com/theartofeducation) organization can trigger the e2e 
workflow which provides feedback utilizing a full suite of automated tests. 

## 📚 Resources:

* Github Actions experience is helpful but not necessary. Documentation on [triggering a workflow in a repository](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow) 
is available for further reading.

* If Github Actions is new to you, keep in mind that the file of the format has to follow a specific pattern. You can read more 
about this format in the [Workflow syntax for Github Actions document](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions).

* Since the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) repository is private, you will need the 
Github Actions Test `ACCESS_TOKEN` to run the trigger successfully. This is located in the Software Engineering Team section in our Password Manager. The `ACCESS_TOKEN` must also exist as a secret in the repository you are using so make sure, as a user within the [AOEU](https://github.com/theartofeducation) organization, you have the correct permissions.

* For this purpose, we will be using a third party service from [Alex Miller](https://github.com/Codex-). This function uses the [Return Dispatch](https://github.com/Codex-/return-dispatch) and the [Await Remote Run](https://github.com/Codex-/await-remote-run). The Return Dispatch retrieves the unique id of the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) workflow run and inserts the id in worflow of the repository you are using. The [Await Remote Run](https://github.com/Codex-/await-remote-run) then waits for the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) run to complete and will display either the success or the failure of the run.
## 📝 Notes:
* Currently, the ability to know who triggered the workflow run is returned in the workflow but does not display in the "manually run by" view of the workflow run. This is still being research and will be added to this repository once this knowledge is known.

* To view the user that triggered the repo (if you have the correct permissions to do so), navigate to the E2E [workflow/test.yml](https://github.com/theartofeducation/aoeu-e2e/actions/workflows/test.yml), click the current workflow running (or completed) and click "Run Tests". The third step in the process echoes the username of the person triggering the workflow.

* No need to clone the github-actions-test repository. Just follow the outlined steps and you will get where you want to be. 
## 🚶🏽 Steps:

1. Do you have a ci.yml file in your .github folder? Do you have a .github folder? If not, open your repository and create a `.github` folder. Create a folder titled `workflows` inside of your .github folder. Then create a file named `ci.yml`. This is the file you will work from.
1. Copy the github workflow in the [ci.yml in this repository](/github-actions-test/.github/workflows/ci.yml)
1. Add the copied workflow into your repository's ci.yml
1. In your browser, open up the repository you are using in github
1. Click the repository settings and click "Secrets" from the left hand navigation menu
1. Click "Actions"
1. Click "New repository secret"
1. Open the Software Engineering Team in the Password Manager and copy the Github Actions Test ACCESS_TOKEN value
1. Back in Github, in the name field, input ACCESS_TOKEN 
1. In the value field, paste the ACCESS_TOKEN value
1. Click "Add Secret"
1. Back in your repository on your local environment, make any change to your code and push to your current branch
1. ✨ Watch the magic happen in the [aoeu-e2e `test.yml` workflow page](https://github.com/theartofeducation/aoeu-e2e/actions/workflows/test.yml)

## 🤔 What's Happening here?:

* In this scenario, we have two separate repos that need to "talk" to one another to get feedback. 
   * Repo A = the E2E tests that we need to trigger to run
   * Repo B = any repo in the AOEU orgnization, public or private

* Repo A Setup:
   * There is one type of workflow trigger being used in the E2E repository. This is the [Workflow Dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch). When Repo B opens a pull request or makes a change that updates the code, the [Return Dispatch](https://github.com/Codex-/return-dispatch) triggers the workflow that exists in Repo A. The inputs send out the request to Repo A to return a distinct id for the workflow run that will be triggered and the username of the person triggering the workflow from Repo B.

   * What Repo A Setup looks like: 
   ```
   name: test.yml
   on:
   workflow_dispatch:
      inputs:
         distinct_id:
         required: true
         username:
         required: true
   ```
* Repo B Setup:

   * What Repo B Setup looks like: 
   ```
   name: github-actions-test ci
   on:
   pull_request:
      types: opened
   push:
   ```
   * The [Return Dispatch](https://github.com/Codex-/return-dispatch#apis-used) uses the [Create a Workflow Dispatch event](https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event)], the [List Repository Workflows](https://docs.github.com/en/rest/reference/actions#list-repository-workflows), the [List Workflow Runs](https://docs.github.com/en/rest/reference/actions#list-workflow-runs), and the [List Jobs for a Workflow Run](https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run) API calls
   
   * The [Await Remote Run](https://github.com/Codex-/await-remote-run#apis-used) uses the [Get a Workflow Run](https://docs.github.com/en/rest/reference/actions#get-a-workflow-run) and the [List Jobs for a Workflow Run](https://docs.github.com/en/rest/reference/actions#list-jobs-for-a-workflow-run) API calls

   * The Return Dispatch uses the `with:` information in the workflow to let the E2E repository which branch is being requested (`ref:`), which workflow needs to be triggered (`workflow:`), and who is requesting the workflow run (`workflow_inputs:`). 
   ```
   with:
          token: ${{ secrets.ACCESS_TOKEN }} # Note this is NOT GITHUB_TOKEN but a PAT
          ref: main # or target_branch
          repo: aoeu-e2e
          owner: theartofeducation
          workflow: test.yml
          workflow_inputs: '{"username":"${{ github.actor }}"}'
          workflow_timeout_seconds:
   ```

   * The Await Remote Run uses the `with:` information in the workflow to wait for the workflow run that's returned and to retreive the success or failure of that worklow run using the run_id (`run_id:`)
   ```
   with:
          token: ${{ secrets.ACCESS_TOKEN }}
          repo: aoeu-e2e
          owner: theartofeducation
          run_id: ${{ steps.return_dispatch.outputs.run_id }}
          run_timeout_seconds: 300 # Optional
          poll_interval_ms: 5000 # Optional
   ```
