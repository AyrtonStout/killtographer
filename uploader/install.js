const fs = require('fs-extra');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const { getWoWInstallLocation, getHomeDirectoryLocation } = require("./helper");
const { spawn } = require('child_process');

const startupDir = getHomeDirectoryLocation() + '/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup';
const addonLocation = getWoWInstallLocation() + 'Interface/AddOns/';
const execString = `start "WoW Uploader" "${addonLocation}KillTographer/uploader.exe"`;

const startupFileName = 'StartWoWUploader.cmd';

console.info('Hello, and thank you for tracking your kills with KillTographer!');
console.info('');
console.info('KillTographer will install addon files in the following location:');
console.info(`    ${addonLocation}`);
console.info("A startup script will be created to run KillTographer's uploader in the background. This will install to:");
console.info(`    ${startupDir}`);

readline.question('Do you wish to proceed? (y/n)\n', input => {
  const answer = input.toLowerCase();
  if (answer === 'yes') {
    console.info("That wasn't one of the options but fine. Here we go!");
    install();
  } else if (answer === 'y') {
    install();
  } else {
    readline.question('Installation aborted. Press enter to continue', () => {
      process.exit(0);
    })
  }
});

function install() {
  console.info('\nWork work...\n');

  const killTographerDir = addonLocation + 'KillTographer';
  console.info('Checking if a previous KillTographer installation exists');
  const previousExists = fs.existsSync(killTographerDir);
  if (previousExists) {
    console.info('Removing previous installation of KillTographer');
    try {
      fs.removeSync(killTographerDir);
    } catch (e) {
      console.error(e);
      console.error('');
      console.error('Unable to remove previous KillTographer installation');
      console.error('You may have to manually kill the running KillTographer upload process ' +
        "(it should show up in task manager as either 'Node.js: Server-side JavaScript' or 'WoW Uploader'");

      readline.question('Press enter to exit', () => { process.exit(1) });
      return;
    }
  } else {
    console.info('No previous installation of KillTographer exists');
  }

  console.info('Copying KillTographer files ...');
  fs.copySync('KillTographer', killTographerDir);

  console.info('Creating startup script');
  const startupFile = `${startupDir}/${startupFileName}`;

  fs.writeFileSync(startupFile, execString);

  console.info("\nJob's done!\n");

  readline.question('KillTographer installation was successful. Would you like to start the KillTographer background process now? (y/n)', input => {
    const answer = input.toLowerCase();
    if (answer === 'y' || answer === 'yes') {
      const killTographerProcess = spawn(startupFile, { detached: true });
      killTographerProcess.unref();

      readline.question('KillTographer has been started. Press enter to exit', () => {
        process.exit(0);
      })
    } else {
      readline.question('KillTographer not started. Press enter to exit', () => {
        process.exit(0);
      })
    }
  })
}
