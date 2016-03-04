angular.module('cloudrexx.controllers', [])

    .controller('AppCtrl', ['$scope', '$ionicModal', '$ionicLoading', '$state', '$filter', 'CloudrexxUtils', 'AccessService', function($scope, $ionicModal, $ionicLoading, $state, $filter, CloudrexxUtils, AccessService) {
        $scope.instances = CloudrexxUtils.getInstances();

        var $translate  = $filter('translate');
        $scope.instance = {instanceName: '', username: '', password: ''};

        $ionicModal.fromTemplateUrl('templates/addWebsite.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addWebsiteModal = modal;
            });

        $scope.addWebsite = function() {
            $ionicLoading.show({
                template: $translate('saving_data')
            });

            var data = {
                instance: $scope.instance.instanceName,
                username: $scope.instance.username,
                password: $scope.instance.password
            };

            AccessService
                .doLogin(data)
                .then(function() {
                    $state.go("app.manageSites"),
                    $scope.instances = CloudrexxUtils.getInstances(),
                    $ionicLoading.hide(),
                    $scope.addWebsiteModal.hide();
                }, function(n) {
                    $scope.error = n, $ionicLoading.hide();
                });
        };
        $scope.showAddWebsiteModal = function() {
            // reset instance values
            $scope.instance = {instanceName: '', username: '', password: ''};
            $scope.addWebsiteModal.show();
        };
        $scope.closeAddWebsiteModal = function() {
            $scope.addWebsiteModal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.addWebsiteModal.remove();
        });
    }])

    .controller('HomeCtrl', ['$scope', '$ionicModal', 'UploadService', function($scope, $ionicModal, UploadService) {
        $scope.upload    = {instance: 0, path: ''};
        $scope.selectedInstanceUploadPaths = [];

        $ionicModal.fromTemplateUrl('templates/upload.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.uploadModal = modal;
            });
        $scope.showUploadModal = function() {
            $scope.loadUploadPaths();
            $scope.uploadModal.show();
        };
        $scope.closeAddWebsiteModal = function() {
            $scope.uploadModal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.uploadModal.remove();
        });

        $scope.loadUploadPaths = function() {
            var objInstance = $scope.instances[$scope.upload.instance],
                instance    = objInstance.name;

            $scope.selectedInstanceUploadPaths = UploadService.getUploadPathsByInstanceName(instance);
        };

        $scope.chooseImages = function() {
            window.imagePicker.getPictures(
                function(results) {
                    alert('Number of pictures selected ' + results.length);
                },
                function (error) {},
                {
                    maximumImagesCount: 10,
                    quality: 80
                }
            );
        };
    }])

    .controller('ManageSitesCtrl', ['$scope', '$localStorage', function($scope, $localStorage) {
        $localStorage.$default({instances: {name:[], data: []}});
        $scope.instances = $localStorage.instances.data;
    }]);
