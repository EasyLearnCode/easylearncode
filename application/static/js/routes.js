define(['angular', 'app'], function (angular, app) {
    'use strict';

    return app.config(['$routeProvider','$interpolateProvider','$locationProvider', function ($routeProvider, $interpolateProvider, $locationProvider) {
        $routeProvider.when('/xhct', {
            templateUrl: '/static/partials/test.html',
            controller: 'AlertDemoCtrl'
        });
        $routeProvider.when('/', {
            templateUrl: '/static/partials/home.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.when('/admin/feedback', {
            templateUrl: '/static/partials/feedback.html',
            controller: 'FeedbackCtrl'
        });
        //$routeProvider.otherwise({redirectTo: '/'});
        /* change configure to use [[]] to be the interpolation */
        //$interpolateProvider.startSymbol('[[');
        //$interpolateProvider.endSymbol(']]');
         $locationProvider.html5Mode(true);
    }]);

});