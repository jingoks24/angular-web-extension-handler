# Angular Web Extension Handler
An angular library that handles the checking if extension specified is installed or not, it also allows you to trigger inline installation with the right configuration.

## Getting Started
1. Go to your project directory using your command line tool then install the project using npm.

  ```shell
  npm install angular-web-extension-handler
  ```
2. Include angular.js and angular-web-extension-handler.js to your index page.

  ```html
  <script type="text/javascript" src="angular.js"></script>
  <script type="text/javascript" src="angular-web-extension-handler.js"></script>
  ```
3. Add the ngErrorHandler module to you application.

  ```javascript
  angular.module('myApp', ['ngWebExtensionHandler']);
  ```
4. You can now use the 'webExtensionHandlerProvider' to setup your extension details.

  ```javascript
  angular.module('myApp').config(function (webExtensionHandlerProvider) {
    webExtensionHandlerProvider.config({
      chrome: {
        id: 'chromeExtensionId',
        url: 'https://chrome.google.com/webstore/detail/chromeExtensionId',
        iconUrl: 'chrome-extension://chromeExtensionId/icon.png'
      },
      firefox: {
        name: 'The label that will appear on inline installation popup',
        url: 'https://addons.mozilla.org/firefox/downloads/latest/youraddon',
        iconUrl: 'resource://@youraddon/icon.png'
      }
    });
  });
  ```
5. After the configuration you can now use the 'install' and 'isInstalled' method.

  ```javascript
  angular.module('myApp').controller(function (webExtensionHandler) {
    var vm = this;

    vm.checkIfExtensionIsInstalled = function () {
      webExtensionHandler.isInstalled().then(function () {
        // Already installed
      }, function () {
        // Not yet installed
      });
    };

    // This should be triggered by user gesture, e.g. click
    vm.installExtension = function () {
      // If firefox is the browser being used the callback will not be called
      // because your site should be whitelisted to the MDN
      webExtensionHandler.install().then(function () {
        // Installed successfully
      }, function () {
        // User cancelled
      });
    };
  });
  ```

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/TMJPEngineering/angular-web-extension-handler/blob/master/LICENSE)
file for details

## TODO
- Unit tests
- Support for other browsers
