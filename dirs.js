'use strict';

const path = require('path');

const homeDir = path.join(__dirname, '../');

const dirs = {

  PLUGINS: path.join(homeDir, 'app', 'api'),
  CONFIG: path.join(homeDir, 'config'),
  POLICIES: path.join(homeDir, 'app', 'policies'),
  METHODS: path.join(homeDir, 'app', 'methods'),
  HOME_DIR: homeDir

};

global.DIRS = dirs;