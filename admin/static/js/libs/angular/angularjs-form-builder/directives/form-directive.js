'use strict';

angular.module('angularjsFormBuilder').directive('formDirective', function () {
    return {
        controller: function($scope){
            $scope.ok = function(){
                $scope.$parent.$parent.ok();
            }
            $scope.cancel = function(){
                $scope.$parent.$parent.cancel();
            }
        },
        templateUrl: '/admin/js/libs/angular/angularjs-form-builder/views/form/form.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
