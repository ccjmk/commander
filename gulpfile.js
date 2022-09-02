const { rollup } = require('rollup');
const argv = require('yargs').argv;
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const rollupConfig = require('./rollup.config');

/********************/
/*  CONFIGURATION   */
/********************/

const name = 'commander';
const sourceDirectory = './src';
const distDirectory = './dist';
const stylesDirectory = `${sourceDirectory}/styles`;
const stylesExtension = 'css';
const sourceFileExtension = 'ts';
const staticFiles = ['assets', 'fonts', 'lang', 'packs', 'templates', 'module.json'];

/********************/
/*      BUILD       */
/********************/

/**
 * Build the distributable JavaScript code
 */
async function buildCode() {
  const build = await rollup({ input: rollupConfig.input, plugins: rollupConfig.plugins });
  return build.write(rollupConfig.output);
}

/**
 * Build style sheets
 */
function buildStyles() {
  return gulp.src(`${stylesDirectory}/${name}.${stylesExtension}`).pipe(gulp.dest(`${distDirectory}/styles`));
}

/**
 * Copy static files
 */
async function copyFiles() {
  for (const file of staticFiles) {
    if (fs.existsSync(`${sourceDirectory}/${file}`)) {
      await fs.copy(`${sourceDirectory}/${file}`, `${distDirectory}/${file}`);
    }
  }
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
  gulp.watch(`${sourceDirectory}/**/*.${sourceFileExtension}`, { ignoreInitial: false }, buildCode);
  gulp.watch(`${stylesDirectory}/**/*.${stylesExtension}`, { ignoreInitial: false }, buildStyles);
  gulp.watch(
    staticFiles.map((file) => `${sourceDirectory}/${file}`),
    { ignoreInitial: false },
    copyFiles,
  );
}

/********************/
/*      CLEAN       */
/********************/

/**
 * Remove built files from `dist` folder while ignoring source files
 */
async function clean() {
  const files = [...staticFiles, 'module'];

  if (fs.existsSync(`${stylesDirectory}/${name}.${stylesExtension}`)) {
    files.push('styles');
  }

  console.log(' ', 'Files to clean:');
  console.log('   ', files.join('\n    '));

  for (const filePath of files) {
    await fs.remove(`${distDirectory}/${filePath}`);
  }
}

/********************/
/*       LINK       */
/********************/

/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 */
function getDataPaths() {
  const config = fs.readJSONSync('foundryconfig.json');
  const dataPath = config?.dataPath;

  if (dataPath) {
    const dataPaths = Array.isArray(dataPath) ? dataPath : [dataPath];

    return dataPaths.map((dataPath) => {
      if (typeof dataPath !== 'string') {
        throw new Error(
          `Property dataPath in foundryconfig.json is expected to be a string or an array of strings, but found ${dataPath}`,
        );
      }
      if (!fs.existsSync(path.resolve(dataPath))) {
        throw new Error(`The dataPath ${dataPath} does not exist on the file system`);
      }
      return path.resolve(dataPath);
    });
  } else {
    throw new Error('No dataPath defined in foundryconfig.json');
  }
}

/**
 * Link build to User Data folder
 */
async function linkUserData() {
  let destinationDirectory;
  if (fs.existsSync(path.resolve(sourceDirectory, 'module.json'))) {
    destinationDirectory = 'modules';
  } else {
    throw new Error(`Could not find ${chalk.blueBright('module.json')}`);
  }

  const linkDirectories = getDataPaths().map((dataPath) => path.resolve(dataPath, 'Data', destinationDirectory, name));

  for (const linkDirectory of linkDirectories) {
    if (argv.clean || argv.c) {
      console.log(`Removing build in ${linkDirectory}.`);

      await fs.remove(linkDirectory);
    } else if (!fs.existsSync(linkDirectory)) {
      console.log(`Linking dist to ${linkDirectory}.`);
      await fs.ensureDir(path.resolve(linkDirectory, '..'));
      await fs.symlink(path.resolve(distDirectory), linkDirectory);
    } else {
      console.log(`SKIPPING - link to ${linkDirectory} already exists`);
    }
  }
}

const execBuild = gulp.parallel(buildCode, buildStyles, copyFiles);

exports.build = gulp.series(clean, execBuild);
exports.watch = buildWatch;
exports.clean = clean;
exports.link = linkUserData;
