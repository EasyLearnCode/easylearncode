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
    ]);
angular.module("easylearncode.admin.home", ["easylearncode.admin.core"]);
angular.module("easylearncode.admin.course", ["easylearncode.admin.core", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster", "info.vietnamcode.nampnq.videogular.plugins.youtube", "info.vietnamcode.nampnq.videogular.plugins.quiz"])
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
    .controller("CourseAdminCtrl", ["$scope", "api", "formModalService", "$http" , function ($scope, api, formModalService, $http) {
        $scope.courses = api.Model.query({type: 'courses', page_size: 10, order: '-created'});
        var form = {
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
        $scope.delete = function (obj) {
            api.Model.delete({type: 'courses', id: obj.Id}, function () {
                $scope.courses = _.without($scope.courses, obj);
            });
        }
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = {}
                _.each(form.form_fields, function (field) {
                    data[field.field_title] = field.field_value;
                });
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
            _.each(editForm.form_fields, function (field) {
                field.field_value = obj[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                var data = {}
                _.each(form.form_fields, function (ele) {
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'courses', id: course.Id}, data, function (result) {
                    //$scope.courses.push(data);
                    obj = _.extend(result, data);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
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
    .controller("ExerciseAdminCtrl", ["$scope", "api", "$routeParams", 'formModalService', function ($scope, api, $routeParams, formModalService) {
        //console.log($routeParams)
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true});
        var form = {
            "form_id": 1,
            "form_name": "Add Exercise",
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
                var data = {}
                _.each(form.form_fields, function (ele) {
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'exercises'}, data, function (result) {
                    api.Model.get({type: 'courses', id: $routeParams.courseId}, function (course) {
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
            _.each(editForm.form_fields, function (field) {
                field.field_value = obj[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                var data = {}
                _.each(addForm.form_fields, function (ele) {
                    data[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'courses', id: obj.Id}, data, function (result) {
                    obj = _.extend(result, data);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }])
    .controller("LessonAdminCtrl", ["$scope", "api", "$routeParams", "formModalService", function ($scope, api, $routeParams, formModalService) {
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true});
        var form = {
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
            var editForm = $.extend(true, {}, form);
            editForm["form_name"] = "Edit Lesson";
            _.each(editForm.form_fields, function (field) {
                field.field_value = lesson[field.field_title];
            });
            formModalService.showFormModal(editForm, function (form) {
                lesson_tmp = {}
                _.each(form.form_fields, function (ele) {
                    lesson_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'lessons', id: lesson.Id}, lesson_tmp, function (data) {
                    //$scope.courses.push(data);
                    lesson = _.extend(lesson, data);
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
    .controller("QuestionAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', '$sce', '$compile', '$rootScope', "VG_EVENTS", function ($scope, api, $routeParams, $modal, $http, $sce, $compile, $rootScope, VG_EVENTS) {
        $scope.lecture = api.Model.get({type: 'lectures', id: $routeParams.lectureId, recurse: true}, function (data) {
//            angular.forEach(data.question_keys, function(question){
//                api.Model.get({type: 'questions', id: question.Id, recurse: true}, function (data) {
//                    $scope.lecture.question_keys.push(data);
//                    console.log($scope.lecture.question_keys);
//                });
//            });
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
//
//        $rootScope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, function(){
//             alert($scope.config.width);
//             $scope.config.width = 700;
//             $scope.config.height = 380;
//        });

            $scope.onUpdateTime = function (currentTime, totalTime) {
                $scope.currentTime = currentTime;
                $scope.totalTime = totalTime;
//            angular.forEach(codes, function (code) {
//                if (code.time < currentTime) {
//                    if ($scope.state == 'play')
//                        $scope.code = code.code;
//                }
//            });
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
            $scope.goLecture = function (lecture) {
//            $location.path("/").search('lecture_id', lecture.Id).replace();
//            $scope.lecture = lecture;
//            $scope.loadLecture();
            }
            $scope.loadLecture = function () {
                $scope.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/watch?v=" + $scope.lecture.youtube_id);
                $scope.show = false;
                if (angular.isDefined($scope.vgScope)) {
                    $scope.vgScope.$destroy();
                }
                $scope.vgScope = $scope.$new(false);
                $('#video').html($compile("<videogular id=\"khung-video\"\r\n                                    vg-player-ready=\"onPlayerReady\" vg-complete=\"onCompleteVideo\" vg-update-time=\"onUpdateTime\" vg-update-size=\"onUpdateSize\" vg-update-volume=\"onUpdateVolume\" vg-update-state=\"onUpdateState\"\r\n                                    vg-width=\"config.width\" vg-height=\"config.height\" vg-theme=\"config.theme.url\" vg-autoplay=\"config.autoPlay\" vg-stretch=\"config.stretch.value\" vg-responsive=\"config.responsive\">\r\n<video preload='metadata' id=\"video_content\">\r\n<source type=\"video/youtube\" src=\"" + $scope.youtubeUrl + "\"  /></video>\r\n                                    <vg-youtube></vg-youtube>\r\n                                    <vg-quiz vg-data='config.plugins.quiz.data' vg-quiz-submit=\"onQuizSubmit\" vg-quiz-skip=\"onQuizSkip\" vg-quiz-continue=\"onQuizContinue\" vg-quiz-show-explanation=\"onQuizShowExplanation\"></vg-quiz>\r\n                                    <vg-poster-image vg-url='config.plugins.poster.url' vg-stretch=\"config.stretch.value\"></vg-poster-image>\r\n                                    <vg-buffering></vg-buffering>\r\n                                    <vg-overlay-play vg-play-icon=\"config.theme.playIcon\"></vg-overlay-play>\r\n\r\n                                    <vg-controls vg-autohide=\"config.autoHide\" vg-autohide-time=\"config.autoHideTime\" style=\"height: 50px;\">\r\n                                        <vg-play-pause-button vg-play-icon=\"config.theme.playIcon\" vg-pause-icon=\"config.theme.pauseIcon\"></vg-play-pause-button>\r\n                                        <vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>\r\n                                        <vg-scrubBar>\r\n                                            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>\r\n                                        </vg-scrubBar>\r\n                                        <vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>\r\n                                        <vg-volume>\r\n                                            <vg-mutebutton\r\n                                                vg-volume-level-3-icon=\"config.theme.volumeLevel3Icon\"\r\n                                                vg-volume-level-2-icon=\"config.theme.volumeLevel2Icon\"\r\n                                                vg-volume-level-1-icon=\"config.theme.volumeLevel1Icon\"\r\n                                                vg-volume-level-0-icon=\"config.theme.volumeLevel0Icon\"\r\n                                                vg-mute-icon=\"config.theme.muteIcon\">\r\n                                            </vg-mutebutton>\r\n                                            <vg-volumebar></vg-volumebar>\r\n                                        </vg-volume>\r\n                                        <vg-fullscreenButton vg-enter-full-screen-icon=\"config.theme.enterFullScreenIcon\" vg-exit-full-screen-icon=\"config.theme.exitFullScreenIcon\"></vg-fullscreenButton>\r\n                                    </vg-controls>\r\n                                </videogular>")($scope.vgScope));
                $("#gplus-cm").html("Loading G+ Comments");
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
                        data: [
                            {
                                "time": "200",
                                "question_id": "70d70be689d73e08687496a6d12b2b0d",
                                "html": "<div style=\"position:absolute;\">Select the restaurant(s) that serve Canadian cuisine for a price of $$$.\n\n<small>\n<pre>Georgie Porgie\n87%\n$$$\nCanadian,Pub Food\n\nSilver Spoon\n97%\n$$$$\nCanadian\n\nCoffee Cafe\n77%\n$$\nCoffee/Tea,Diner\n</pre>\n</small>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left: 470px; top: 50px;\">\n<input dir=\"auto\" class=\"quiz-input\" type=\"checkbox\" name=\"answer[70d70be689d73e08687496a6d12b2b0d][]\" id=\"gensym_52be3ad71a1f5\" value=\"d5c5ec0ff53ebf35958c5ba02c30ce24\"><label for=\"gensym_52be3ad71a1f5\" style=\"cursor:pointer;\">Georgie Porgie</label>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left: 470px; top: 140px; /* width:370px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"checkbox\" name=\"answer[70d70be689d73e08687496a6d12b2b0d][]\" id=\"gensym_52be3ad71a71f\" value=\"cfc6db592e488051decbce17bd7b98b8\"><label for=\"gensym_52be3ad71a71f\" style=\"cursor:pointer;\">Silver Spoon</label>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left: 470px; top: 230px; /* width:370px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"checkbox\" name=\"answer[70d70be689d73e08687496a6d12b2b0d][]\" id=\"gensym_52be3ad71ac52\" value=\"b387d47429de02592f973814b393e51d\"><label for=\"gensym_52be3ad71ac52\" style=\"cursor:pointer;\">Coffee Cafe</label>\n</div>",
                                "background": "color",
                                "background_src": "white",
                                "post_answer_url": "https:\/\/class.coursera.org\/programming2-001\/quiz\/video_quiz_attempt?method=post_question_answer&quiz_id=20&preview=0&question_id=70d70be689d73e08687496a6d12b2b0d"
                            },
                            {
                                "time": "180",
                                "question_id": "9326a7b17e15cfc69f8e46f9357bf6c5",
                                "html": "<div dir=\"auto\" class=\"quiz-question-text\" style=\"position:absolute;\">\n<small>\n<pre>def is_palindrome_v3(s):\n    i = 0\n    j = len(s) - 1\n    while i &lt; j and s[i] == s[j]:\n        i = i + 1\n        j = j - 1\n\n    return j &lt;= i\n</pre>\n</small>\nIf <code>s</code> refers to a single-character string such as 'x', when the return statement is reached, which of the following expressions evaluates to <code>True</code>?</div>\n<div class=\"quiz-option\" style=\"position:absolute; left:40px; top: 250px; /* width:370px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"radio\" name=\"answer[9326a7b17e15cfc69f8e46f9357bf6c5][]\" id=\"gensym_52bed85054bc8\" value=\"ad32510af7c53e2fa6cce4d764c09800\"><label for=\"gensym_52bed85054bc8\" style=\"cursor:pointer;\"><code>i == 0 and j == -1</code> </label>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left:40px; top: 320px; /* width:370px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"radio\" name=\"answer[9326a7b17e15cfc69f8e46f9357bf6c5][]\" id=\"gensym_52bed85055221\" value=\"8d53ca2fa487cfbb4479ce2bf7f2e295\"><label for=\"gensym_52bed85055221\" style=\"cursor:pointer;\"><code>i == 0 and j == 0</code> </label>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left:430px; top: 250px; /* width:380px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"radio\" name=\"answer[9326a7b17e15cfc69f8e46f9357bf6c5][]\" id=\"gensym_52bed850558b5\" value=\"94023160fe66f684740c119a18e39a9e\"><label for=\"gensym_52bed850558b5\" style=\"cursor:pointer;\"><code>i == 0 and j == 1</code> </label>\n</div>\n<div class=\"quiz-option\" style=\"position:absolute; left:430px; top: 320px; /* width:380px; */ /* height:80px; */ \">\n<input dir=\"auto\" class=\"quiz-input\" type=\"radio\" name=\"answer[9326a7b17e15cfc69f8e46f9357bf6c5][]\" id=\"gensym_52bed85055eba\" value=\"ff8f062afa22c18eb5c2d4c557bcd44b\"><label for=\"gensym_52bed85055eba\" style=\"cursor:pointer;\"><code>i == 1 and j == 0</code> </label>\n</div>",
                                "background": "color",
                                "background_src": "white",
                                "post_answer_url": "https:\/\/class.coursera.org\/programming2-001\/quiz\/video_quiz_attempt?method=post_question_answer&quiz_id=18&preview=0&question_id=9326a7b17e15cfc69f8e46f9357bf6c5"
                            }
                        ]
                    }
                }
            };
            $scope.loadLecture();
        });
        var addCodeForm = {
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
                }
            ]
        }

        var addTestForm = {
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

        var addQuizForm = {
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

        var addAnswerQuizForm = {
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
                    "field_value": "True"
                }
            ]
        }

        $scope.showAddAnswerQuizModal = function (quiz) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addAnswerQuizForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                answer = {}
                _.each(addAnswerQuizForm.form_fields, function (ele) {
                    if (ele.field_title == "is_true") {
                        if (ele.field_value == 1) ele.field_value = true;
                        else ele.field_value = false;
                    }
                    answer[ele.field_title] = ele.field_value;
                });
                api.Model.get({type: 'lecture_quizs', id: quiz.Id}, function (quiz_result) {
                    quiz_result.answers.push(answer);
                    api.Model.save({type: 'lecture_quizs', id: quiz_result.Id}, quiz_result, function (data) {
                        quiz.answers.push(answer);
                    });
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteAnswerQuiz = function (answer, quiz) {
            //api.Model.delete({type: 'lecture_quizs', id: quiz.Id}, function () {
            api.Model.get({type: 'lecture_quizs', id: quiz.Id}, function (quiz_result) {
                quiz_result.answers.pop(answer);
                api.Model.save({type: 'lecture_quizs', id: quiz.Id}, quiz_result, function (data) {
                    quiz.answers = _.without(quiz.answers, answer);
                });
            });
            //});
        };


        $scope.showEditAnswerQuizModal = function (answer, quiz) {
            var editAnswerQuizForm = $.extend(true, {}, addAnswerQuizForm);
            editAnswerQuizForm["form_name"] = "Edit Answer";
            _.each(editAnswerQuizForm.form_fields, function (field) {
                field.field_value = answer[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editAnswerQuizForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                answer_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score")
                        answer_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else answer_tmp[ele.field_title] = ele.field_value;
                });
                index = _.indexOf(quiz.answers, answer)
                quiz.answers[index] = answer_tmp;
                api.Model.save({type: 'lecture_quizs', id: quiz.Id}, quiz, function (data) {
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

        $scope.showAddQuizModal = function () {
            $scope.API.pause();
            addQuizForm.form_fields[2].field_value = $scope.currentTime;
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addQuizForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                quiz = {}
                _.each(addQuizForm.form_fields, function (ele) {
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
            var editQuizForm = $.extend(true, {}, addQuizForm);
            editQuizForm["form_name"] = "Edit Quiz";
            _.each(editQuizForm.form_fields, function (field) {
                field.field_value = quiz[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editQuizForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                quiz_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    if (ele.field_title == "time" || ele.field_title == "score")
                        quiz_tmp[ele.field_title] = parseFloat(ele.field_value);
                    else quiz_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'tests', id: test.Id}, test_tmp, function (data) {
                    test = _.extend(test, data);
                    $scope.$apply();
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.showAddTestModal = function () {
            $scope.API.pause();
            addTestForm.form_fields[3].field_value = $scope.currentTime;
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addTestForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                test = {}
                _.each(addTestForm.form_fields, function (ele) {
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
            var editTestForm = $.extend(true, {}, addTestForm);
            editTestForm["form_name"] = "Edit Test";
            _.each(editTestForm.form_fields, function (field) {
                field.field_value = test[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editTestForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                test_tmp = {}
                _.each(addForm.form_fields, function (ele) {
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
            addCodeForm.form_fields[3].field_value = $scope.currentTime;
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return addCodeForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                code = {}
                _.each(addForm.form_fields, function (ele) {
                    if (ele.field_title == "time") ele.field_value = parseFloat(ele.field_value);
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
            var editCodeForm = $.extend(true, {}, addCodeForm);
            editCodeForm["form_name"] = "Edit Code";
            _.each(editCodeForm.form_fields, function (field) {
                field.field_value = code[field.field_title];
            });
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    form: function () {
                        return editCodeForm;
                    }
                }
            });
            modalInstance.result.then(function (addForm) {
                code_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    if (ele.field_title == "time")
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
                    if (ele.field_type == "date") {
                        ele.field_value = new Date(ele.field_value);
                    }
                    if (ele.field_title == "week") {
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
                    if (ele.field_type == "date") {
                        ele.field_value = new Date(ele.field_value);
                    }
                    if (ele.field_title == "week") {
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
                level = {}
                _.each(addForm.form_fields, function (ele) {
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
                    level[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'levels'}, level, function (data) {
                    api.Model.get({type: 'quizs', id: $routeParams.quizId}, function (quiz) {
                        quiz.level_keys.push(data.Id);
                        quiz.start_date = new Date(quiz.start_date);
                        api.Model.save({type: 'quizs', id: quiz.Id}, quiz, function () {
                            $scope.quiz.level_keys.push(data);
                        });
                    });

                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (level) {
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit level";
            _.each(editForm.form_fields, function (field) {
                field.field_value = level[field.field_title];
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
                level_tmp = {}
                _.each(addForm.form_fields, function (ele) {
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
                    level_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.save({type: 'levels', id: level.Id}, level_tmp, function (data) {
                    level = _.extend(level, level_tmp);
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
    .controller("TestAdminCtrl", ["$scope", "api", "$routeParams", '$modal', function ($scope, api, $routeParams, $modal) {
        //console.log($routeParams)
        $scope.level = api.Model.get({type: 'levels', id: $routeParams.levelId, recurse: true});
        var addForm = {
            "form_id": 1,
            "form_name": "Add Test",
            "form_fields": [
                {
                    "field_id": 1,
                    "field_title": "input",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                },
                {
                    "field_id": 2,
                    "field_title": "output",
                    "field_type": "textfield",
                    "field_value": "",
                    "field_required": true
                }
            ]
        }
        $scope.delete = function (test) {
            api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {
                level.test_case.pop(test);
                $scope.level.test_case.pop(test);
                api.Model.save({type: 'levels', id: level.Id}, level, function () {
                });
                /*api.Model.delete({type: 'testcases', id: test.Id}, function () {

                 });*/
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
                test = {}
                _.each(addForm.form_fields, function (ele) {
                    test[ele.field_title] = ele.field_value;
                });
                api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {
                    level.test_case.push(test);
                    api.Model.save({type: 'levels', id: level.Id}, level, function () {
                        $scope.level.test_case.push(test);
                    });
                });
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        };
        $scope.showEditModal = function (test) {
            var editForm = $.extend(true, {}, addForm);
            editForm["form_name"] = "Edit test";
            _.each(editForm.form_fields, function (field) {
                field.field_value = test[field.field_title];
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
                test_tmp = {}
                _.each(addForm.form_fields, function (ele) {
                    test_tmp[ele.field_title] = ele.field_value;
                });
                api.Model.get({type: 'levels', id: $routeParams.levelId}, function (level) {


                });

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

    .controller("ResultAdminCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', function ($scope, api, $routeParams, $modal, $http) {
        $http.get('/api/quizresults?filter=level_key==' + $routeParams.levelId + '&order=-score').success(function (data) {
            $scope.results = data;
        });

    }])
