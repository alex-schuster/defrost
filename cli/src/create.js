const fs = require('fs-extra');
const path = require('path');
const packageJsonData = require('../project/package.json');

/**
 * Check if a project name is valid.
 */
function nameIsValid(name) {
  const validNameRegex = /^[a-z_][a-z0-9_-]*$/ig;
  if (validNameRegex.test(name)) {
    return true;
  }
  return false;
}

/**
 * Copy the example project into the new project directory.
 */
async function copyExampleProject(name) {
  try {
    await fs.copy(path.join(__dirname, '../project/client'), path.join(process.cwd(), `/${name}/client`));
    await fs.copy(path.join(__dirname, '../project/server'), path.join(process.cwd(), `/${name}/server`));
    await fs.copy(path.join(__dirname, '../project/templates'), path.join(process.cwd(), `/${name}/templates`));
    await fs.copy(path.join(__dirname, '../project/webpack.config.js'), path.join(process.cwd(), `/${name}/webpack.config.js`));
    const generatedPackageJsonData = { ...packageJsonData, name };
    const packageJson = JSON.stringify(generatedPackageJsonData, null, 2);
    fs.writeFile(`./${name}/package.json`, packageJson, 'utf8', (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  createProject: (name) => {
    if (!nameIsValid(name)) {
      console.log('Invalid project name. Project creation failed.');
      process.exit(1);
    }

    const dirPath = path.join(process.cwd(), name);
    fs.access(dirPath, (accessError) => {
      if (accessError) {
        fs.mkdir(dirPath, (mkdirError) => {
          if (mkdirError) {
            console.log(mkdirError);
          } else {
            copyExampleProject(name);
            console.log('Project has been created successfully.');
          }
        });
      } else {
        console.log(`Project creation failed. ${dirPath} already exists.`);
        process.exit(1);
      }
    });
  }
};
