(function () {

// 2014-02-28T04:29:28.222000
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/;

    JSON._parse = JSON.parse;
    JSON.parse = function (json) {
        return JSON._parse(json, function (key, value) {
            if (typeof value === 'string') {
                if (reISO.exec(value)) {
                    return new Date(value);
                }
            }
            return value;
        });
    };
    if (window.jQuery !== undefined) {
        jQuery.parseJSON = JSON.parse;
        jQuery.ajaxSettings.converters["text json"] = JSON.parse;
    }

})();
angular.module("services.utility", []);
angular.module("easylearncode.admin.core", ["ngRoute", "ngResource", "services.utility", "angularjsFormBuilder", "ui.bootstrap"])
    .service("api", ["$resource", function ($resource) {
        this.Model = $resource('/api/:type/:id');

    }]).run(function run($http, csrf_token) {
        $http.defaults.headers.post['X-CSRFToken'] = csrf_token;
    })
    .directive('ngFileSelect', [ '$parse', '$http', '$timeout', function ($parse, $http, $timeout) {
        return function (scope, elem, attr) {
            var fn = $parse(attr['ngFileSelect']);
            elem.bind('change', function (evt) {
                var files = [], fileList, i;
                fileList = evt.target.files;
                if (fileList != null) {
                    for (i = 0; i < fileList.length; i++) {
                        files.push(fileList.item(i));
                    }
                }
                $timeout(function () {
                    fn(scope, {
                        $files: files,
                        $event: evt
                    });
                });
            });
            elem.bind('click', function () {
                this.value = null;
            });
        };
    } ])
    .config(["$locationProvider",
        function ($locationProvider) {
            $locationProvider.html5Mode(!1);
            $locationProvider.hashPrefix("!")
        }
    ]);
;
angular.module("easylearncode.admin.home", ["easylearncode.admin.core"]);
angular.module("easylearncode.admin.course", ["easylearncode.admin.core"])
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "template/angular/admin/courses/courses.html",
                controller: "CourseAdminCtrl"
            })
            .when("/exercise/:courseId",
            {
                templateUrl: "template/angular/admin/courses/exercise.html",
                controller: "ExerciseAdminCtrl"
            })
            .otherwise({redirectTo: "/"})
    }])
    .controller("CourseAdminCtrl", ["$scope", "api", "$modal", "$http" , function ($scope, api, $modal, $http) {
        $scope.courses = api.Model.query({type: 'courses', page_size: 10, order: '-created'});
        var addForm = {
            "form_id": 1,
            "form_name": "Add Course",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "description",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (course) {

            api.Model.delete({type: 'courses', id: course.Id}, function () {
                $scope.courses = _.without($scope.courses, course);
            });
        }
        $scope.showAddModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                course = {}
                _.each(addForm.form_fields, function (ele) {
                    course[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'courses'}, course, function (data) {
                    $scope.courses.push(data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (course) {
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit Course";
            _.each(editForm.form_fields, function (field) {
                field.field_value = course[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                course_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    course_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'courses', id: course.Id}, course_tmp, function (data) {
                    //$scope.courses.push(data);
                    course = _.extend(course, course_tmp);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {

            $scope.form = form;

            $scope.ok = function (data) {
                $modalInstance.close($scope.form);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        $scope.uploadFile = function (files, course) {
            $http.get('/api/files/course/' + course.Id + '/img').success(function (data) {
                var fd = new FormData();
                fd.append("file", files[0]);
                $http.post(data.upload_url, fd, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (data) {
                    course.img = data.image_url;
                }).error();
            })

        };

    }])
    .controller("ExerciseAdminCtrl", ["$scope", "api", "$routeParams", '$modal', function ($scope, api, $routeParams, $modal) {
        //console.log($routeParams)
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true});
        var addForm = {
            "form_id": 1,
            "form_name": "Add Course",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "description",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (course) {

            api.Model.delete({type: 'courses', id: course.Id}, function () {
                $scope.courses = _.without($scope.courses, course);
            });
        }
        $scope.showAddModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                course = {}
                _.each(addForm.form_fields, function (ele) {
                    course[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'exercises'}, course, function (data) {
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function(course){
                        course.exercise_keys.push(data.Id);
                        api.Model.save({type: 'courses', id: course.Id},course,function(){
                            $scope.course.exercise_keys.push(data);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (course) {
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit Course";
            _.each(editForm.form_fields, function (field) {
                field.field_value = course[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                course_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    course_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'courses', id: course.Id}, course_tmp, function (data) {
                    //$scope.courses.push(data);
                    course = _.extend(course, course_tmp);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {

            $scope.form = form;

            $scope.ok = function (data) {
                $modalInstance.close($scope.form);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }])