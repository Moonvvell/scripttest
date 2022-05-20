const fs = require('fs');

const {exec, exit} = require('shelljs');
let packageFile = require('./package.json')
packageFile.versionCode++

const runExecCommand = (command) => {
    const execCommand = exec(command, {silent: true});
    if (execCommand.code !== 0) {
        console.error(execCommand.stderr)
        exit(1)
    }
}

const updateVersion = () => {
    runExecCommand('git config user.email "ciemail"')
    runExecCommand('git config user.name "ci"')
    let versionUpdateType = process.argv.slice(2)[0]
    if (versionUpdateType === 'minor') {
        exec('yarn version --minor')
    } else if (versionUpdateType === 'major') {
        exec('yarn version --major')
    } else {
        exec('yarn version --patch')
    }
}

const updateGit = () => {
    runExecCommand("git push")
    console.info('Code was pushed to main');
    runExecCommand("git checkout staging")
    runExecCommand("git merge main")
    runExecCommand("git push")
    console.info('Code was merged into staging')
    runExecCommand("git checkout main")
}

fs.writeFile('./package.json', JSON.stringify(packageFile), (err) => {
    if (err) {
        console.error(err)
        runExecCommand('git reset --hard')
        exit(1)
    }
    updateVersion();
    console.info('Package.json was updated')
    updateGit();
    exit(0)
})