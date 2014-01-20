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
    angular.module("easylearncode.contest", ["ui.bootstrap", "ui.ace", "easylearncode.core", "timer"]);
    angular.module("easylearncode.home", ["ui.bootstrap", "easylearncode.core"]);
    angular.module("easylearncode.game", ["easylearncode.core"]);
    angular.module("easylearncode.learn", ["ui.bootstrap", "ui.ace", "easylearncode.core"]);
    angular.module("easylearncode.practise", ["ui.bootstrap", "ui.ace", "easylearncode.core"]);
    angular.module("easylearncode.info", ["ui.bootstrap", "easylearncode.core", "ngAnimate"]);
    angular.module("easylearncode.user_profile", ["easylearncode.core"]);

    angular.module("easylearncode.contest_result", ["easylearncode.core"]);
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
angular.module("services.utility").factory("md5", [ function () {
    var md5 = {
        createHash: function (str) {
            var xl;
            var rotateLeft = function (lValue, iShiftBits) {
                return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
            };
            var addUnsigned = function (lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = lX & 2147483648;
                lY8 = lY & 2147483648;
                lX4 = lX & 1073741824;
                lY4 = lY & 1073741824;
                lResult = (lX & 1073741823) + (lY & 1073741823);
                if (lX4 & lY4) {
                    return lResult ^ 2147483648 ^ lX8 ^ lY8;
                }
                if (lX4 | lY4) {
                    if (lResult & 1073741824) {
                        return lResult ^ 3221225472 ^ lX8 ^ lY8;
                    } else {
                        return lResult ^ 1073741824 ^ lX8 ^ lY8;
                    }
                } else {
                    return lResult ^ lX8 ^ lY8;
                }
            };
            var _F = function (x, y, z) {
                return x & y | ~x & z;
            };
            var _G = function (x, y, z) {
                return x & z | y & ~z;
            };
            var _H = function (x, y, z) {
                return x ^ y ^ z;
            };
            var _I = function (x, y, z) {
                return y ^ (x | ~z);
            };
            var _FF = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _GG = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _HH = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var _II = function (a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };
            var convertToWordArray = function (str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - lByteCount % 4) / 4;
                    lBytePosition = lByteCount % 4 * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
                    lByteCount++;
                }
                lWordCount = (lByteCount - lByteCount % 4) / 4;
                lBytePosition = lByteCount % 4 * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };
            var wordToHex = function (lValue) {
                var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = lValue >>> lCount * 8 & 255;
                    wordToHexValue_temp = "0" + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
            };
            var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            x = convertToWordArray(str);
            a = 1732584193;
            b = 4023233417;
            c = 2562383102;
            d = 271733878;
            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
                d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
                c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
                b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
                a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
                d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
                c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
                b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
                a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
                d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
                c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
                b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
                a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
                d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
                c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
                b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
                a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
                d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
                c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
                b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
                a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
                d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
                c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
                b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
                a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
                d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
                c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
                b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
                a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
                d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
                c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
                b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
                a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
                d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
                c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
                b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
                a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
                d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
                c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
                b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
                a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
                d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
                c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
                b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
                a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
                d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
                c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
                b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
                a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
                d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
                c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
                b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
                a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
                d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
                c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
                b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
                a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
                d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
                c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
                b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
                a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
                d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
                c = _II(c, d, a, b, x[k + 2], S43, 718787259);
                b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return temp.toLowerCase();
        }
    };
    return md5;
} ]);
angular.module("easylearncode.contest").controller("ContestCtrl", ["$scope", "$http", "csrf_token", function ($scope, $http, csrf_token) {
    var curr = new Date(); // get current date
    curr.setHours(0, 0, 0, 0);
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 8;
    $scope.endtime = new Date(curr.setDate(last)).getTime();
    $scope.langs = [
        {
            name: 'Python',
            mode: 'python',
            lang: 'PYTHON',
            active: true,
            source: ""
        },
        {
            name: 'Java',
            mode: 'java',
            lang: 'JAVA',
            active: false,
            source: ""
        },
        {
            name: 'C++',
            mode: 'c_cpp',
            lang: 'CPP',
            active: false,
            source: ""

        }
    ]

    $http.get('/contest/get_thisweek_contest').success(function (data) {
        if (data.status == 1) {
            //$scope.error = "Chưa có đề thi";
            //alert("hi");
            $(function () {
                $('#myModal1').modal();
            });
        }
        else {
            $scope.thisweek_contest = data;
        }

    });
    $scope.resetCode = function () {
        $scope.langs = [
            {
                name: 'Python',
                mode: 'python',
                lang: 'PYTHON',
                active: true,
                source: ""
            },
            {
                name: 'Java',
                mode: 'java',
                lang: 'JAVA',
                active: false,
                source: ""
            },
            {
                name: 'C++',
                mode: 'c_cpp',
                lang: 'CPP',
                active: false,
                source: ""

            }
        ]
    };
    $scope.submitCode = function () {
        angular.forEach($scope.langs, function (lang) {
            if (lang.active) {
                $http.post('/contest/submit', {"key": $scope.thisweek_contest.test_key, "source": lang.source,
                    "_csrf_token": csrf_token, "lang": lang.lang}).success(function (data) {
                    if (data.status == 1) {
                        window.location = "/contest/result"
                    }

                });
            }
        });
    }
    $scope.compiling = false;
    $scope.compile_result = [];
    $scope.runCode = function () {
        angular.forEach($scope.langs, function (lang) {
            if (lang.active) {
                $scope.compiling = true;
                $scope.compile_result = new Array();
                angular.forEach($scope.thisweek_contest.test_case, function (test) {
                    $http.post('/run_code', {"_csrf_token": csrf_token, input: test.input, "lang": lang.lang, "source": lang.source}).success(function (data, status, headers, config) {
                        $scope.compile_result.push(
                            {
                                'result': data.run_status.output.trim() == test.output.trim(),
                                'time': data.run_status.time_used,
                                'memory': data.run_status.memory_used,
                                'error': data.compile_status
                            }
                        );
                        if ($scope.compile_result.length == $scope.thisweek_contest.test_case.length) {
                            $scope.compiling = false;
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.compile_result.push(
                            {
                                'result': false,
                                'time': 0,
                                'memory': 0,
                                'error': 'Disconnect from server...Please try again'
                            });
                    });
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
        $scope.video = videojs('video-content', {"techOrder": ["youtube"], "src": "https://www.youtube.com/watch?v=vfzfwPo6MZ4", "ytcontrols": true  }).ready(function () {
        });

        var codes = [
            {
                time: 100,
                code: "print 3+7",
                description: "mo ta"
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

        $scope.videoQuestion = videojs("video-content");
        $scope.videoQuestion.imageOverlay({
            image_url: "http://assets0.ordienetworks.com/misc/JimCarreyEyebrow.jpg",
            click_url: "https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewAlbum?id=624854547",
            opacity: 0.5,
            start_time: 10,
            end_time: 20
        });
        $scope.btnOk = function () {
            hideQuestion();
            alert('Chào các bạn');
        }


        var i = 0;
        $scope.video.on('timeupdate', function (e) {

            times = $scope.video.currentTime();
            angular.forEach(codes, function (code) {
                if (code.time <= times) {
                    $scope.$apply(function () {
                        $scope.code = code.code;
                        $scope.code = showQuestion();
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
                command: $scope.code,
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

angular.module("easylearncode.contest_result").controller('ContestResultCtrl', ['$scope', '$http', 'csrf_token', function ($scope, $http, csrf_token) {
    $http.get('/contest/get_thisweek_result').success(function (data) {
        if (data.status == 1) {

        }
        else {
            $scope.thisweek_contest = data;
        }

    });
}]);
    $scope.getThisResult = function () {
        $scope.currentWeek = true;
        $scope.thisweek_contest = new Array();
        $http.get('/contest/get_thisweek_result').success(function (data) {
            if (data.status == 1) {

angular.module("easylearncode.user_profile")
    .controller('UserProfileCtrl', ['$scope', '$http', 'userInfo', 'csrf_token', function ($scope, $http, userInfo, csrf_token) {
        $scope.showSuccessAlert = false;
        $scope.userInfo = userInfo;
        $scope.edit_mode = false;
        $scope.change_pass_mode = false;
        $scope.changeEditMode = function () {
            $scope.edit_mode = true;
        }
        $scope.changeEditPass = function(){
            $scope.change_pass_mode = true;
        }
        $scope.cancelEditMode = function () {
            $scope.edit_mode = false;
            $scope.userInfo = userInfo;
        }
        $scope.save = function () {
            $http.post('/settings/profile', {_csrf_token: csrf_token, username: $scope.userInfo.username, name: $scope.userInfo.name, lastname: $scope.userInfo.last_name}).success(function () {
                $scope.edit_mode = false;
                $scope.showSuccessAlert = true;
            })
        }
        $scope.savepass = function(){
            $http.post('/setting/profile/change_password', {_csrf_token: csrf_token, currentpass: $scope.userInfo.currentpassword, newpass:$scope.userInfo.newpassword}).success(function(){
                if (data.status == "ok"){
                    $scope.change_pass_mode = false;
                    $scope.showSuccessAlert = true;
                }
            })
        }
    }])
    .filter("md5", [ "md5", function (md5) {
        return function (text) {
            return text ? md5.createHash(text.toString().toLowerCase()) : text;
        };
    } ]);            }
            else {
                $scope.thisweek_contest = data;
            }

        });
    }
    $scope.currentWeek = true;
    $scope.getLastResult = function () {
        $scope.currentWeek = false;
        $scope.thisweek_contest = new Array();
        $http.get('/contest/get_lastweek_result').success(function (data) {
            if (data.status == 1) {

            }
            else {
                $scope.thisweek_contest = data;
            }

        });
    }
}]);

angular.module("easylearncode.practise").controller("PractiseCtrl", ["$scope", function ($scope) {
    $scope.exercise = {
        lang: 'python',
        source: 'print "Hello World"'
    };
}]);

angular.module("easylearncode.info").controller('InfoCtrl', ['$scope', function ($scope) {
    $scope.sections = [
        {
        name: 'Những tiết học căn bản đầu tiên về python',
        units: [
            {time: '10:00', description: 'Giới thiệu về chương trình, loại dữ liệu và giá trị.', src: "/learn"},
            {time: '10:00', description: 'Số nhị phân.', src: "/learn"},
            {time: '10:00', description: 'List trong Python', src: "/learn"},
        ]
        },
        {
        name: 'Những tiết học căn bản đầu tiên về python2',
        units: [
            {time: '10:00', description: 'Giới thiệu về chương trình, loại dữ liệu và giá trị.', src: "/learn"},
            {time: '10:00', description: 'Số nhị phân.', src: "/learn"},
            {time: '10:00', description: 'List trong Python', src: "/learn"},
        ]
        }
    ];
    $scope.toggle = function (section) {
        section.toggle = !section.toggle;
    }
}])
;