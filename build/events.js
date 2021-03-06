// Generated by CoffeeScript 1.12.6
var Mixpanel, Promise, Raven, _, packageJSON, resin;

_ = require('lodash');

Mixpanel = require('mixpanel');

Raven = require('raven');

Promise = require('bluebird');

resin = require('resin-sdk-preconfigured');

packageJSON = require('../package.json');

exports.getLoggerInstance = _.memoize(function() {
  return resin.models.config.getMixpanelToken().then(Mixpanel.init);
});

exports.trackCommand = function(capitanoCommand) {
  var capitanoStateGetMatchCommandAsync;
  capitanoStateGetMatchCommandAsync = Promise.promisify(require('capitano').state.getMatchCommand);
  return Promise.props({
    resinUrl: resin.settings.get('resinUrl'),
    username: resin.auth.whoami(),
    mixpanel: exports.getLoggerInstance()
  }).then(function(arg) {
    var mixpanel, resinUrl, username;
    username = arg.username, resinUrl = arg.resinUrl, mixpanel = arg.mixpanel;
    return capitanoStateGetMatchCommandAsync(capitanoCommand.command).then(function(command) {
      Raven.mergeContext({
        user: {
          id: username,
          username: username
        }
      });
      return mixpanel.track("[CLI] " + (command.signature.toString()), {
        distinct_id: username,
        argv: process.argv.join(' '),
        version: packageJSON.version,
        node: process.version,
        arch: process.arch,
        resinUrl: resinUrl,
        platform: process.platform,
        command: capitanoCommand
      });
    });
  });
};
