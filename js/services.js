angular.module('cloudrexx.services', [])

    .service('CloudrexxUtils', ['CLOUDREXX_URL_SCHEMA', 'CLOUDREXX_MARKETING_DOMAIN', 'CLOUDREXX_API_PATH', '$localStorage', function(CLOUDREXX_URL_SCHEMA, CLOUDREXX_MARKETING_DOMAIN, CLOUDREXX_API_PATH, $localStorage){
        this.getApiUrlByInstanceName = function(instance) {
            return this.getUrlByInstanceName(instance) + CLOUDREXX_API_PATH;
        };
        this.getUrlByInstanceName = function(instance) {
            return CLOUDREXX_URL_SCHEMA + '://' + instance + '.' + CLOUDREXX_MARKETING_DOMAIN;
        };
        this.getInstances = function() {
            $localStorage.$default({instances: {name:[], data: []}});
            return $localStorage.instances.data;
        };
    }])

    .service('UploadService', ['$http', '$q', 'CloudrexxUtils', 'AccessService', function($http, $q, CloudrexxUtils, AccessService){
        this.getUploadPathsByInstanceName = function(instanceName) {
            var deferred    = $q.defer(),
                session     = AccessService.getSessionByInstanceName(instanceName),
                instanceUrl = CloudrexxUtils.getUrlByInstanceName(instanceName);
            return $http
                    .jsonp(instanceUrl +"/cadmin/index.php?cmd=JsonData&object=MediaBrowser&act=getSources&session="+ session +"&callback=JSON_CALLBACK")
                    .then(function(response){
                        if (response.status === 'error') {
                            deferred.reject(response.message);
                            return;
                        }
                        deferred.resolve(response.data);
                    }, function(error) {
                        deferred.reject('Error occured. try after sometime');
                    }), deferred.promise;
        };
    }])

    .service('AccessService', ["$http", "$q", "$localStorage", "CloudrexxUtils", function($http, $q, $localStorage, CloudrexxUtils) {
        //Generate authentication cookie using username, password
        this.generateAuthCookie = function (instanceName, username, password) {
            var deferred    = $q.defer(),
                instanceUrl = CloudrexxUtils.getApiUrlByInstanceName(instanceName);
            return $http
                    .jsonp(instanceUrl +"/Login/?username=" + username + "&password=" + password + "&callback=JSON_CALLBACK")
                    .success(function (e) {
                        deferred.resolve(e);
                    }).error(function (e) {
                        deferred.reject(e);
                    }), deferred.promise;
        };
        this.doLogin = function(data) {
            var deferred = $q.defer(),
                AccessService = this;

            return this.generateAuthCookie(data.instance, data.username, data.password)
                        .then(function(response){
                            if (response.status === 'error') {
                                deferred.reject(response.message);
                                return;
                            }
                            var sessionData = {
                                instance: data.instance,
                                session: response.data.session
                            };
                            AccessService.saveInstance(sessionData),
                            deferred.resolve(sessionData);
                        }, function(error) {
                            deferred.reject('Error occured. try after sometime');
                        }), deferred.promise;
        };
        this.saveInstance = function(data) {
            $localStorage.$default({instances: {name:[], data: []}});
            var instances = $localStorage.instances,
                instance  = data.instance,
                index     = instances.name.indexOf(instance),
                instanceData = {name: instance, session: data.session};
            if (index === -1) {
                instances.data.push(instanceData);
                instances.name.push(instance);
            } else {
                instances.data[index] = instanceData;
            }
        };
        this.getSessionByInstanceName = function(instance) {
            $localStorage.$default({instances: {name:[], data: []}});
            var instances = $localStorage.instances,
                index     = instances.name.indexOf(instance);
            if (index !== -1) {
                var objInstance = instances.data[index];
                return objInstance.session;
            }
        };
    }]);
