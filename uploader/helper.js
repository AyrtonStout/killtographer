const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

module.exports = {
  getWoWInstallLocation: () => {
    const regKeyResult = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Blizzard Entertainment\\World of Warcraft" /v InstallPath', {encoding: 'utf8'});

    const installKey = regKeyResult.split('\n').find(regText => regText.includes('InstallPath'));

    if (installKey === undefined) {
      console.error('Unable to locate WoW installation directory!');
      return
    }

    const installLocation = installKey
      .split(' ') // String has 3 components: key, key type, and key value. They are separated by like 4 spaces
      .filter(part => part.length > 0) // Get rid of all the empty entries that were created b/c of the 4 space separators
      .slice(2) // We don't want the key or key type
      .join(' ') // The remaining entries are all for the location. Put them back together (there were probably spaces in the directory name)
      .replace(/\\/g, '/') // Get rid of the \ and use / for less escaping
      .replace(/\r/g, '') // Get rid of carriage returns
    ;

    if (!installLocation.includes('_classic_')) {
      throw 'Could not find WoW Classic location from registry key!';
    }

    return installLocation;
  },

  getHomeDirectoryLocation: () => {
    return os.userInfo().homedir
      .replace(/\\/g, '/')
  },

  deleteFolderRecursive: (path) => {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file) {
        const curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          module.exports.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
};
