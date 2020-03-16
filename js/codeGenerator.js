/********************************************************************
 * 
 * condeGenerator.js is an example node application that uses
 * config.js to generate skeleton code for a multi-component
 * application.
 * 
 ********************************************************************/

const myArgs = process.argv.slice(2);
const command = process.argv[1];

const Config = require('./config.js');
const fs = require('fs');

const path = require('path');

// Creates all the directories in the path targetDir.
// From https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync 
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

if (myArgs.length !== 3) {
  console.error(`Error! Usage: ${command} <FILE> <JS_CLASSNAME> <CSS_CLASSNAME>`);
  return;
}

const file = myArgs[0];
const jsClassName = myArgs[1];
const cssClassName = myArgs[2];

const config = new Config();
config.nodeInit(file);
const macros = {
  "JS_CLASSNAME": jsClassName,
  "CSS_CLASSNAME": cssClassName
};


const componentDir = config.getScriptedValue(".componentDir", macros);


// First ... create the component directory if it doesn't exist
if (fs.existsSync(componentDir)) {
  console.error(`Error: Directory ${componentDir} exists.`);
  console.error(`Please use a differnet component name than ${jsClassName}`)
  return;
}

mkDirByPathSync(componentDir);


// Next, write the js, loader and scss files from the xml template.
fs.writeFile(`${componentDir}/index.js`, config.getScriptedValue('.js', macros), function (err) {
  if (err) throw err;
  console.log('index.js saved.');
});

fs.writeFile(`${componentDir}/loader.js`, config.getScriptedValue('.loader', macros), function (err) {
  if (err) throw err;
  console.log('loader.js saved.');
});

fs.writeFile(`${componentDir}/styles.scss`, config.getScriptedValue('.scss', macros), function (err) {
  if (err) throw err;
  console.log('styles.scss saved.');
});