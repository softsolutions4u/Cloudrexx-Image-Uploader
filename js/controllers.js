angular.module('cloudrexx.controllers', [])

    .controller('AppCtrl', ['$scope', '$ionicModal', '$ionicLoading', '$state', '$filter', '$localStorage', 'AccessService', function($scope, $ionicModal, $ionicLoading, $state, $filter, $localStorage, AccessService) {
        var $translate  = $filter('translate');
        $scope.instance = {instanceName: '', username: '', password: ''};

        $ionicModal.fromTemplateUrl('templates/addWebsite.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
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
                    $state.go("app.manageSites"), $ionicLoading.hide(), $scope.modal.hide();
                }, function(n) {
                    $scope.error = n, $ionicLoading.hide();
                });
        };
        $scope.showAddWebsiteModal = function() {
            // reset instance values
            $scope.instance = {instanceName: '', username: '', password: ''};
            $scope.modal.show();
        };
        $scope.closeAddWebsiteModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
    }])

    .controller('HomeCtrl', ['$scope', function($scope) {
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
