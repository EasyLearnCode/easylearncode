define(['angular', 'app'], function (angular, app) {
    'use strict';

    return app.config(['$routeProvider', '$interpolateProvider', '$locationProvider', function ($routeProvider, $interpolateProvider, $locationProvider) {
        var redirect = function (skip, url, obj) {
            //console.log("Redirecting to ", arguments);
            //
            var str = "";
            for (var key in obj) {
                if (str != "") {
                    str += "&";
                }
                str += key + "=" + obj[key];
            };
            window.location.href = url+'?'+str;
        };
        $locationProvider.html5Mode(true);
        $routeProvider.when('/xhct', {
            templateUrl: '/static/partials/test.html',
            controller: 'AlertDemoCtrl'
        });
        $routeProvider.when('/', {
            templateUrl: '/static/partials/home.html',
            controller: 'HomeCarouselCtrl',
            resolve: {
                style: function () {
                    $('head').append('<link href="/static/css/carousel.css" rel="stylesheet">');

                }
            }
        });
//        $routeProvider.when('/admin/feedback', {
//            templateUrl: '/static/partials/feedback.html',
//            controller: 'FeedbackCtrl'
//        });
        $routeProvider.when('/contest',{
            templateUrl:'/static/partials/contest.html',
            controller:'ContestCtrl',
            resolve: {
                style: function () {
                    $('head').append('<link href="/static/css/contest.css" rel="stylesheet">');

                }
            }
        });
        $routeProvider.when('/_ah/:action', {
            redirectTo: redirect
        });
        //$routeProvider.otherwise({redirectTo: '/'});
        /* change configure to use [[]] to be the interpolation */
        //$interpolateProvider.startSymbol('[[');
        //$interpolateProvider.endSymbol(']]');

    }]);

});