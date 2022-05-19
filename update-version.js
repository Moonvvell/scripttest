const fs = require('fs');

let packageFile = require('./package.json')
const {exec} = require("child_process");
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

fs.writeFile('./package.json', JSON.stringify(packageFile), (err) => {
    if (err) {
        console.error(err)
        return;
    }
    updateVersion();
    console.log('Package.json was updated')
})