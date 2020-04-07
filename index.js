const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const request = require('request');

const GITHUB_USER = '';
const GITHUB_API_KEY = '';
const BASE_FS_PATH = '';

function fetchReposMetadataJson(url) {
  const promise = new Promise((resolve, reject) => {
    request.get({
        url,
        json: true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0',
          'Authorization': `token ${GITHUB_API_KEY}`
        }
      }, (err, res, data) => {
        if (err) {
          reject({ res: null, err });
        } else if (res.statusCode !== 200) {
          reject({ res, err: null });
        } else {
          resolve(data);
        }
    });
  });

  return promise;
}

function fetchAllRepos(startPage) {
  const repos = [];

  const promise = new Promise((resolve, reject) => {
    function fetchReposByPage(page) {
      console.log(`page ${page}`);

      fetchReposMetadataJson(`https://api.github.com/users/${GITHUB_USER}/repos?page=${page}&per_page=30`).then((data) => {
        if (data.length === 0) {
          resolve(repos);
        } else {
          // Here `data` is already parsed as JSON. Append to `repos` array.
          repos.push.apply(repos, data);

          setTimeout(() => {
            fetchReposByPage(page + 1);
          }, 1500 + Math.floor(Math.random() * 1500));
        }
      }).catch((data) => {
        if (data.res) {
          console.log('Status: ', data.res.statusCode);
          console.log('Body: ', data.res.body);
        } else if (data.err) {
          console.log('Error: ', data.err);
        } else {
          console.log('Unknown error!');
        }

        resolve(repos);
      });
    }

    fetchReposByPage(1);
  });

  return promise;
}

function pullOrCloneRepos(repos) {
  repos.forEach((repo, idx) => {
    if (fs.existsSync(path.join(BASE_FS_PATH, repo.name))) {
      console.log(`\n[${idx + 1}/${repos.length}] pull ${repo.name} ...`);
      const errCode = execSync(
        'git pull origin master',
        {
          cwd: path.join(BASE_FS_PATH, repo.name),
          stdio: 'inherit'
        }
      );
    } else {
      console.log(`\n[${idx + 1}/${repos.length}] clone ${repo.name} ...`);
      const errCode = execSync(
        `git clone ${repo.clone_url}`,
        {
          cwd: BASE_FS_PATH,
          stdio: 'inherit'
        }
      );
    }
  });
}

fetchAllRepos().then((repos) => {
  console.log('\n-----');
  console.log(`Total repos to process: ${repos.length}`);
  console.log('-----');

  pullOrCloneRepos(repos);
});
