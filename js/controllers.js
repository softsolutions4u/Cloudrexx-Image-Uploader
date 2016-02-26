angular.module('cloudrexx.controllers', [])

    .controller('AppCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {

        $ionicModal.fromTemplateUrl('templates/addWebsite.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });

        $scope.showAddWebsiteModal = function() {
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

    .controller('ManageSitesCtrl', ['$scope', function($scope) {
        $scope.items = [];

        for (var i = 1; i <= 15; i++) {
          $scope.items.push("Instance " + i);
        }
    }]);
