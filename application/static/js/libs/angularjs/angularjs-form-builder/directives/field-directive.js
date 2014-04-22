'use strict';

angular.module('angularjsFormBuilder').directive('fieldDirective', function ($http, $compile) {

        var getTemplateUrl = function(field) {
            var type = field.field_type;
            var templateUrl = '';

            switch(type) {
                case 'textfield':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/textfield.html';
                    break;
                case 'email':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/email.html';
                    break;
                case 'textarea':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/textarea.html';
                    break;
                case 'checkbox':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/checkbox.html';
                    break;
                case 'date':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/date.html';
                    break;
                case 'dropdown':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/dropdown.html';
                    break;
                case 'hidden':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/hidden.html';
                    break;
                case 'password':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/password.html';
                    break;
                case 'radio':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/radio.html';
                    break;
                case 'code':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/code.html';
                    break;
                case 'wysiwyg':
                    templateUrl = '/application/js/libs/angularjs/angularjs-form-builder/views/field/wysiwyg.html';
                    break;
            }
            return templateUrl;
        }

        var linker = function(scope, element) {
            // GET template content from path
            var templateUrl = getTemplateUrl(scope.field);
            $http.get(templateUrl).success(function(data) {
                element.html(data);
                $compile(element.contents())(scope);
            });
        }

        return {
            template: '<div>{{field}}</div>',
            restrict: 'E',
            scope: {
                field:'='
            },
            link: linker
        };
  });
