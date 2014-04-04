"use strict";
angular.module('nampnq.util.bindHtml', [])
    .directive('bindHtmlUnsafe', function () {
        return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
            scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
                element.html(value || '');
            });
        };
    });
angular.module("info.vietnamcode.nampnq.videogular.plugins.quiz", ['nampnq.util.bindHtml'])
    .directive(
        "vgQuiz", ["VG_EVENTS",
            function (VG_EVENTS) {
                return {
                    restrict: "E",
                    require: "^videogular",
                    templateUrl: "/application/js/libs/videogular/plugins/views/quiz/quiz.html",
                    scope: {
                        vgData: "=",
                        vgQuizSubmit: '&',
                        vgQuizSkip: '&',
                        vgQuizContinue: '&',
                        vgQuizShowExplanation: '&'
                    },
                    link: function (scope, elem, attr, API) {
                        scope.previous_time = 0;
                        scope.submit = true;
                        scope.skip = true;
                        scope.continue_btn = false;
                        scope.explanation = false;
                        var vgQuizSubmitCallBack = scope.vgQuizSubmit();
                        var vgQuizSkipCallBack = scope.vgQuizSkip();
                        var vgQuizContinueCallBack = scope.vgQuizContinue();
                        var vgQuizShowExplanationCallBack = scope.vgQuizShowExplanation();

                        function onUpdateTime(target, params) {
                            if (scope.vgData)
                                if (!API.videoElement[0].paused) {
                                    var i, cue_point_time, triggered_cue_points, currentTime = params[0],
                                        timeDelta = currentTime - scope.previous_time;
                                    if (timeDelta > 0 && 2 > timeDelta) {
                                        for (triggered_cue_points = [], i = 0; i < scope.vgData.length; i++)
                                            if (cue_point_time = scope.vgData[i].time, scope.previous_time < cue_point_time && currentTime >= cue_point_time)
                                                triggered_cue_points.push(scope.vgData[i]);
                                        if (triggered_cue_points.length > 0) {
                                            //TODO: change varible in html, add css display
                                            elem.css('display', 'block');
                                            API.pause();
                                            scope.submit = false;
                                            scope.skip = false;
                                            elem.css("background-image", "url('http://en.hdyo.org/assets/ask-question-1-ca45a12e5206bae44014e11cd3ced9f1.jpg')").css("background-size", "100% 100%");
                                            setTimeout(function () {
                                                scope.submit = true;
                                                scope.skip = true;
                                                scope.id = triggered_cue_points[0].Id;
                                                scope.type = triggered_cue_points[0].$class;
                                                scope.is_quiz = false;
                                                scope.is_test = false;
                                                if (triggered_cue_points[0].$class == "Quiz") {
                                                    scope.content = triggered_cue_points[0].question;
                                                    scope.answers = triggered_cue_points[0].answer_keys;
                                                    scope.is_quiz = true;
                                                }
                                                else if (triggered_cue_points[0].$class == "Test") {
                                                    scope.content = triggered_cue_points[0].description;
                                                    scope.is_test = true;
                                                    scope.code = "#Viết code vào đây và nhấn submit"
                                                }
                                                var background_type = "color",//triggered_cue_points[0].background,
                                                    background_src = "white";//triggered_cue_points[0].background_src;
                                                if ("color" == background_type)
                                                    elem.css("background", background_src);
                                                else if ("image" == background_type)
                                                    elem.css("background-image", "url(" + background_src + ")").css("background-size", "100% 100%");
                                                else if ("transparent" == background_type)
                                                    elem.css("background", "transparent");
                                            }, 3000);

                                        }
                                    }
                                    scope.previous_time = currentTime
                                }
                        };

                        function onUpdateSize(target, param) {
                            elem.css('width', param[0]);
                            elem.css('height', param[1]);
                        };

                        function refreshOverlay() {

                        }

                        scope.quizSubmit = function () {
                            if (vgQuizSubmitCallBack) {

                                var paramObj = {};
                                angular.forEach(elem.find('form').serializeArray(), function (kv) {
                                    if (paramObj.hasOwnProperty(kv.name)) {
                                        if (!paramObj[kv.name].push) {
                                            paramObj[kv.name] = [paramObj[kv.name]];
                                        }
                                        paramObj[kv.name].push(kv.value);
                                    } else {
                                        paramObj[kv.name] = kv.value;
                                    }
                                });
                                var result = vgQuizSubmitCallBack(paramObj);
                                if (paramObj.type == "Quiz") {
                                    scope.status = result.description;
                                    if (result.result) {
                                        scope.submit = false;
                                        scope.skip = false;
                                        scope.continue_btn = true;
                                        scope.explanation = true;

                                    }
                                }
                                else if (paramObj.type == "Test") {
                                    result.then(function (data) {
                                        scope.status = data.description;
                                        if (data.result) {
                                            scope.submit = false;
                                            scope.skip = false;
                                            scope.continue_btn = true;
                                            scope.explanation = true;

                                        } else {
                                            scope.status = data.description;
                                        }
                                    })
                                }
                            }

                        };
                        scope.quizSkip = function () {
                            if (vgQuizSkipCallBack) vgQuizSkipCallBack();
                            scope.status = "";
                            elem.css('display', 'none');
                            API.play();
                            scope.is_quiz = false;
                            scope.is_test = false;
                        };
                        scope.quizContinue = function () {
                            if (vgQuizContinueCallBack) vgQuizContinueCallBack();
                            scope.status = "";
                            scope.submit = true;
                            scope.skip = true;
                            scope.continue_btn = false;
                            scope.explanation = false;
                            elem.css('display', 'none');
                            API.play();
                            scope.is_quiz = false;
                            scope.is_test = false;
                        };
                        scope.quizShowExplanation = function () {
                            if (vgQuizShowExplanationCallBack) {
                                var result = vgQuizShowExplanationCallBack();
                                scope.status = result;
                            }
                        };
                        elem.css('display', 'none');
                        API.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
                        API.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);

                    }
                }
            }
        ]);
