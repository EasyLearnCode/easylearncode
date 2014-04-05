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
angular.module("easylearncode.admin.core", ["ngRoute", "ngResource", "services.utility", "angularjsFormBuilder", "ui.bootstrap", "ng-breadcrumbs", "ngTable"])
    .service("api", ["$resource", function ($resource) {
        this.Model = $resource('/api/:type/:id');

    }])
    .service("formModalService", ["$modal", function ($modal) {
        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {

            $scope.form = form;

            $scope.ok = function (data) {
                $modalInstance.close($scope.form);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        this.showFormModal = function (form, successCallback, dismissCallback) {
            var modalInstance = $modal.open({
                template: ' <form-directive form="form"></form-directive>',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return form;
                    }
                }
            });
            modalInstance.result.then(successCallback, dismissCallback);
        }
    }])
    .service("formService", function(){
        var cleanData, parseData;
        this.setCleanDataFunc = function(cleanDataFunc){
            cleanData = cleanDataFunc;
        }
        this.setParseDataFunc = function(parseDataFunc){
            parseData = parseDataFunc;
        }
        this.getDataFromForm = function(form){
            if(cleanData){
                _form = cleanData(form);
            }else{
                _form = angular.copy(form);
            }
            var data = {}
            _.each(_form.form_fields, function (field) {
                data[field.field_name] = field.field_value;
            });
            return data;
        }
        this.fillFormData = function(form,data){
            if(parseData){
                _data = parseData(data);
            }else{
                _data = angular.copy(data);
            }
            _.each(form.form_fields, function (field) {
                field.field_value = _data[field.field_name];
            });
        }
    })
    .run(function run($http, csrf_token) {
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
    ])
    .controller("BreadCrumbsCtrl",['$scope', 'breadcrumbs', function($scope, breadcrumbs) {
        $scope.breadcrumbs = breadcrumbs;
    }]);
angular.module("easylearncode.admin.home", ["easylearncode.admin.core"]);
angular.module("easylearncode.admin.course", ["easylearncode.admin.core", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster", "info.vietnamcode.nampnq.videogular.plugins.youtube", "info.vietnamcode.nampnq.videogular.plugins.quiz"])
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "template/angular/courses/courses.html",
                controller: "CourseAdminCtrl",
                label: 'Courses'
            })
            .when("/:courseId/exercise",
            {
                templateUrl: "template/angular/courses/exercise.html",
                controller: "ExerciseAdminCtrl",
                label: 'Exercise'
            })
            .when("/:courseId/exercise/:exerciseId/item",
            {
                templateUrl: "template/angular/courses/exercise_item.html",
                controller: "ExerciseItemAdminCtrl",
                label: 'Exercise Item'
            })
            .when("/:courseId/exercise/:exerciseId/item/:itemId/project",
            {
                templateUrl: "template/angular/courses/exercise_project.html",
                controller: "ExerciseProjectAdminCtrl",
                label: 'Exercise Project'
            })
            .when("/:courseId/exercise/:exerciseId/item/:itemId/project/:projectId/checkpoint",
            {
                templateUrl: "template/angular/courses/exercise_checkpoint.html",
                controller: "ExerciseCheckpointAdminCtrl",
                label: 'Exercise Checkpoint'
            })
            .when("/:courseId/lessons",
            {
                templateUrl: "template/angular/courses/lesson.html",
                controller: "LessonAdminCtrl",
                label: 'Lessons'
            })
            .when("/:courseId/lessons/:lessonId/lectures",
            {
                templateUrl: "template/angular/courses/lecture.html",
                controller: "LectureAdminCtrl",
                label: 'Lectures'
            })
            .when("/:courseId/lessons/:lessonId/lectures/:lectureId/questions",
            {
                templateUrl: "template/angular/courses/question.html",
                controller: "QuestionAdminCtrl",
                label: 'Questions'
            })
            .otherwise({redirectTo: "/"})
    }])
    .controller("CourseAdminCtrl", ["$scope", "api", "formModalService", "$http", "formService", function ($scope, api, formModalService, $http, formService) {
        $scope.courses = api.Model.query({type: 'courses', page_size: 10, order: '-created'});
        var form = {
            "form_id": 1,
            "form_name": "Add Course",
            "form_fields": [
                {
                  "field_title": "Key",
                  "field_type": "textfield",
                  "field_value": "",
                  "field_required": true,
                  "field_name": "adminKey"
                },
                {
                  "field_title": "Title",
                  "field_type": "textfield",
                  "field_value": "",
                  "field_required": true,
                  "field_name": "title"
                },
                {
                  "field_id": 3,
                  "field_title": "Level",
                  "field_type": "dropdown",
                  "field_value": "Beginning",
                  "field_required": true,
                  "field_name": "level",
                  "field_options": [
                    {
                      "option_title": "Beginning",
                      "option_value": "Beginning"
                    },
                    {
                      "option_title": "Intermediate",
                      "option_value": "Intermediate"
                    },
                    {
                      "option_title": "Advanced",
                      "option_value": "Advanced"
                    },
                    {
                      "option_title": "Other",
                      "option_value": "Other"
                    }
                  ]
                },
                {
                  "field_title": "Short description",
                  "field_type": "textfield",
                  "field_value": "",
                  "field_required": true,
                  "field_name": "short_desc"
                },
                {
                  "field_title": "Description",
                  "field_type": "textarea",
                  "field_value": "",
                  "field_required": true,
                  "field_name": "long_desc"
                },
                {
                  "field_title": "Tag",
                  "field_type": "textfield",
                  "field_value": "",
                  "field_required": true,
                  "field_name": "tags"
                },
                {
                  "field_title": "Available",
                  "field_type": "checkbox",
                  "field_value": false,
                  "field_name": "is_available"
                },
                {
                  "field_title": "New",
                  "field_type": "checkbox",
                  "field_value": true,
                  "field_name": "is_new"
                }
            ]
        }
        var cleanData = function(form){
           var _form = angular.copy(form);
           _.each(_form.form_fields, function (field) {
               if(field.field_name == "tags"){
                    field.field_value = field.field_value.split(',');
               }
               if(field.field_name == "is_available" || field.field_name == "is_new"){
                    field.field_value = field.field_value?true:false;
               }
           });
           return _form;
        }
        var parseData = function(data){
            var _data = angular.copy(data);
            for (prop in _data) {
               if(prop == "tags"){
                   _data[prop] = _data[prop].join(",");
               }
            };
            return _data;
        }
        formService.setCleanDataFunc(cleanData);
        formService.setParseDataFunc(parseData);
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'courses'}, data, function (result) {
                    $scope.courses.push(result);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Course";
            editForm.form_fields = _.reject(editForm.form_fields,function(field){ return field.field_name == "adminKey"});
            formService.fillFormData(editForm, obj);
            formModalService.showFormModal(editForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'courses', id: obj.Id}, data, function (result) {
                    obj = _.extend(obj, data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
        $scope.delete = function (obj) {
            api.Model.delete({type: 'courses', id: obj.Id}, function () {
                $scope.courses = _.without($scope.courses, obj);
            });
        }
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
    .controller("ExerciseAdminCtrl", ["$scope", "api", "$routeParams", 'formModalService', 'formService', function ($scope, api, $routeParams, formModalService, formService) {
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true, depth:1});
        var form = {
            "form_id": 1,
            "form_name": "Add Exercise",
            "form_fields": [
                {
                    "field_title": "Title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "title"
                },
                {
                    "field_title": "Description",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "description"
                },
                {
                    "field_title": "Index",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "index"
                }
            ]
        }
        var cleanData = function(form){
           var _form = angular.copy(form);
           _.each(_form.form_fields, function (field) {
               if(field.field_name == "index"){
                    field.field_value = parseInt(field.field_value);
               }
           });
           return _form;
        }
        formService.setCleanDataFunc(cleanData);
        $scope.delete = function (obj) {
            api.Model.delete({type: 'exercises', id: obj.Id}, function () {
                api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                    course.exercise_keys.pop(obj.Id);
                    api.Model.save({type: 'courses', id: course.Id}, course, function () {
                        $scope.courses = _.without($scope.courses, obj);
                    });
                });
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercises'}, data, function (result) {
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                        delete course['img'];
                        course.exercise_keys.push(result.Id);
                        api.Model.save({type: 'courses', id: course.Id}, course, function () {
                            $scope.course.exercise_keys.push(result);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Course";
            formService.fillFormData(editForm, obj);
            formModalService.showFormModal(editForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercises', id: obj.Id}, data, function (result) {
                    obj = _.extend(obj, data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }])
    .controller("ExerciseItemAdminCtrl", ["$scope", "api", "formModalService", "$http", "formService", "$routeParams", function ($scope, api, formModalService, $http, formService, $routeParams) {
        $scope.course = {Id: $routeParams.courseId};
        $scope.exercise = api.Model.get({type:"exercises", id:$routeParams.exerciseId, recurse:true, depth:1});
        var form = {
            "form_id": 1,
            "form_name": "Add Exercise Item",
            "form_fields": [
                {
                    "field_title": "Title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "title"
                },
                {
                    "field_title": "Description",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "description"
                },
                {
                    "field_title": "Success message",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "success"
                },
                {
                    "field_title": "Index",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "index"
                }
            ]
        }
        var cleanData = function(form){
           var _form = angular.copy(form);
           _.each(_form.form_fields, function (field) {
               if(field.field_name == "index"){
                    field.field_value = parseInt(field.field_value);
               }
           });
           return _form;
        }
        formService.setCleanDataFunc(cleanData);
        $scope.delete = function (obj) {
            api.Model.delete({type: 'exercise_items', id: obj.Id}, function () {
                api.Model.get({type: 'exercises', id: $routeParams.exerciseId}, function (exercise) {
                    exercise.items.pop(obj.Id);
                    api.Model.save({type: 'exercises', id: $routeParams.exerciseId}, exercise, function () {
                        $scope.exercise.items = _.without($scope.exercise.items, obj);
                    });
                });
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercise_items'}, data, function (result) {
                    api.Model.get({type: 'exercises', id: $routeParams.exerciseId}, function (exercise) {
                        exercise.items.push(result.Id);
                        api.Model.save({type: 'exercises', id: $routeParams.exerciseId}, exercise, function () {
                            $scope.exercise.items.push(result);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Exercise Item";
            formService.fillFormData(editForm, obj);
            formModalService.showFormModal(editForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercise_items', id: obj.Id}, data, function (result) {
                    obj = _.extend(obj, data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }])
    .controller("ExerciseProjectAdminCtrl", ["$scope", "api", "formModalService", "$http", "formService", "$routeParams", function ($scope, api, formModalService, $http, formService, $routeParams) {
        $scope.course = {Id:$routeParams.courseId};
        $scope.exercise = {Id: $routeParams.exerciseId}
        $scope.exercise_item = api.Model.get({type:"exercise_items", id:$routeParams.itemId, recurse:true, depth:1});
        var form = {
            "form_id": 1,
            "form_name": "Add Exercise Project",
            "form_fields": [
                {
                    "field_title": "Title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "title"
                },
                {
                    "field_title": "Index",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "index"
                },
                {
                    "field_title": "Language",
                    "field_type": "dropdown",
                    "field_value": "Python",
                    "field_required": true,
                    "field_name": "language",
                    "field_options": [
                        {
                            "option_title": "Python",
                            "option_value": "Python"
                        },
                        {
                            "option_title": "Javascript",
                            "option_value": "Javascript"
                        },
                        {
                            "option_title": "CPP",
                            "option_value": "CPP"
                        }
                    ]
                }
            ]
        }
        var cleanData = function(form){
           var _form = angular.copy(form);
           _.each(_form.form_fields, function (field) {
               if(field.field_name == "index"){
                    field.field_value = parseInt(field.field_value);
               }
           });
           return _form;
        }
        formService.setCleanDataFunc(cleanData);
        $scope.delete = function (obj) {
            api.Model.delete({type: 'exercise_projects', id: obj.Id}, function () {
                api.Model.get({type: 'exercise_items', id: $routeParams.itemId}, function (exercise_item) {
                    exercise_item.projects.pop(obj.Id);
                    api.Model.save({type: 'exercise_items', id: $routeParams.itemId}, exercise_item, function () {
                        $scope.exercise_item.projects = _.without($scope.exercise_item.projects, obj);
                    });
                });
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercise_projects'}, data, function (result) {
                    api.Model.get({type: 'exercise_items', id: $routeParams.itemId}, function (exercise_item) {
                        exercise_item.projects.push(result.Id);
                        api.Model.save({type: 'exercise_items', id: $routeParams.itemId}, exercise_item, function () {
                            $scope.exercise_item.projects.push(result);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Exercise Project";
            formService.fillFormData(editForm, obj);
            formModalService.showFormModal(editForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type: 'exercise_projects', id: obj.Id}, data, function (result) {
                    obj = _.extend(obj, data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }])
    .controller("ExerciseCheckpointAdminCtrl", ["$scope", "api", "formModalService", "$http", "formService", "$routeParams", "$q", "$timeout", function ($scope, api, formModalService, $http, formService, $routeParams, $q, $timeout) {
        $scope.course = {Id:$routeParams.courseId};
        $scope.exercise = {Id: $routeParams.exerciseId}
        $scope.exercise_item = {Id: $routeParams.itemId}
        $scope.exercise_project = api.Model.get({type:"exercise_projects", id: $routeParams.projectId, recurse:true, depth:2});
        var form;
        $scope.exercise_project.$promise.then(function(){
            form = {
                    "form_id": 1,
                    "form_name": "Add Exercise Checkpoint",
                    "form_fields": [
                        {
                            "field_title": "Title",
                            "field_type": "textfield",
                            "field_value": "",
                            "field_required": true,
                            "field_name": "title"
                        },
                        {
                            "field_title": "Index",
                            "field_type": "textfield",
                            "field_value": "",
                            "field_required": true,
                            "field_name": "index"
                        },
                        {
                            "field_title": "Entry",
                            "field_type": "textarea",
                            "field_value": "",
                            "field_required": true,
                            "field_name": "entry"
                        },
                        {
                            "field_title": "Instruction",
                            "field_type": "textarea",
                            "field_value": "",
                            "field_required": true,
                            "field_name": "instruction"
                        },
                        {
                            "field_title": "Hint",
                            "field_type": "textarea",
                            "field_value": "",
                            "field_required": false,
                            "field_name": "hint"
                        },
                        {
                            "field_title": "Test Function",
                            "field_type": "code",
                            "field_value": "def easylearncode_validate(result,code,output):\n    #validate code in here\n    return True" ,
                            "field_required": true,
                            "field_name": "test_functions",
                            "field_language": $scope.exercise_project.language.toLowerCase()

                        },
                        {
                            "field_title": "Default File",
                            "field_type": "code",
                            "field_value": "",
                            "field_required": true,
                            "field_name": "_default_files",
                            "field_language": "python"
                        }
                    ]
                }
        })
        var cleanData = function(form){
           var _form = angular.copy(form);
           _.each(_form.form_fields, function (field) {
               if(field.field_name == "index"){
                    field.field_value = parseInt(field.field_value);
               }
           });
           return _form;
        }
        var parseData = function(data){
            var _data = angular.copy(data);
            for (prop in _data) {
               if(prop == "default_files" && _data["default_files"].length>0){
                    _data['_default_files'] = _data["default_files"][0].content;
               }
            };
            return _data;
        }
        formService.setCleanDataFunc(cleanData);
        formService.setParseDataFunc(parseData);
        $scope.delete = function (obj) {
            api.Model.delete({type: 'exercise_checkpoints', id: obj.Id}, function () {
                api.Model.get({type: 'exercise_projects', id: $routeParams.projectId}, function (exercise_project) {
                    exercise_project.checkpoints.pop(obj.Id);
                    api.Model.save({type: 'exercise_projects', id: $routeParams.projectId}, exercise_project, function () {
                        $scope.exercise_project.checkpoints = _.without($scope.exercise_project.checkpoints, obj);
                    });
                });
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                //Save file
                api.Model.save({type:"files"},{filename:'script', content:data['_default_files']},function(file){
                    delete data["_default_files"]
                    data = _.extend(data,{'default_files' :[file.Id]})
                    api.Model.save({type: 'exercise_checkpoints', recurse:true, depth:1}, data, function (result) {
                        api.Model.get({type: 'exercise_projects', id: $routeParams.projectId}, function (exercise_project) {
                            exercise_project.checkpoints.push(result.Id);
                            api.Model.save({type: 'exercise_projects', id: $routeParams.projectId}, exercise_project, function () {
                                $scope.exercise_project.checkpoints.push(result);
                            });
                        });

                    })
                })

            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Exercise Checkpoint";
            formService.fillFormData(editForm, obj);
            formModalService.showFormModal(editForm, function (form) {
                var data = formService.getDataFromForm(form);
                api.Model.save({type:"files", id:obj["default_files"][0].Id},{content:data['_default_files']},function(){
                    api.Model.save({type: 'exercise_checkpoints', id: obj.Id, recurse:true, depth:1}, data, function (result) {
                        obj = _.extend(obj, result);
                    })
                })

            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }])
    .controller("LessonAdminCtrl", ["$scope", "api", "$routeParams", "formModalService", function ($scope, api, $routeParams, formModalService) {
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true, depth: 2});
        var form = {
            "form_id": 1,
            "form_name": "Add Lesson",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "Title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name":"title"
                },
                {
                    "field_id": 2,
                    "field_title": "Description",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "description"
                }
            ]
        }

        $scope.delete = function (lesson) {
            api.Model.delete({type: 'lessons', id: lesson.Id}, function () {
                api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                    course.lesson_keys.pop(lesson.Id);
                    $scope.course.lesson_keys.pop(lesson);
                    api.Model.save({type: 'courses', id: course.Id}, course, function () {
                    });
                });
            });
        }

        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                lesson = {}
                _.each(form.form_fields, function (ele) {
                    lesson[ele.field_name] = ele.field_value;
                });
                api.Model.save({type: 'lessons'}, lesson, function (data) {
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                        delete course['img'];
                        course.lesson_keys.push(data.Id);
                        api.Model.save({type: 'courses', id: course.Id}, course, function () {
                            $scope.course.lesson_keys.push(data);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.showEditModal = function (lesson) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Lesson";
            _.each(editForm.form_fields, function (field) {
                field.field_value = lesson[field.field_name];
            });
            formModalService.showFormModal(editForm, function (form) {
                lesson_tmp = {}
                _.each(form.form_fields, function (ele) {
                    lesson_tmp[ele.field_name] = ele.field_value;
                });
                delete lesson_tmp['img'];
                api.Model.save({type: 'lessons', id: lesson.Id}, lesson_tmp, function (data) {
                    //$scope.courses.push(data);
                    lesson = _.extend(lesson, data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
//        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {
//
//            $scope.form = form;
//
//            $scope.ok = function (data) {
//                $modalInstance.close($scope.form);
//            };
//
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//        };
    }])
    .controller("LectureAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', 'formModalService', function ($scope, api, $routeParams, $modal, $http, formModalService) {
        $scope.course = { Id: $routeParams.courseId };
        $scope.lesson = api.Model.get({type: 'lessons', id: $routeParams.lessonId, recurse: true, depth: 3});
        var form = {
            "form_id": 1,
            "form_name": "Add Lecture",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "Title",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "title"
                },
                {
                    "field_id": 2,
                    "field_title": "Description",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "description"
                },
                {
                    "field_id": 3,
                    "field_title": "Level",
                    "field_type": "dropdown",
                    "field_value": "1",
                    "field_required": true,
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Easy",
                            "option_value": 1
                        },
                        {
                            "option_id": 2,
                            "option_title": "Medium",
                            "option_value": 2
                        },
                        {
                            "option_id": 3,
                            "option_title": "Hard",
                            "option_value": 3
                        }
                    ],
                    "field_name": "level"
                },
                {
                    "field_id": 4,
                    "field_title": "Youtube video id",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "youtube_id"
                },
                {
                    "field_id": 5,
                    "field_title": "Time",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true,
                    "field_name": "time"
                }
            ]
        }

        $scope.delete = function (lecture) {
            api.Model.delete({type: 'lectures', id: lecture.Id}, function () {
                api.Model.get({type: 'lessons', id: $routeParams.lessonId}, function (lesson) {
                    lesson.lecture_keys.pop(lecture.Id);
                    $scope.lesson.lecture_keys.pop(lecture);
                    api.Model.save({type: 'lessons', id: lesson.Id}, lesson, function () {
                    });
                });
            });
        }

        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                lecture = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_name == "level" || ele.field_name == "time") {
                        ele.field_value = parseFloat(ele.field_value);
                    }
                    lecture[ele.field_name] = ele.field_value;
                });
                api.Model.save({type: 'lectures'}, lecture, function (data) {
                    api.Model.get({type: 'lessons', id: $routeParams.lessonId}, function (lesson) {
                        lesson.lecture_keys.push(data.Id);
                        api.Model.save({type: 'lessons', id: lesson.Id}, lesson, function () {
                            $scope.lesson.lecture_keys.push(data);
                        });
                    });
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.showEditModal = function (lecture) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Lecture";
            _.each(editForm.form_fields, function (field) {
                field.field_value = lecture[field.field_name];
            });
            formModalService.showFormModal(editForm, function (form) {
                lecture_tmp = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_name == "time")
                        lecture_tmp[ele.field_name] = parseFloat(ele.field_value);
                    else lecture_tmp[ele.field_name] = ele.field_value;
                });
                api.Model.save({type: 'lectures', id: lecture.Id}, lecture_tmp, function (data) {
                    lecture = _.extend(lecture, lecture_tmp);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

//        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {
//
//            $scope.form = form;
//
//            $scope.ok = function (data) {
//                $modalInstance.close($scope.form);
//            };
//
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//        };

        $scope.uploadFile = function (files, lecture) {
            $http.get('/api/files/lecture/' + lecture.Id + '/img').success(function (data) {
                var fd = new FormData();
                fd.append("file", files[0]);
                $http.post(data.upload_url, fd, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).success(function (data) {
                    lecture.img = data.image_url;
                }).error();
            })
        };

//        var ModalInstanceCtrl = function ($scope, $modalInstance, form) {
//
//            $scope.form = form;
//
//            $scope.ok = function (data) {
//                $modalInstance.close($scope.form);
//            };
//
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//        };
    }])
    .controller("QuestionAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', '$sce', '$compile', '$rootScope', "VG_EVENTS", 'formModalService', function ($scope, api, $routeParams, $modal, $http, $sce, $compile, $rootScope, VG_EVENTS, formModalService) {
        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        $scope.API = null;

        $scope.onPlayerReady = function (API) {
            $scope.API = API;
        };

        $scope.onCompleteVideo = function () {
            $scope.isCompleted = true;
        };

        $scope.onUpdateState = function (state) {
            $scope.state = state;
        };

        $scope.pauseVideo = function () {
            $scope.API.pause();
        };

        $rootScope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, function () {
            $scope.API.setSize(700, 380);
        });


        $scope.onUpdateTime = function (currentTime, totalTime) {
            $scope.currentTime = currentTime;
            $scope.totalTime = totalTime;
        };

        $scope.onUpdateVolume = function (newVol) {
            $scope.volume = newVol;
        };

        $scope.onUpdateSize = function (width, height) {
            $scope.config.width = width;
            $scope.config.height = height;
        };

        $scope.onQuizSubmit = function (data) {
            return {
                result: true,
                description: "Correct"
            }
        }

        $scope.stretchModes = [
            {
                label: "None",
                value: "none"
            },
            {
                label: "Fit",
                value: "fit"
            },
            {
                label: "Fill",
                value: "fill"
            }
        ];
        $scope.loadLecture = function () {
            $scope.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/watch?v=" + $scope.lecture.youtube_id);
            $scope.show = false;
            if (angular.isDefined($scope.vgScope)) {
                $scope.vgScope.$destroy();
            }
            $scope.vgScope = $scope.$new(false);
            $('#video').html($compile("<videogular id=\"khung-video\"\r\n                                    vg-player-ready=\"onPlayerReady\" vg-complete=\"onCompleteVideo\" vg-update-time=\"onUpdateTime\" vg-update-size=\"onUpdateSize\" vg-update-volume=\"onUpdateVolume\" vg-update-state=\"onUpdateState\"\r\n                                    vg-width=\"config.width\" vg-height=\"config.height\" vg-theme=\"config.theme.url\" vg-autoplay=\"config.autoPlay\" vg-stretch=\"config.stretch.value\" vg-responsive=\"config.responsive\">\r\n<video preload='metadata' id=\"video_content\">\r\n<source type=\"video/youtube\" src=\"" + $scope.youtubeUrl + "\"  /></video>\r\n                                    <vg-youtube></vg-youtube>\r\n                                    <vg-quiz vg-data='config.plugins.quiz.data' vg-quiz-submit=\"onQuizSubmit\" vg-quiz-skip=\"onQuizSkip\" vg-quiz-continue=\"onQuizContinue\" vg-quiz-show-explanation=\"onQuizShowExplanation\"></vg-quiz>\r\n                                    <vg-poster-image vg-url='config.plugins.poster.url' vg-stretch=\"config.stretch.value\"></vg-poster-image>\r\n                                    <vg-buffering></vg-buffering>\r\n                                    <vg-overlay-play vg-play-icon=\"config.theme.playIcon\"></vg-overlay-play>\r\n\r\n                                    <vg-controls vg-autohide=\"config.autoHide\" vg-autohide-time=\"config.autoHideTime\" style=\"height: 50px;\">\r\n                                        <vg-play-pause-button vg-play-icon=\"config.theme.playIcon\" vg-pause-icon=\"config.theme.pauseIcon\"></vg-play-pause-button>\r\n                                        <vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>\r\n                                        <vg-scrubBar>\r\n                                            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>\r\n                                        </vg-scrubBar>\r\n                                        <vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>\r\n                                        <vg-volume>\r\n                                            <vg-mutebutton\r\n                                                vg-volume-level-3-icon=\"config.theme.volumeLevel3Icon\"\r\n                                                vg-volume-level-2-icon=\"config.theme.volumeLevel2Icon\"\r\n                                                vg-volume-level-1-icon=\"config.theme.volumeLevel1Icon\"\r\n                                                vg-volume-level-0-icon=\"config.theme.volumeLevel0Icon\"\r\n                                                vg-mute-icon=\"config.theme.muteIcon\">\r\n                                            </vg-mutebutton>\r\n                                            <vg-volumebar></vg-volumebar>\r\n                                        </vg-volume>\r\n                                        <vg-fullscreenButton vg-enter-full-screen-icon=\"config.theme.enterFullScreenIcon\" vg-exit-full-screen-icon=\"config.theme.exitFullScreenIcon\"></vg-fullscreenButton>\r\n                                    </vg-controls>\r\n                                </videogular>")($scope.vgScope));
        }

        $scope.config = {
            width: 700,
            height: 380,
            autoHide: true,
            autoHideTime: 3000,
            autoPlay: false,
            responsive: false,
            stretch: $scope.stretchModes[1],
            theme: {
                url: "/application/css/videogular/videogular.css",
                playIcon: "&#xe000;",
                pauseIcon: "&#xe001;",
                volumeLevel3Icon: "&#xe002;",
                volumeLevel2Icon: "&#xe003;",
                volumeLevel1Icon: "&#xe004;",
                volumeLevel0Icon: "&#xe005;",
                muteIcon: "&#xe006;",
                enterFullScreenIcon: "&#xe007;",
                exitFullScreenIcon: "&#xe008;"
            },
            plugins: {
                poster: {
                    url: "http://upload.wikimedia.org/wikipedia/commons/4/4a/Python3-powered_hello-world.svg"
                },
                quiz: {
                    data: []
                }
            }
        };
        $scope.lecture = api.Model.get({type: 'lectures', id: $routeParams.lectureId, recurse: true, depth:4}, function () {
                $scope.loadLecture();
        });
        var codeForm = {
            "form_id": 1,
            "form_name": "Add Code",
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
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 3,
                    "field_title": "content",
                    "field_type": "code",
                    "field_language": "python",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 4,
                    "field_title": "time",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 5,
                    "field_title": "index",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": false
                }
            ]
        }

        var testForm = {
            "form_id": 2,
            "form_name": "Add Test",
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
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 3,
                    "field_title": "test_script",
                    "field_type": "code",
                    "field_language": "python",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 4,
                    "field_title": "time",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 5,
                    "field_title": "score",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }

        var quizForm = {
            "form_id": 3,
            "form_name": "Add Quiz",
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
                    "field_title": "question",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 3,
                    "field_title": "time",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 4,
                    "field_title": "score",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }

        var answerQuizForm = {
            "form_id": 4,
            "form_name": "Add Answer Quiz",
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
                    "field_title": "is_true",
                    "field_type": "checkbox",
                    "field_value": ""
                }
            ]
        }

        $scope.showAddAnswerQuizModal = function (quiz) {
            var addForm = $.extend(true, {}, answerQuizForm);
            formModalService.showFormModal(addForm, function (form) {
                answer = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "is_true") {
                        if (ele.field_value == 1) ele.field_value = true;
                        else ele.field_value = false;
                    }
                    answer[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'answers'}, answer, function(answer_quiz_result){
                    api.Model.get({type: 'lecture_quizs', id: quiz.Id}, function (quiz_result) {
                        quiz_result.answer_keys.push(answer_quiz_result.Id);
                        api.Model.save({type: 'lecture_quizs', id: quiz.Id}, quiz_result, function (data) {
                            quiz.answer_keys.push(answer_quiz_result);
                        });
                    });
                });

            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteAnswerQuiz = function (answer, quiz) {
            api.Model.delete({type: 'answers', id: answer.Id}, function () {
                api.Model.get({type: 'lecture_quizs', id: quiz.Id}, function (quiz_result) {
                    quiz_result.answer_keys.pop(answer.Id);
                    api.Model.save({type: 'lecture_quizs', id: quiz.Id}, quiz_result, function (data) {
                        quiz.answer_keys = _.without(quiz.answer_keys, answer);
                    });
                });
            });
        };


        $scope.showEditAnswerQuizModal = function (answer, quiz) {
            var editAnswerQuizForm = $.extend(true, {}, answerQuizForm);
            editAnswerQuizForm["form_name"] = "Edit Answer";
            _.each(editAnswerQuizForm.form_fields, function (field) {
                field.field_value = answer[field.field_title];
            });
            formModalService.showFormModal(editAnswerQuizForm, function (form) {
                answer_tmp = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "is_true") {
                        if (ele.field_value == 1) ele.field_value = true;
                        else ele.field_value = false;
                    }
                    answer_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'answers', id: answer.Id}, answer_tmp, function (data) {
                    answer = _.extend(answer, data);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showAddQuizModal = function () {
            $scope.API.pause();
            var addQuizForm = $.extend(true, {}, quizForm);
            addQuizForm.form_fields[2].field_value = $scope.currentTime;
            formModalService.showFormModal(addQuizForm, function (form) {
                quiz = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score") ele.field_value = parseFloat(ele.field_value);
                    quiz[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lecture_quizs'}, quiz, function (data) {
                    api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                        lecture.quiz_keys.push(data.Id);
                        api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                            $scope.lecture.quiz_keys.push(data);
                        });
                    });
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteQuiz = function (quiz) {
            api.Model.delete({type: 'lecture_quizs', id: quiz.Id}, function () {
                api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                    lecture.quiz_keys.pop(quiz.Id);
                    api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                        $scope.lecture.quiz_keys = _.without($scope.lecture.quiz_keys, quiz);
                    });
                });
            });
        };

        $scope.showEditQuizModal = function (quiz) {
            var editQuizForm = $.extend(true, {}, quizForm);
            editQuizForm["form_name"] = "Edit Quiz";
            _.each(editQuizForm.form_fields, function (field) {
                field.field_value = quiz[field.field_title];
            });
            formModalService.showFormModal(editQuizForm, function (form) {
                quiz_tmp = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score")
                        quiz_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else quiz_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lecture_quizs', id: quiz.Id }, quiz_tmp, function (data) {
                    quiz = _.extend(quiz, quiz_tmp);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showAddTestModal = function () {
            $scope.API.pause();
            var addTestForm = $.extend(true, {}, testForm);
            addTestForm.form_fields[3].field_value = $scope.currentTime;
            formModalService.showFormModal(addTestForm, function (form) {
                test = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score") ele.field_value = parseFloat(ele.field_value);
                    test[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'tests'}, test, function (data) {
                    api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                        lecture.test_keys.push(data.Id);
                        api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                            $scope.lecture.test_keys.push(data);
                        });
                    });
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteTest = function (test) {
            api.Model.delete({type: 'tests', id: test.Id}, function () {
                api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                    lecture.test_keys.pop(test.Id);
                    api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                        $scope.lecture.test_keys = _.without($scope.lecture.test_keys, test);
                    });
                });
            });
        };

        $scope.showEditTestModal = function (test) {
            var editTestForm = $.extend(true, {}, testForm);
            editTestForm["form_name"] = "Edit Test";
            _.each(editTestForm.form_fields, function (field) {
                field.field_value = test[field.field_title];
            });
            formModalService.showFormModal(editTestForm, function (form) {
                test_tmp = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score")
                        test_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else test_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'tests', id: test.Id}, test_tmp, function (data) {
                    test = _.extend(test, data);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showAddCodeModal = function () {
            $scope.API.pause();
            var addCodeForm = $.extend(true, {}, codeForm);
            addCodeForm.form_fields[3].field_value = $scope.currentTime;
            formModalService.showFormModal(addCodeForm, function (form) {
                code = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "index") ele.field_value = parseFloat(ele.field_value);
                    code[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'codes'}, code, function (data) {
                    api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                        lecture.code_keys.push(data.Id);
                        api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                            $scope.lecture.code_keys.push(data);
                        });
                    });
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteCode = function (code) {
            api.Model.delete({type: 'codes', id: code.Id}, function () {
                api.Model.get({type: 'lectures', id: $routeParams.lectureId}, function (lecture) {
                    lecture.code_keys.pop(code.Id);
                    api.Model.save({type: 'lectures', id: lecture.Id}, lecture, function () {
                        $scope.lecture.code_keys = _.without($scope.lecture.code_keys, code);
                    });
                });
            });
        };

        $scope.showEditCodeModal = function (code) {
            var editCodeForm = $.extend(true, {}, codeForm);
            editCodeForm["form_name"] = "Edit Code";
            _.each(editCodeForm.form_fields, function (field) {
                field.field_value = code[field.field_title];
            });

            formModalService.showFormModal(editCodeForm, function (form) {
                code_tmp = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "index")
                        code_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else code_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'codes', id: code.Id}, code_tmp, function (data) {
                    code = _.extend(code, code_tmp);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }]);

angular.module("easylearncode.admin.quiz", ["easylearncode.admin.core"])
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "template/angular/admin/quiz/quizs.html",
                controller: "QuizAdminCtrl"
            })
            .when("/level/:quizId",
            {
                templateUrl: "template/angular/admin/quiz/levels.html",
                controller: "LevelAdminCtrl"
            })
            .when("/level/test/:levelId",
            {
                templateUrl: "template/angular/admin/quiz/levels/tests.html",
                controller: "TestAdminCtrl"
            })
            .when("/level/result/:levelId",
            {
                templateUrl: "template/angular/admin/quiz/levels/results.html",
                controller: "ResultAdminCtrl"
            })
            .otherwise({redirectTo: "/"})
    }])
    .controller("QuizAdminCtrl", ["$scope", "api", "formModalService", "$http" , function ($scope, api, formModalService, $http) {
        $scope.quizs = api.Model.query({type: 'quizs', page_size: 10, order: '-week'});
        var form = {
            "form_id": 1,
            "form_name": "Add Quiz",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "week",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "start_date",
                    "field_type": "date",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (quiz) {

            api.Model.delete({type: 'quizs', id: quiz.Id}, function () {
                $scope.quizs = _.without($scope.quizs, quiz);
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {

                var data = {}
                _.each(form.form_fields, function (field) {
                    if (field.field_type == "date") {
                        field.field_value = new Date(field.field_value);
                    }
                    if (field.field_title == "week") {
                        field.field_value = parseInt(field.field_value);
                    }
                    data[field.field_title] = field.field_value;
                });
                api.Model.save({type: 'quizs'}, data, function (result) {
                    $scope.quizs.push(result);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (obj) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Quiz";
            _.each(editForm.form_fields, function (field) {
                field.field_value = obj[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                var data = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_type == "date") {
                        ele.field_value = new Date(ele.field_value);
                    }
                    if (ele.field_title == "week") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'quizs', id: obj.Id}, data, function (result) {
                    obj = _.extend(obj, result);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }


    }])
    .controller("LevelAdminCtrl", ["$scope", "api", "$routeParams", 'formModalService', function ($scope, api, $routeParams, formModalService) {
        //console.log($routeParams)
        $scope.quiz = api.Model.get({type: 'quizs', id: $routeParams.quizId, recurse: true});
        var form = {
            "form_id": 1,
            "form_name": "Add Level",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "level",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "description",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 3,
                    "field_title": "limit_memory",
                    "field_type": "textfield",
                    "field_value": "1000",
                    "field_required": true
                },
                {
                    "field_id": 4,
                    "field_title": "limit_time",
                    "field_type": "textfield",
                    "field_value": "60",
                    "field_required": true
                },
                {
                    "field_id": 5,
                    "field_title": "score",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (level) {
            api.Model.get({type: 'quizs', id: $routeParams.quizId}, function (quiz) {
                api.Model.delete({type: 'levels', id: level.Id}, function () {
                    quiz.level_keys.pop(level.Id);
                    $scope.quiz.level_keys.pop(level);
                    quiz.start_date = new Date(quiz.start_date);
                    api.Model.save({type: 'quizs', id: quiz.Id}, quiz, function () {
                    });
                });
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "level") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "limit_memory") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "limit_time") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "score") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'levels'}, data, function (result) {
                    api.Model.get({type: 'quizs', id: $routeParams.quizId}, function (quiz) {
                        quiz.level_keys.push(result.Id);
                        quiz.start_date = new Date(quiz.start_date);
                        api.Model.save({type: 'quizs', id: quiz.Id}, quiz, function () {
                            $scope.quiz.level_keys.push(result);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (level) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit level";
            _.each(editForm.form_fields, function (field) {
                field.field_value = level[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                var data = {}
                _.each(form.form_fields, function (ele) {
                    if (ele.field_title == "level") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "limit_memory") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "limit_time") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    if (ele.field_title == "score") {
                        ele.field_value = parseInt(ele.field_value);
                    }
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'levels', id: level.Id}, data, function (result) {
                    level = _.extend(level, result);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }])
    .controller("TestAdminCtrl", ["$scope", "api", "$routeParams", 'formModalService', function ($scope, api, $routeParams, formModalService) {
        //console.log($routeParams)
        $scope.level = api.Model.get({type: 'levels', id: $routeParams.levelId, recurse: true});
        var form = {
            "form_id": 1,
            "form_name": "Add Test",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "input",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "output",
                    "field_type": "textarea",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (test) {
            api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {
                level.test_case.pop(test);
                $scope.level.test_case.pop(test);
                delete level['description_html'];
                api.Model.save({type: 'levels', id: level.Id}, level, function () {
                });
                /*api.Model.delete({type: 'testcases', id: test.Id}, function () {

                 });*/
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                test = {}
                _.each(addForm.form_fields, function (ele) {
                    test[ele.field_title] = ele.field_value;
                });
                api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {
                    level.test_case.push(test);
                    delete level['description_html'];
                    api.Model.save({type: 'levels', id: level.Id}, level, function () {
                        $scope.level.test_case.push(test);
                    });
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (test) {
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit test";
            _.each(editForm.form_fields, function (field) {
                field.field_value = test[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                _.each(form.form_fields, function (ele) {
                    test[ele.field_title] = ele.field_value;
                });
                api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {
                    level.test_case = $scope.level.test_case;
                    delete level['description_html'];
                    api.Model.save({type: 'levels', id: level.Id}, level, function (data) {
                    });
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

    }])

    .controller("ResultAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', function ($scope, api, $routeParams, $modal, $http) {
        $http.get('/api/quizresults?filter=level_key==' + $routeParams.levelId + '&order=-score').success(function (data) {
            $scope.results = data;
        });

    }])
