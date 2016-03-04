angular.module('cloudrexx', ['ionic', 'ui.bootstrap', 'pascalprecht.translate', 'ngStorage', 'cloudrexx.controllers', 'cloudrexx.services', 'cloudrexx.config'])

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
    })

    /**
    * Configure app
    *
    * @param $stateProvider       Interfaces to declare states for your app.
    * @param $urlRouterProvider   Watching the $location change
    * @param $ionicConfigProvider Configuration phase of the app
    */
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$translateProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider, $httpProvider) {
        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.scrolling.jsScrolling(true);

        $httpProvider.defaults.headers.common["Check-CSRF"] = 'false';

        for (lang in translations) {
            $translateProvider.translations(lang, translations[lang]);
        }

        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: "/home",
                views: {
                    menuContent: {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.manageSites', {
                url: "/manageSites",
                views: {
                    menuContent: {
                        templateUrl: 'templates/manageSites.html',
                        controller: 'ManageSitesCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/app/home');
    }]);
