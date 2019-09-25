const fs = require('fs');
const { execSync } = require('child_process');
const http = require('http');
const { getWoWInstallLocation } = require("./helper");
const { hideCurrentProcessWindow } = require('windows-api-show-window');


if (__dirname === 'Startup') {
  // hideCurrentProcessWindow();
} else {
  console.info('-- WoW Stat Uploader --');
  console.info('');
  console.info('This application is not running from within your Windows startup folder');
  console.info('It is recommended to copy it to "C:\\Users\\{user}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup" so that the script is running in the background');
  console.info('');
  console.info('However, it will continue to run manually until this window is closed');
}

function runStuff() {
  console.log('Checking to send... ');
  if (isWowRunning()) {
    console.log('Wow is running. Aborting');
    return;
  }

  const installLocation = getWoWInstallLocation();
  readAndSendSavedVariables(installLocation);

  console.log('Done running. Will check again in 10 minutes');
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

runStuff();
setInterval(runStuff, 10 * 60 * 1000);
