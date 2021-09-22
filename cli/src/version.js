const packageJson = require('../package.json');

module.exports = {
  logVersion: () => {
    console.log(packageJson.version);
  }
}
