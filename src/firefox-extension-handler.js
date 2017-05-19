'use strict';

var firefoxExtensionHandler = [function () {
    var extensionHandler;

    return {
        config: config,
        isBeingUsed: isBeingUsed,
        $get: ['$q', factory]
    };

    function config(extension) {
        extensionHandler = {
            browser: 'firefox',
            name: extension.name,
            url: extension.url,
            iconUrl: extension.iconUrl
        };
    }

    function isBeingUsed() {
            // Checks if the browser used is Firefox
        return typeof InstallTrigger !== 'undefined';
    }

    function factory($q) {
        extensionHandler.install = function (url) {
            var deferred = $q.defer();
            var installInfo = {};
            url = url || this.url;

            installInfo[this.name] = {
                URL: url,
                toString: function () {
                    return url;
                }
            };

                // As of April 4, 2016. Functions successCallback and errorCallback
                // will not trigger if your site is not whitelisted in MDN, but the
                // problem is they don't allow whitelisting
            window.InstallTrigger.install(installInfo, deferred.resolve, deferred.reject);
            return deferred.promise;
        };

        return extensionHandler;
    }
}];

module.exports = firefoxExtensionHandler;
