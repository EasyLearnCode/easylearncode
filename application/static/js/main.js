require.config({
	paths: {
		'angular' : 'lib/angular.min',
        'angular.route' : 'lib/angular-route.min',
        'angular.ui.bootstrap': 'lib/ui-bootstrap-tpls-0.6.0.min'
	},
	baseUrl: '/static/js',
	shim: {
		'angular' : {'exports' : 'angular'},
        'angular.route' : ['angular'],
        'angular.ui.bootstrap': ['angular']
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
