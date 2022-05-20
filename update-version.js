const fs = require('fs');

const {exec, exit} = require('shelljs');
let packageFile = require('./package.json')
packageFile.versionCode++

const updateVersion = () => {
    let versionUpdateType = process.argv.slice(2)[0]
    if (versionUpdateType === undefined) {
        exec('yarn version --patch')
    } else if (versionUpdateType === 'minor') {
        exec('yarn version --minor')
    } else if (versionUpdateType === 'major') {
        exec('yarn version --major')
    }
}

const updateGit = () => {
    exec("git push");
    console.info('Code was pushed to main');
    exec("git checkout staging");
    exec("git merge main");
    exec("git push");
    console.info('Code was merged into staging')
    exec("git checkout main");
}

fs.writeFile('./package.json', JSON.stringify(packageFile), (err) => {
    if (err) {
        console.error(err)
        exit(1)
    }
    updateVersion();
    console.info('Package.json was updated')
    updateGit();
    exit(0)
})