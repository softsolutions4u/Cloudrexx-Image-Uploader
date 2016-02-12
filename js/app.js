angular.module('cloudrexx', ['ionic'])

    .constant('CLOUDREXX_API_URL', 'http://coludrexx.just-testing.net/Api')

    .controller('UploadCtrl', ['$scope', 'UploadService', function ($scope, UploadService) {
        $scope.uploadImages = function() {
            window.imagePicker.getPictures(
                function(results) {
                    for (var i = 0; i < results.length; i++) {
                        UploadService.upload(results[i]);
                    }
                },
                function (error) {},
                {
                    maximumImagesCount: 10,
                    quality: 80
                }
            );
        };
    }])

    .service('UploadService', ['CLOUDREXX_API_URL', function(CLOUDREXX_API_URL) {
        this.success = function success(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
        };

        this.fail = function fail(error) {
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        };

        this.upload = function(fileUrl) {
            var uri = encodeURI(CLOUDREXX_API_URL + '/Media/Upload/1');

            var options = new FileUploadOptions();
                options.fileKey="test_file_name";

            var ft = new FileTransfer();
            ft.upload(fileUrl, uri, this.success, this.fail, options);
        };
    }])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
