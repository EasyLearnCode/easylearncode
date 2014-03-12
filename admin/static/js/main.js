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
            .when("/lessons/:courseId",
            {
                templateUrl: "template/angular/admin/courses/lesson.html",
                controller: "LessonAdminCtrl"
            })
            .when("/lessons/lectures/:lessonId",
            {
                templateUrl: "template/angular/admin/courses/lessons/lecture.html",
                controller: "LectureAdminCtrl"
            })
            .when("/lessons/lectures/questions/:lectureId",
            {
                templateUrl: "template/angular/admin/courses/lessons/lectures/question.html",
                controller: "QuestionAdminCtrl"
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
                    "field_type": "textarea",
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
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                        course.exercise_keys.push(data.Id);
                        api.Model.save({type: 'courses', id: course.Id}, course, function () {
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
    .controller("LessonAdminCtrl", ["$scope", "api", "$routeParams", '$modal', function ($scope, api, $routeParams, $modal) {
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true});
        var addForm = {
            "form_id": 1,
            "form_name": "Add Lesson",
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

        $scope.delete = function (lesson) {
            api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                api.Model.delete({type: 'lessons', id: lesson.Id}, function () {
                    course.lesson_keys.pop(lesson.Id);
                    $scope.course.lesson_keys.pop(lesson);
                    api.Model.save({type: 'courses', id: course.Id}, course, function () {
                    });
                });
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
                lesson = {}
                _.each(addForm.form_fields, function (ele) {
                    lesson[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lessons'}, lesson, function (data) {
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
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
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit Lesson";
            _.each(editForm.form_fields, function (field) {
                field.field_value = lesson[field.field_title];
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
                lesson_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    lesson_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lessons', id: lesson.Id}, lesson_tmp, function (data) {
                    //$scope.courses.push(data);
                    lesson = _.extend(lesson, lesson_tmp);
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
    .controller("LectureAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', function ($scope, api, $routeParams, $modal, $http) {
        $scope.lesson = api.Model.get({type: 'lessons', id: $routeParams.lessonId, recurse: true});
        var addForm = {
            "form_id": 1,
            "form_name": "Add Lecture",
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
                    "field_title": "youtube_id",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 4,
                    "field_title": "time",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }

        $scope.delete = function (lecture) {
            api.Model.get({type: 'lessons', id: $routeParams.lessonId}, function (lesson) {
                api.Model.delete({type: 'lectures', id: lecture.Id}, function () {
                    lesson.lecture_keys.pop(lecture.Id);
                    $scope.lesson.lecture_keys.pop(lecture);
                    api.Model.save({type: 'lessons', id: lesson.Id}, lesson, function () {
                    });
                });
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
                lecture = {}
                _.each(addForm.form_fields, function (ele) {
                    lecture[ele.field_title] = ele.field_value;
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
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit Lecture";
            _.each(editForm.form_fields, function (field) {
                field.field_value = lecture[field.field_title];
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
                lecture_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    if (ele.field_title == "time")
                        lecture_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else lecture_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lectures', id: lecture.Id}, lecture_tmp, function (data) {
                    lecture = _.extend(lecture, lecture_tmp);
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
    .controller("QuestionAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', function ($scope, api, $routeParams, $modal, $http) {
        $scope.lecture = api.Model.get({type: 'lectures', id: $routeParams.lectureId, recurse: true});

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
            .otherwise({redirectTo: "/"})
    }])
    .controller("QuizAdminCtrl", ["$scope", "api", "$modal", "$http" , function ($scope, api, $modal, $http) {
        $scope.quizs = api.Model.query({type: 'quizs', page_size: 10, order: '-week'});
        var addForm = {
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
                quiz = {}
                _.each(addForm.form_fields, function (ele) {
                    if(ele.field_type == "date"){
                        ele.field_value = new Date(ele.field_value);
                    }
                    if(ele.field_title == "week"){
                        ele.field_value = parseInt(ele.field_value);
                    }
                    quiz[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'quizs'}, quiz, function (data) {
                    $scope.quizs.push(data);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (quiz) {
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit Quiz";
            _.each(editForm.form_fields, function (field) {
                field.field_value = quiz[field.field_title];
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
                quiz_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    if(ele.field_type == "date"){
                        ele.field_value = new Date(ele.field_value);
                    }
                    if(ele.field_title == "week"){
                        ele.field_value = parseInt(ele.field_value);
                    }
                    quiz_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'quizs', id: quiz.Id}, quiz_tmp, function (data) {
                    quiz = _.extend(quiz, quiz_tmp);
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
    .controller("LevelAdminCtrl", ["$scope", "api", "$routeParams", '$modal', function ($scope, api, $routeParams, $modal) {
        //console.log($routeParams)
        $scope.quiz = api.Model.get({type: 'quizs', id: $routeParams.quizId, recurse: true});
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
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
                        course.exercise_keys.push(data.Id);
                        api.Model.save({type: 'courses', id: course.Id}, course, function () {
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
