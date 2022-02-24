# github-actions-test

## 👋 Welcome:

This repository documents the process of triggering the [AOEU-E2E](https://github.com/theartofeducation/aoeu-e2e) end to end testing. 

Once setup correctly, any repository within the [AOEU](https://github.com/theartofeducation) organization can trigger the e2e 
workflow which provides feedback utilizing a full suite of automated tests. 

## 📚 Resources:

* Github Actions experience is helpful but not necessary. Documentation on [creating a repository dispatch event](https://github.com/theartofeducation) 
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
