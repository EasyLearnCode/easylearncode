(function () {
    angular.module("easylearncode.core", ["services", "controllers", "directives", "oldFilters", "oldMeta"]);
    angular.module("services", "services.gateways services.utility services.reviews services.blogFeed services.forum services.user services.auth services.content services.dummyData services.milestones services.search services.payment".split(" "));
    angular.module("controllers", "controllers.courseCatalog controllers.lesson controllers.reviews controllers.editor controllers.myCourses controllers.search controllers.utility controllers.courseOverview controllers.header".split(" "));
    angular.module("directives", "directives.user directives.utility directives.reviews directives.forum directives.myCourses directives.search directives.payment".split(" "));
    angular.module("oldFilters", []);
    angular.module("oldMeta", ["meta.configuration"]);
    angular.module("services.gateways", ["services.customers", "services.groups", "services.summaries", "services.permissions"]);
    angular.module("services.lesson", []);
    angular.module("directives.lesson", []);
    angular.module("controllers.lesson", []);
    angular.module("controllers.settings", []);
    angular.module("directives.location", []);
    angular.module("controllers.courseCatalog", []);
    angular.module("controllers.courseOverview", []);
    angular.module("controllers.myCourses", []);
    angular.module("directives.myCourses", []);
    angular.module("controllers.search", []);
    angular.module("directives.search", []);
    angular.module("services.search", []);
    angular.module("services.utility", []);
    angular.module("directives.utility", []);
    angular.module("controllers.utility", []);
    angular.module("directives.reviews", []);
    angular.module("services.reviews", []);
    angular.module("controllers.reviews", []);
    angular.module("services.blogFeed", []);
    angular.module("directives.forum", []);
    angular.module("services.forum", []);
    angular.module("directives.payment", []);
    angular.module("services.payment", []);
    angular.module("services.editor", []);
    angular.module("directives.editor", []);
    angular.module("controllers.editor", []);
    angular.module("meta.configuration", []);
    angular.module("services.content", []);
    angular.module("services.milestones", []);
    angular.module("services.user", []);
    angular.module("directives.user", []);
    angular.module("services.auth", []);
    angular.module("services.customers", []);
    angular.module("services.groups", []);
    angular.module("services.summaries", []);
    angular.module("services.permissions", []);
    angular.module("services.milestones", []);
    angular.module("services.dummyData", []);
    angular.module("controllers.header", []);
    angular.module("youtube", []);
    angular.module("oldeasylearncode", ["easylearncode.core"]);
    angular.module("easylearncode.viewer", ["easylearncode.core", "youtube", "services.lesson", "directives.lesson", "controllers.lesson"]);
    angular.module("easylearncode.overview", ["easylearncode.core", "youtube"]);
    angular.module("easylearncode.courseCatalog", ["easylearncode.core"]);
    angular.module("easylearncode.editor", ["easylearncode.core", "services.editor", "directives.editor", "controllers.editor", "services.lesson"]);
    angular.module("easylearncode.settings", ["easylearncode.core", "controllers.settings", "directives.location"]);
    angular.module("easylearncode.payment", ["easylearncode.core"]);
    angular.module("easylearncode.simple", ["easylearncode.core"]);
    angular.module("easylearncode.contest", ["ui.bootstrap", "ui.ace", "easylearncode.core"]);
    angular.module("easylearncode.home", ["ui.bootstrap", "easylearncode.core"]);
    angular.module("easylearncode.game", ["easylearncode.core"]);
    angular.module("easylearncode.learn", ["ui.bootstrap", "ui.ace", "easylearncode.core"])
    angular.module("easylearncode.core").config(["$locationProvider",
        function ($locationProvider) {
            $locationProvider.html5Mode(!1);
            $locationProvider.hashPrefix("!")
        }
    ])
})();
angular.module("services.utility").factory("validator", [
    function () {
        var a = {
            valid: !0,
            errorText: ""
        }, c = {
            noop: function () {
                return a
            },
            required: function (c, b) {
                return "string" === typeof c && "" === c.replace(/^\s\s*/, "").replace(/\s\s*$/, "") || "undefined" === typeof c || "boolean" === typeof c && !c ? {
                    valid: !1,
                    errorText: b + " is required."
                } : a
            },
            strLen: function (c, b, e) {
                ("string" !== typeof c || "string" !== typeof b || "object" !== typeof e || 2 !== e.length) && console.error("Wrong parameters passed to strLen validator for " + b);
                var c = c.length,
                    f = e[0],
                    e = e[1];
                if ("number" === typeof f && "number" === typeof e) {
                    if (f === e && f !== c) return {
                        valid: !1,
                        errorText: b + " has to be exactly " + e + " characters long."
                    };
                    if (c < f || c > e) return {
                        valid: !1,
                        errorText: b + " has to be between " + f + " and " + e + " characters long."
                    }
                } else {
                    if ("number" === typeof f && c < f) return {
                        valid: !1,
                        errorText: b + " has to be more than " + f + (1 >= f ? " character" : " characters") + " long."
                    };
                    if ("number" === typeof e && c > e) return {
                        valid: !1,
                        errorText: b + " has to be " + (1 >= e ? "less than 1 character" : "fewer than " + e + " characters") +
                            " long."
                    }
                }
                return a
            },
            numericString: function (c, b) {
                return "string" !== typeof c ? (console.error("The numericString evaluator can only take in a string! You tried " + typeof c), {
                    valid: !1,
                    errorText: "The numericString evaluator can only take in a string! You tried " + typeof c
                }) : !/^[0-9]+$/.test(c) ? {
                    valid: !1,
                    errorText: b + " can only be numeric characters."
                } : a
            },
            email: function (c, b) {
                ("string" !== typeof c || "string" !== typeof b) && console.error("Wrong parameters passed to email validator for " + b);
                return /^[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i.test(c) ?
                    a : {
                    valid: !1,
                    errorText: b + " has to be a valid email address"
                }
            },
            equal: function (c, b, e) {
                ("string" !== typeof c && "number" !== typeof c && "boolean" !== typeof c || "object" !== typeof e || 2 !== e.length) && console.error("Wrong parameters passed to equal validator for " + b);
                "string" !== typeof c && ("number" !== typeof c && "boolean" !== typeof c) && console.error('Validator "Equal" only works for strings, numbers, and booleans. Tried ' + typeof c + " for " + b);
                return c === e[0] ? a : {
                    valid: !1,
                    errorText: b + " and " + e[1] + " have to be the same."
                }
            },
            javascript: function (c, b, e) {
                var f = e[0],
                    e = [c].concat(e.splice(0, 1)),
                    f = f.apply(void 0, e);
                return "boolean" !== typeof f ? (console.error("Javascript evaluator types must return only boolean values! This one returned " + f), {
                    valid: !1,
                    errorText: "Validator for " + b + " should have returned a bool, but returned " + f
                }) : f ? a : {
                    valid: !1,
                    errorText: b + " failed validation with value " + c
                }
            },
            regex: function (c, b, e) {
                return "object" !== typeof e[0] || !1 === e[0] instanceof RegExp ? (console.error("Regex evaluator types must have a regex value for arg[0] but got " +
                    e[0]), {
                    valid: !1,
                    errorText: "Validator for " + b + " should be called with regex as arg[0]"
                }) : "string" !== typeof c ? (console.error("Regex can only be called on a string! Tried to call it on " + c + " for " + b), {
                    valid: !1,
                    errorText: "Broken validator. Regex for " + b + " wasn't called on a string"
                }) : c.match(e[0]) ? a : {
                    valid: !1,
                    errorText: b + " failed regex validation with value " + c
                }
            },
            dateString: function (c, b) {
                var e = {
                    valid: !1,
                    errorText: b + " must be a date of the format mm/dd/yyyy."
                }, f = c.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
                if (null !== f) {
                    var g = +f[1],
                        h = +f[3],
                        f = new Date(h, g - 1, +f[2]);
                    return ("" + f.getFullYear()).slice(-2) === (h + "").slice(-2) && f.getMonth() === g - 1 ? a : e
                }
                return e
            }
        };
        return {
            check: function (a) {
                var b, e = {
                    valid: !0,
                    errorText: {}
                }, f, g;
                for (g in a)
                    if (a.hasOwnProperty(g)) {
                        b = a[g];
                        for (var h = 0; h < b.validators.length; h++)
                            if (f = b.validators[h], "undefined" === typeof f.disabled || !1 === f.disabled)
                                if ("function" === typeof c[f.type]) {
                                    var j = b.value,
                                        m = b.pretty || g,
                                        k = c[f.type](j, m, f.args || []);
                                    k.valid ? f.hasOwnProperty("chained") && (k = {}, k[g] = {
                                        pretty: m,
                                        value: j,
                                        validators: f.chained
                                    }, f = this.check(k), !1 === f.valid && (e.valid = !1, e.errorText[g] = e.errorText[g] || [], e.errorText[g] = e.errorText[g].concat(f.errorText[g]))) : (e.valid = !1, e.errorText[g] = e.errorText[g] || [], e.errorText[g].push("undefined" === typeof f.failMsg ? k.errorText.charAt(0).toUpperCase() + k.errorText.slice(1) : f.failMsg))
                                } else console.warn("You tried to use a validator that doesn't exist! The name you tried to use was: " + f.type)
                    }
                return e
            }
        }
    }
]);
angular.module("services.utility").factory("libraryLoader", ["$q", "$rootScope",
    function ($q, $rootScope) {
        var b = {
            jqconsole: "/application/js/standalone/libs/codemirror/codemirror-custom.min.js",
            mathquill: "/media/js/standalone/libs/mathquill.min.js",
            jshint: "/media/js/standalone/libs/jshint/jshint-1.0.0.min.js",
            base64: "/media/js/standalone/libs/base64.js"
        }, e = {};
        return {
            loadLibraries: function (d) {
                return $q.all(_.map(d, function (d) {
                    var f = b[d] ? b[d] : d,
                        j = $q.defer();
                    e[d] ? d = e[d] : (e[d] = j.promise, jQuery.ajax({
                        dataType: "script",
                        cache: !0,
                        url: f
                    }).success(function () {
                            j.resolve();
                            $rootScope.$apply()
                        }).error(function () {
                            j.reject();
                            $rootScope.$apply()
                        }), d = j.promise);
                    return d
                }))
            }
        }
    }
]);
angular.module("easylearncode.contest").controller("ContestCtrl", ["$scope", "$http", "csrf_token", function ($scope, $http, csrf_token) {
    $scope.langs = [
        {
            name: 'Python',
            mode: 'python',
            lang: 'PYTHON',
            active: false,
            source: "'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?\\n')\nprint 'Hi, %s.' % name\n'''\nprint 'Hello World!'\n"
        },
        {
            name: 'Java',
            mode: 'java',
            lang: 'JAVA',
            active: true,
            source: "/* IMPORTANT: class must not be public. */\n\n/*\n * uncomment this if you want to read input.\nimport java.io.BufferedReader;\nimport java.io.InputStreamReader;\n*/\n\nclass TestClass {\n    public static void main(String args[] ) throws Exception {\n        /*\n         * Read input from stdin and provide input before running\n\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        int N = Integer.parseInt(line);\n        for (int i = 0; i < N; i++) {\n            System.out.println(\"hello world\");\n        }\n        */\n\n        System.out.println(\"Hello World!\");\n    }\n}\n"
        },
        {
            name: 'C++',
            mode: 'c_cpp',
            lang: 'CPP',
            active: false,
            source: "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << \"Hello World!\" << endl;\n    return 0;\n}\n"

        }
    ]

    $http.get('/contest/get_thisweek_contest').success(function (data) {
        if(data.status == 1){
            $scope.error = "Chưa có đề thi";
        }
        else{
            $scope.thisweek_contest = data;
        }

    });
    $scope.resetCode = function()
    {
        $http.post('/contest/reset',{"_csrf_token": csrf_token}).success(function(){
            $scope.langs = [
        {
            name: 'Python',
            mode: 'python',
            lang: 'PYTHON',
            active: false,
            source: "'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?\\n')\nprint 'Hi, %s.' % name\n'''\nprint 'Hello World!'\n"
        },
        {
            name: 'Java',
            mode: 'java',
            lang: 'JAVA',
            active: true,
            source: "/* IMPORTANT: class must not be public. */\n\n/*\n * uncomment this if you want to read input.\nimport java.io.BufferedReader;\nimport java.io.InputStreamReader;\n*/\n\nclass TestClass {\n    public static void main(String args[] ) throws Exception {\n        /*\n         * Read input from stdin and provide input before running\n\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String line = br.readLine();\n        int N = Integer.parseInt(line);\n        for (int i = 0; i < N; i++) {\n            System.out.println(\"hello world\");\n        }\n        */\n\n        System.out.println(\"Hello World!\");\n    }\n}\n"
        },
        {
            name: 'C++',
            mode: 'c_cpp',
            lang: 'CPP',
            active: false,
            source: "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << \"Hello World!\" << endl;\n    return 0;\n}\n"

        }
    ]
        });
    };
    $scope.submitCode = function () {
        angular.forEach($scope.langs, function (lang) {
            if (lang.active) {
                $http.post('/contest/submit', {"key": $scope.thisweek_contest.test_key, "source": lang.source,
                    "_csrf_token": csrf_token, "lang": lang.lang}).success(function (status) {

                });
            }
        });
    }
    $scope.compiling = false;
    $scope.runCode = function () {
        angular.forEach($scope.langs, function (lang) {
            if (lang.active) {
                $scope.compiling = true;
                $http.post('/run_code', {"_csrf_token": csrf_token, "lang": lang.lang, "source": lang.source}).success(function (data, status, headers, config) {
                    $scope.data = data;
                    $scope.result = data.run_status.output;
                    $scope.compiling = false;
                }).error(function (data, status, headers, config) {
                        $scope.status = status;
                    });
            }
        })

    };
}]);
angular.module("controllers.header").controller('HeaderController', ['$scope', '$window', function ($scope, $window) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $window.location.pathname;
    };
}]);
angular.module("easylearncode.home").controller('HomeCarouselCtrl', ['$scope', function ($scope) {
    $scope.myInterval = 5500;
    $scope.langs = [
        {
            name: 'Python',
            img: 'python.jpg',
            description: 'Python là một ngôn ngữ lập trình thông dịch do Guido van Rossum tạo ra năm 1990. Python hoàn toàn tạo kiểu động và dùng cơ chế cấp phát bộ nhớ tự động; do vậy nó tương tự như Perl, Ruby, Scheme, Smalltalk, và Tcl. Python được phát triển trong một dự án mã mở, do tổ chức phi lợi nhuận Python Software Foundation quản lý. Là một ngôn ngữ lập trình hướng đối tượng, chạy được trên nhiều hệ điều hành khác nhau như Windows, Linux, Unix, Mac. Nó Đơn giản như các shellscript nhưng lại thực sự là ngôn ngữ để phát triển ứng dụng cấp siêu cao (very-high-level-language).'

        },
        {
            name: 'C',
            img: 'C.png',
            description: 'C là một ngôn ngữ lập trình tương đối nhỏ gọn vận hành gần với phần cứng và nó giống với ngôn ngữ Assembler hơn hầu hết các ngôn ngữ bậc cao. Hơn thế, C đôi khi được đánh giá như là "có khả năng di động", cho thấy sự khác nhau quan trọng giữa nó với ngôn ngữ bậc thấp như là Assembler, đó là việc mã C có thể được dịch và thi hành trong hầu hết các máy tính, hơn hẳn các ngôn ngữ hiện tại trong khi đó thì Assembler chỉ có thể chạy trong một số máy tính đặc biệt. Vì lý do này C được xem là ngôn ngữ ...'

        },
        {
            name: 'Java',
            img: 'Java.jpg',
            description: 'Java (đọc như "Gia-va") là một ngôn ngữ lập trình dạng lập trình hướng đối tượng (OOP). Khác với phần lớn ngôn ngữ lập trình thông thường, thay vì biên dịch mã nguồn thành mã máy hoặc thông dịch mã nguồn khi chạy, Java được thiết kế để biên dịch mã nguồn thành bytecode, bytecode sau đó sẽ được môi trường thực thi (runtime environment) chạy. Bằng cách này, Java thường chạy chậm hơn những ngôn ngữ lập trình thông dịch khác như C++, Python, Perl, PHP, C#...'
        }
    ];
}]);

angular.module("easylearncode.learn").run(function () {
}).controller('LearnCtrl', ['$scope', function ($scope) {
    $scope.lang =
    {
        name: 'Python',
        mode: 'python',
        lang: 'PYTHON',
        source: "'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?\\n')\nprint 'Hi, %s.' % name\n'''\nprint 'Hello World!'\n"
    };
    $scope.video = videojs('video-content', {"techOrder": ["youtube"], "src": "https://www.youtube.com/watch?v=vfzfwPo6MZ4", "ytcontrols": true }).ready(function () {
        // Cue a video using ended event
    });

    var codes = [
        {
            time: 100,
            code: "print 3+7"
        },
        {
            time: 110,
            code: "print(3+7)"
        },
        {
            time: 126,
            code: "print(3+7)\nprint(2-1)"
        },
        {
            time: 138,
            code: 'print(3+7)\nprint(2-1)\nprint("this is a chunk of text")'
        },
        {
            time: 244,
            code: 'print(type(3+7))\nprint(2-1)\nprint("this is a chunk of text")'
        },
        {
            time: 260,
            code: 'print(type(3+7))\nprint(2-1)\nprint(type("this is a chunk of text"))'
        },
        {
            time: 340,
            code: 'a = 3 + 5'
        },
        {
            time: 353,
            code: 'a = 3 + 5\na = a * a - a - 1'
        },
        {
            time: 363,
            code: 'a = 3 + 5\na = a * a - a - 1\nc = a * b'
        },
        {
            time: 385,
            code: 'a = 3 + 5\na = a * a - a - 1\nc = a * b\nprint(c)'
        },
        {
            time: 486,
            code: 'a = -6\na = a * a - a - 1\nc = a * b\nprint(c)'
        }
    ];
    var i = 0;
    $scope.video.on('timeupdate', function (e) {

        times = $scope.video.currentTime();
        angular.forEach(codes, function (code) {
            if (code.time <= times) {
                $scope.$apply(function () {
                    $scope.code = code.code;
                });
            }
        });
    });
    $scope.inputCallback = function (callback) {
        $scope.jqconsole.Input(function (result) {
            var e;
            try {
                callback(result);
            } catch (_error) {

            }
        });
    };

    $scope.outputCallback = function (output, cls) {
        if (output) {
            $scope.kq = output;
        }
    };

    $scope.errorCallback = function (e) {
    };

    $scope.timeoutCallback = function () {
    };

    $scope.resultCallback = function (result) {
        console.log(result);
        /*) var code, error_msg, isSuccess, output, resultObj, result_val, _ref;
         if (result && typeof result === 'object') {
         resultObj = result;
         result_val = resultObj.result;
         code = resultObj.code;
         output = resultObj.output;
         if (result_val) {
         if (result_val[-1] !== '\n') {
         result = result_val + '\n';
         }
         } else {
         result = '';
         }
         error_msg = null;
         isSuccess = false;
         if (resultObj.type === 'evalSolution') {
         if (result_val === 'true' || result_val === 'True') {
         isSuccess = true;
         } else if (result_val !== 'false' && result_val !== 'False') {
         error_msg = result_val;
         }
         if (isSuccess) {
         //                    $scope.get_current_project().index += 1;
         //                    $scope.jqconsole.Write($scope.get_current_checkpoint().entry_html + $scope.get_current_checkpoint().instruction_html, 'log', false);
         //                    $scope.startPrompt();
         //return this.ShowCongratulations();
         } else {
         //this.exercises_fail_detail[this.Exercises[this.Exercises.CurrentLang][this.Exercises.CurrentExercise].ExerciseID] += 1;
         //return this.ShowRetryAnswerPrompt(msg);
         //                    $scope.jqconsole.Write('<span style="color: crimson">Oops, Hãy thử lại!.<br><span style="color: #F80">' + utf8_decode(result_val) + '</span></span>', 'log', false);
         //                    $scope.startPrompt();
         }
         } else if (resultObj.type === 'evalUser') {
         if(result){
         alert(result);
         }
         result = result_val;
         if (!result) {
         result = '';
         }
         if (!code) {
         code = '';
         }
         if (!output) {
         output = '';
         }

         }
         } else if (result) {
         alert(result);
         }*/
    };
    $scope.jsrepl = new JSREPL({
        input: $scope.inputCallback,
        output: $scope.outputCallback,
        result: $scope.resultCallback,
        error: $scope.errorCallback,
        timeout: {
            time: 30000,
            callback: $scope.timeoutCallback
        }
    });


    $scope.runCode = function () {
        console.log($scope.jsrepl);
        dataObj = {
            command: $scope.code ,
            testScript: '',
            type: 'evalUser'
        };
        $scope.jsrepl.sandbox.post({
            type: 'engine.EasyLearnCode_Eval',
            data: dataObj
        });
    };

    $scope.reSet = function () {
            $scope.code = "";
    };

    $scope.jsrepl.loadLanguage("python", function () {
    });
}]);