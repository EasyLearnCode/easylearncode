require.config({
	paths: {
		'angular' : 'lib/angularjs/angular.min',
        'angular.route' : 'lib/angularjs/angular-route.min',
        'angular.ui.bootstrap': 'lib/angularjs/ui-bootstrap-tpls-0.6.0.min',
        'angular.ui.ace':'lib/angularjs/ui-ace.min',
        'ace':'//cdnjs.cloudflare.com/ajax/libs/ace/1.1.01/ace'
	},
	baseUrl: '/static/js',
	shim: {
		'angular' : {'exports' : 'angular'},
        'angular.route' : ['angular'],
        'angular.ui.bootstrap': ['angular'],
        'angular.ui.ace': ['angular','ace'],
	},
	priority: [
		"angular"
	]
});

// hey Angular, we're bootstrapping manually!
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes'
], function(angular, app) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		$html.addClass('ng-app');
		angular.bootstrap($html, [app['name']]);
	});
});
