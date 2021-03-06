// Generated by CoffeeScript 1.12.6

/*
Copyright 2017 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
module.exports = {
  signature: 'local stop [deviceIp]',
  description: 'Stop a running container on a resinOS device',
  help: '\nExamples:\n\n	$ resin local stop\n	$ resin local stop --app-name myapp\n	$ resin local stop --all\n	$ resin local stop 192.168.1.10\n	$ resin local stop 192.168.1.10 --app-name myapp',
  options: [
    {
      signature: 'all',
      boolean: true,
      description: 'stop all containers'
    }, {
      signature: 'app-name',
      parameter: 'name',
      description: 'name of container to stop',
      alias: 'a'
    }
  ],
  root: true,
  action: function(params, options, done) {
    var Promise, ResinLocalDockerUtils, chalk, config, filterOutSupervisorContainer, forms, ref, ref1, selectContainerFromDevice;
    Promise = require('bluebird');
    chalk = require('chalk');
    ref = require('resin-sync'), forms = ref.forms, config = ref.config, ResinLocalDockerUtils = ref.ResinLocalDockerUtils;
    ref1 = require('./common'), selectContainerFromDevice = ref1.selectContainerFromDevice, filterOutSupervisorContainer = ref1.filterOutSupervisorContainer;
    return Promise["try"](function() {
      if (params.deviceIp == null) {
        return forms.selectLocalResinOsDevice();
      }
      return params.deviceIp;
    }).then((function(_this) {
      return function(deviceIp) {
        var ref2, ref3, ymlConfig;
        _this.deviceIp = deviceIp;
        _this.docker = new ResinLocalDockerUtils(_this.deviceIp);
        if (options.all) {
          return _this.docker.docker.listContainersAsync({
            all: false
          }).filter(filterOutSupervisorContainer).then(function(containers) {
            return Promise.map(containers, function(arg) {
              var Id, Names;
              Names = arg.Names, Id = arg.Id;
              console.log(chalk.yellow.bold("* Stopping container " + Names[0]));
              return _this.docker.stopContainer(Id);
            });
          });
        }
        ymlConfig = config.load();
        _this.appName = (ref2 = options['app-name']) != null ? ref2 : (ref3 = ymlConfig['local_resinos']) != null ? ref3['app-name'] : void 0;
        return _this.docker.checkForRunningContainer(_this.appName).then(function(isRunning) {
          if (!isRunning) {
            return selectContainerFromDevice(_this.deviceIp, true);
          }
          console.log(chalk.yellow.bold("* Stopping container " + _this.appName));
          return _this.appName;
        }).then(function(runningContainerName) {
          return _this.docker.stopContainer(runningContainerName);
        });
      };
    })(this));
  }
};
