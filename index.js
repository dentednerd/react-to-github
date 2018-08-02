#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const colors = require('colors');
const templates = require('./templates/templates.js');

const appName = process.argv[2];
const userName = process.argv[3];

const scripts = `"homepage": "https://${userName}.github.io/${appName}",
  "scripts": {
    "predeploy": "yarn run build",
    "deploy": "gh-pages -d build",`;

const createApp = () => {
  console.log('\nThanks for using react-to-github!'.cyan);
  console.log(`\nYou should already have created a repo named ${appName} on Github.\n`.cyan);

  return new Promise((resolve) => {
    if (appName && userName) {
      console.log(`[1/6] Creating app ${appName}...`.cyan);
      exec(`create-react-app ${appName}`, () => {
        resolve(true);
      });
    } else {
      resolve(false);
    }
  });
};

const installPackages = () => {
  console.log('[2/6] Installing dependencies with Yarn...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && yarn add react-router-dom react-helmet gh-pages jest`, () => {
      resolve();
    });
  });
};

const gitInit = () => {
  console.log('[3/6] Initialising git...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && git init && git remote add origin https://github.com/${userName}/${appName}.git`, () => {
      resolve();
    });
  });
};

const updateTemplates = () => {
  console.log('[4/6] Updating default templates...'.cyan);
  return new Promise(((resolve) => {
    const promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise((res) => {
        fs.writeFile(`${appName}/src/${fileName}`, templates[fileName], (err) => {
          if (err) { return console.log(err); }
          res();
        });
      });
    });
    Promise.all(promises).then(() => { resolve(); });
  }));
};

const updatePackageJson = () => {
  console.log('[5/6] Updating package.json...'.cyan);
  return new Promise((resolve) => {
    fs.readFile(`${appName}/package.json`, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace('"scripts": {', scripts)
      fs.writeFile(`${appName}/package.json`, data, err2 => err2 || true);
      resolve();
    });
    resolve();
  });
};

const deploy = () => {
  console.log('[6/6] Deploying to Github Pages...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && yarn run build && git add . && git commit -m "initial commit" && yarn run deploy`, () => {
      resolve();
    });
  });
};

const run = async () => {
  const createSuccess = await createApp();
  if (!createSuccess) {
    console.log('\nCouldn\'t create this app.'.red);
    console.log('\nProvide an app name and your Github username in the following format: '.cyan);
    console.log('\nreact-to-github your-app-name your-github-username\n'.yellow);
    return false;
  }
  await installPackages();
  await gitInit();
  await updateTemplates();
  await updatePackageJson();
  await deploy();
  return (
    console.log(`\nCongratulations! ${appName} is set up and deployed!\nYour app will shortly be visible at https://${userName}.github.io/${appName}\n\nNext steps:\ncd ${appName}\nyarn start\n`.cyan)
  );
};

run();
