angular.module('cloudrexx.services', [])
    
    .service('CloudrexxUtils', ['CLOUDREXX_URL_SCHEMA', 'CLOUDREXX_MARKETING_DOMAIN', 'CLOUDREXX_API_PATH', function(CLOUDREXX_URL_SCHEMA, CLOUDREXX_MARKETING_DOMAIN, CLOUDREXX_API_PATH){
        this.getApiUrlByInstanceName = function(instance) {
            return CLOUDREXX_URL_SCHEMA + '://' + instance + CLOUDREXX_MARKETING_DOMAIN + CLOUDREXX_API_PATH;
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
    }]);