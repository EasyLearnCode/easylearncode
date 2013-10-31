define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angular.route',
    'angular.ui.bootstrap'
	], function (angular, filters, services, directives, controllers) {
		'use strict';

		return angular.module('myApp', [
			'ngRoute',
            'ui.bootstrap',
			'myApp.controllers',
			'myApp.filters',
			'myApp.services',
			'myApp.directives'
		]);
});
