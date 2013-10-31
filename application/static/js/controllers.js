define(['angular', 'services'], function (angular) {
    'use strict';

    return angular.module('myApp.controllers', ['myApp.services'])
        // Sample controller where service is being used
        .controller('HomeCtrl', ['$scope', function ($scope) {
            alert("Hello");
        }])
        .controller('AlertDemoCtrl', ['$scope', function ($scope) {
            $scope.alerts = [
                { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
                { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
            ];

            $scope.addAlert = function () {
                $scope.alerts.push({msg: "Another alert!"});
            };

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
        }])
        .controller('CarouselDemoCtrl', ['$scope', function ($scope) {
            $scope.myInterval = 5000;
            var slides = $scope.slides = [];
            $scope.addSlide = function () {
                var newWidth = 200 + ((slides.length + (25 * slides.length)) % 150);
                slides.push({
                    image: 'http://placekitten.com/' + newWidth + '/200',
                    text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' +
                        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
            };
            for (var i = 0; i < 4; i++) {
                $scope.addSlide();
            }
        }])

});