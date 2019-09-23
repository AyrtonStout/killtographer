const fs = require('fs');
const { execSync } = require('child_process');
const http = require('http');


function runStuff() {
  console.log('Checking to send... ');
  if (isWowRunning()) {
    console.log('Wow is running. Aborting');
    return;
  }

  const installLocation = getInstallLocation();
  readAndSendSavedVariables(installLocation);

  console.log('Done running');
}

function getInstallLocation() {
  const regKeyResult = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Blizzard Entertainment\\World of Warcraft" /v InstallPath', { encoding: 'utf8' });

  const installKey =  regKeyResult.split('\n').find(regText => regText.includes('InstallPath'));

  if (installKey === undefined) {
    console.error('Unable to locate WoW installation directory!');
    return
  }

// const [key, keyType, keyValue] = installKey
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
}

function postTheData(data, filePath) {
  const options = {
    hostname: 'shoopuf.net',
    port: 8000,
    path: '/api/ingest-data',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Content-Length': data.length
    }
  };
  // const options = {
  //   hostname: 'localhost',
  //   port: 5001,
  //   path: '/api/ingest-data',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'text/plain;charset=UTF-8',
  //     'Content-Length': data.length
  //   }
  // };

  const request = http.request(options, res => {
    console.log(res.statusCode);
    if (res.statusCode === 200) {
      console.log('Deleting file...');
      fs.unlinkSync(filePath);
    }
    res.on('data', d => {
      process.stdout.write(d);
    })
  });

  request.on('error', error => {
    console.error(error);
  });

  request.write(data);
  request.end();
}

function readAndSendSavedVariables(installLocation) {
  const accountWtf = installLocation + `WTF/Account`;
  const dirs = fs.readdirSync(accountWtf);

  for (const dir of dirs) {
    const possibleKillTographerDataLocation = `${accountWtf}/${dir}/SavedVariables/KillTographer.lua`;

    if (fs.existsSync(possibleKillTographerDataLocation)) {
      console.log(`Data exists at ${possibleKillTographerDataLocation}`);
    } else {
      console.log(`No data exists at ${possibleKillTographerDataLocation}`);
      continue;
    }

    const contents = fs.readFileSync(possibleKillTographerDataLocation, 'utf8');

    console.log('Sending request...');
    postTheData(contents, possibleKillTographerDataLocation);
  }
}

function isWowRunning() {
  const cmd = 'tasklist';
  const processName = 'Wow.exe';

  const tasks = execSync(cmd, { encoding: 'utf8' });
  return tasks.includes(processName);
}

setInterval(runStuff, 10 * 60 * 1000);
