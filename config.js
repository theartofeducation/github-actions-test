const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    auth: 'GH_PAT',
});

const owner = 'theartofeducation';
const repo = 'aoeu-e2e';
author = {
    name: 'My Name',
    email: 'myemail@domain.com',
};
const url =  '/repos/{owner}/{repo}/{path}'; // leave this as is
const ref =  'heads/master'; // 'master' represents the name of my primary branch
