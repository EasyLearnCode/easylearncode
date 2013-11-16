define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angular.route',
    'angular.ui.bootstrap',
    'angular.ui.ace'
	], function (angular, filters, services, directives, controllers) {
		'use strict';

		return angular.module('myApp', [
			'ngRoute',
            'ui.bootstrap',
            'ui.ace',
			'myApp.controllers',
			'myApp.filters',
			'myApp.services',
			'myApp.directives'
		]);
});
