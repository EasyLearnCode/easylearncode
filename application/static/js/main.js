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
    angular.module("easylearncode.learn", ["ui.bootstrap", "ui.ace", "easylearncode.core", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster", "info.vietnamcode.nampnq.videogular.plugins.youtube", "info.vietnamcode.nampnq.videogular.plugins.quiz"]);
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
angular.module("easylearncode.core").filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
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
    var first = curr.getDate() - (curr.getDay() + 6) % 7; // First day is the day of the month - the day of the week
    var last = first + 7;
    $scope.endtime = new Date(curr.setDate(last)).getTime();
    $scope.start = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date).getDate() - (((new Date()).getDay() + 6) % 7));
    $scope.end = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date).getDate() - ((((new Date()).getDay() + 6) % 7) - 6));
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

    $http.get('/api/contest/get_thisweek_contest').success(function (data) {
        if (data.status == 1) {
            //$scope.error = "Chưa có đề thi";
            //alert("hi");
            $(function () {
                //$('#myModal1').modal();
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
                $http.post('/api/contest/submit', {"key": $scope.thisweek_contest.this_quiz_level.quiz_level_key, "source": lang.source,
                    "_csrf_token": csrf_token, "lang": lang.lang}).success(function (data) {
                        if (data.status == 1) {
                            window.location = "/contest"
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
                angular.forEach($scope.thisweek_contest.this_quiz_level.test_case, function (test) {
                    $http.post('/api/run_code', {"_csrf_token": csrf_token, input: test.input, "lang": lang.lang, "source": lang.source}).success(function (data, status, headers, config) {
                        if (data.run_status.output) {
                            $scope.compile_result.push(
                                {
                                    'result': data.run_status.output.trim() == test.output.trim(),
                                    'time': data.run_status.time_used,
                                    'memory': data.run_status.memory_used,
                                    'error': data.compile_status
                                }
                            );
                        } else {
                            $scope.compile_result.push(
                                {

                                    'result': false,
                                    'time': 0,
                                    'memory': 0,
                                    'error': data.compile_status
                                }
                            );
                        }
                        if ($scope.compile_result.length == $scope.thisweek_contest.this_quiz_level.test_case.length) {
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
    $('#myTab a:last').tab('show');
}).controller('LearnCtrl', ['$scope', '$http', '$location', '$sce', '$compile', '$window', function ($scope, $http, $location, $sce, $compile, $window) {
        $scope.lecture_id = $location.search()['lecture_id'];
        /*$http.get('/api/Lecture/'+lecture_id).success(function(data){
         $scope.lecture_name = data.name;
         })*/
        $scope.lectures = [
            {
                title: "Giới thiệu về chương trình, loại dữ liệu và giá trị",
                description: "Viết một chương trình cơ bản. Khái niệm cơ bản của các kiểu dữ liệu, các biến và các báo cáo có điều kiện",
                time: 689,
                youtube_id: 'vfzfwPo6MZ4'
            },
            {
                title: "Số nhị phân",
                description: "Hiểu được thế nào là số đại diện.Giới thiệu số nhị phân",
                time: 114,
                youtube_id: '8vxI2F-Gu4E'
            },
            {
                title: "Danh sách (List) trong python",
                description: "Hiểu được cơ bản về list trong python",
                time: 701,
                youtube_id: 'QK0wgGPcVxg'
            },
            {
                title: "Vòng lặp for trong python",
                description: "Vòng lặp for cơ bản trong python",
                time: 615,
                youtube_id: 'l4kopWpjq9E'
            },
            {
                title: "Vòng lặp while trong python",
                description: "Một vòng lặp while có thể làm một điều tương tự như một vòng lặp for",
                time: 320,
                youtube_id: 'KfePraaexho'
            },
            {
                title: "Kiểu chuỗi trong python",
                description: "Thử nghiệm và xem chúng ta làm gì được với chuỗi",
                time: 838,
                youtube_id: 'iZAtkS0F-Zo'
            },
            {
                title: "Viết một chương trình đơn giản",
                description: "Viết một chương trình đơn giản với vòng lặp for",
                time: 689,
                youtube_id: 'ZyYp1V84Xqc'
            },
            {
                title: "Chạy chương trình từng bước",
                description: "Từng bước xem những gì xảy ra khi người dùng thử nhập vào một giá trị",
                time: 563,
                youtube_id: 'dn9XjHz33O8'
            },
            {
                title: "lưu đồ hoạt động của chương trình",
                description: "Lưu đồ hoạt động của chương trình",
                time: 689,
                youtube_id: 'EiR6cf8Towc'
            },
            {
                title: "Python 3 không tương thích với python 2",
                description: "Hiểu dduocj lý do tại sao các chương trình ví dụ sẽ không chạy trong Python 3 và làm thế nào để sửa chữa nó.",
                time: 322,
                youtube_id: 'WT-gS-8p7KA'
            },
            {
                title: "Định nghĩa hàm Python",
                description: "Định nghĩa hàm trong python",
                time: 552,
                youtube_id: 'JwO_25S_eWE'
            }
        ];
        $scope.selectedIndex = 1;
        $scope.lecture = $scope.lectures[$scope.lecture_id];
        $scope.lang =
        {
            name: 'Python',
            mode: 'python',
            lang: 'PYTHON',
            source: "'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?\\n')\nprint 'Hi, %s.' % name\n'''\nprint 'Hello World!'\n"
        };

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
                $scope.kq = '>>> ' + output;
                console.log(output);
            }
        };

        $scope.errorCallback = function (e) {
        };

        $scope.timeoutCallback = function () {
        };

        $scope.resultCallback = function (result) {
            console.log(result);
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
        }


        $scope.jsrepl.loadLanguage("python", function () {
        });

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

        $scope.onUpdateTime = function (currentTime, totalTime) {
            $scope.currentTime = currentTime;
            $scope.totalTime = totalTime;
            angular.forEach(codes, function (code) {
                if (code.time < currentTime) {
                    if ($scope.state == 'play')
                        $scope.code = code.code;
                }
            });
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
        $scope.goLecture = function (lecture, index) {
            $scope.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/watch?v=" + lecture.youtube_id);
            $scope.lecture.title = lecture.title;
            $scope.lecture.description = lecture.description;
            $scope.show = false;
            $scope.selectedIndex = index + 1;
            $scope.lecture_id = index;
            $('#video').html($compile("<videogular id=\"khung-video\"\r\n                                    vg-player-ready=\"onPlayerReady\" vg-complete=\"onCompleteVideo\" vg-update-time=\"onUpdateTime\" vg-update-size=\"onUpdateSize\" vg-update-volume=\"onUpdateVolume\" vg-update-state=\"onUpdateState\"\r\n                                    vg-width=\"config.width\" vg-height=\"config.height\" vg-theme=\"config.theme.url\" vg-autoplay=\"config.autoPlay\" vg-stretch=\"config.stretch.value\" vg-responsive=\"config.responsive\">\r\n                                    <video preload='metadata' id=\"video_content\">\r\n                                        <source type=\"video/youtube\" src=\"" + $scope.youtubeUrl + "\"  />\r\n                                        <!-- <source www.youtube.com/watch?v=vfzfwPo6MZ4 src=\"http://www.videogular.com/assets/videos/videogular.mp4\" type=\"video/mp4\">\r\n                                        <source src=\"http://www.videogular.com/assets/videos/videogular.webm\" type=\"video/webm\"> -->\r\n\r\n                                        <track kind=\"captions\" src=\"assets/subs/pale-blue-dot.vtt\" srclang=\"en\" label=\"English\" default></track>\r\n                                    </video>\r\n                                    <vg-youtube></vg-youtube>\r\n                                    <vg-quiz vg-data='config.plugins.quiz.data' vg-quiz-submit=\"onQuizSubmit\" vg-quiz-skip=\"onQuizSkip\" vg-quiz-continue=\"onQuizContinue\" vg-quiz-show-explanation=\"onQuizShowExplanation\"></vg-quiz>\r\n                                    <vg-poster-image vg-url='config.plugins.poster.url' vg-stretch=\"config.stretch.value\"></vg-poster-image>\r\n                                    <vg-buffering></vg-buffering>\r\n                                    <vg-overlay-play vg-play-icon=\"config.theme.playIcon\"></vg-overlay-play>\r\n\r\n                                    <vg-controls vg-autohide=\"config.autoHide\" vg-autohide-time=\"config.autoHideTime\" style=\"height: 50px;\">\r\n                                        <vg-play-pause-button vg-play-icon=\"config.theme.playIcon\" vg-pause-icon=\"config.theme.pauseIcon\"></vg-play-pause-button>\r\n                                        <vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>\r\n                                        <vg-scrubBar>\r\n                                            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>\r\n                                        </vg-scrubBar>\r\n                                        <vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>\r\n                                        <vg-volume>\r\n                                            <vg-mutebutton\r\n                                                vg-volume-level-3-icon=\"config.theme.volumeLevel3Icon\"\r\n                                                vg-volume-level-2-icon=\"config.theme.volumeLevel2Icon\"\r\n                                                vg-volume-level-1-icon=\"config.theme.volumeLevel1Icon\"\r\n                                                vg-volume-level-0-icon=\"config.theme.volumeLevel0Icon\"\r\n                                                vg-mute-icon=\"config.theme.muteIcon\">\r\n                                            </vg-mutebutton>\r\n                                            <vg-volumebar></vg-volumebar>\r\n                                        </vg-volume>\r\n                                        <vg-fullscreenButton vg-enter-full-screen-icon=\"config.theme.enterFullScreenIcon\" vg-exit-full-screen-icon=\"config.theme.exitFullScreenIcon\"></vg-fullscreenButton>\r\n                                    </vg-controls>\r\n                                </videogular>")($scope));
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
                            "time": "164",
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
        $scope.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/watch?v=vfzfwPo6MZ4");
        $scope.goLecture($scope.lectures[0], 0);

        $scope.rate = 7;
        $scope.max = 10;
        $scope.isReadonly = false;

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];

        $scope.ViewOnYoutube = function () {
            $window.open($scope.youtubeUrl + '#t=' + $scope.currentTime);
            $scope.state = 'pause';
        }


        $('#gplus-cm').html('<div class="g-comments" data-width="700" data-href="' + location.toString() + '" data-first_party_property="BLOGGER" data-view_type="FILTERED_POSTMOD">Loading Google+ Comments ...</div>');

    }]).directive('hoverClass', function () {
        return {
            restrict$scop: 'A',
            scope: {
                addClass: '@',
                removeClass: '@'
            },
            link: function (scope, element) {
                element.on('mouseenter', function () {
                    element.addClass(scope.addClass);
                    element.removeClass(scope.removeClass);
                });
                element.on('mouseleave', function () {
                    element.addClass(scope.removeClass);
                    element.removeClass(scope.addClass);
                });
            }
        };
    });

angular.module("easylearncode.contest_result").controller('ContestResultCtrl', ['$scope', '$http', 'csrf_token', '$location', function ($scope, $http, csrf_token, $location) {
    $http.get('/api/contest/week_result/current').success(function (data) {
        if (data.status == 1) {
        }
        else {
            $scope.thisweek_contest = data;
            $scope.currentWeek = $scope.thisweek_contest.week;
        }

    });

    $scope.getThisResult = function (key) {
        $scope.currentWeek = true;
        $scope.thisweek_contest = new Array();
        $http.get('/api/contest/week_result/' + key).success(function (data) {
            if (data.status == 1) {
            }
            else {
                $scope.thisweek_contest = data;
                $scope.currentWeek = $scope.thisweek_contest.week;
            }

        });
    }
}]);
angular.module("easylearncode.user_profile")
    .controller('UserProfileCtrl', ['$scope', '$http', 'userInfo', 'csrf_token', function ($scope, $http, userInfo, csrf_token) {
        $scope.showSuccessAlert = false;
        $scope.userInfo = userInfo;
        $scope.edit_mode = false;
        $scope.change_pass_mode = false;
        $scope.changeEditMode = function () {
            $scope.edit_mode = true;
        }
        $scope.changeEditPass = function () {
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
        $scope.savepass = function () {
            $http.post('/setting/profile/change_password', {_csrf_token: csrf_token, currentpass: $scope.userInfo.currentpassword, newpass: $scope.userInfo.newpassword}).success(function () {
                if (data.status == "ok") {
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
    } ]);

angular.module("easylearncode.practise").controller("PractiseCtrl", ["$scope", function ($scope) {
    $scope.exercise = {
        lang: 'python',
        source: 'print "Hello World"'
    };
}]);

angular.module("easylearncode.info").controller('InfoCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    var course_id = $location.search()['course_id'];
    $scope.course_name = "Python";
    $scope.course_description = "Khóa học ngôn ngữ lập trình pyhton";
    $scope.sections = [
        {
            name: 'Kiến thức cơ bản về python',
            units: [
                {time: '15:00', description: 'Giới thiệu về chương trình, loại dữ liệu và giá trị.', src: "/course/learn/viewer#!?lecture_id=0"},
                {time: '15:00', description: 'Số nhị phân.', src: "/course/learn/viewer#!?lecture_id=1"},
                {time: '15:00', description: 'List trong Python', src: "/course/learn/viewer#!?lecture_id=2"},
                {time: '15:00', description: 'Vòng lặp for trong python', src: "/course/learn/viewer#!?lecture_id=3"},
                {time: '15:00', description: 'Vòng lặp while trong python', src: "/course/learn/viewer#!?lecture_id=4"},
                {time: '15:00', description: 'Chuỗi trong python', src: "/course/learn/viewer#!?lecture_id=5"},
                {time: '15:00', description: 'Viết một chương trình đơn giản với python', src: "/course/learn/viewer#!?lecture_id=6"},
                {time: '15:00', description: 'Chạy từng bước chương trình', src: "/course/learn/viewer#!?lecture_id=7"},
                {time: '15:00', description: 'Lưu đồ hoạt động của chương trình', src: "/course/learn/viewer#!?lecture_id=8"},
                {time: '15:00', description: 'Python 3 không tương thích với python 2', src: "/course/learn/viewer#!?lecture_id=9"},
                {time: '15:00', description: 'Định nghĩa hàm Python', src: "/course/learn/viewer#!?lecture_id=10"}
            ]
        },
        {
            name: 'Python Nâng cao',
            units: [
                {time: '10:00', description: 'Giới thiệu về chương trình, loại dữ liệu và giá trị.', src: "/course/learn/viewer#!?lecture_id='+lecture_key"},
                {time: '10:00', description: 'Số nhị phân.', src: "/course/learn/viewer#!?lecture_id='+lecture_key"},
                {time: '10:00', description: 'List trong Python', src: "/course/learn/viewer#!?lecture_id='+lecture_key"},
            ]
        }
    ];
    /* $http({method: 'GET', url: '/api/Course/'+course_id}).
     success(function(data, status, headers, config) {
     $scope.course_name = data.name;
     $scope.course_description = data.description;
     $scope.sections = new Array();
     angular.forEach(data.lesson_keys,function(lesson_key){
     $http.get('/api/Lesson/'+lesson_key).success(function(data){
     data.units = new Array();
     var d = data;
     angular.forEach(data.lecture_keys, function(lecture_key){
     $http.get('/api/Lecture/'+lecture_key).success(function(data){
     data.src='/course/learn/viewer#!?lecture_id='+lecture_key;
     d.units.push(data);
     })
     })
     $scope.sections.push(data);
     })
     })
     }).
     error(function(data, status, headers, config) {
     // called asynchronously if an error occurs
     // or server returns response with an error status.
     });*/

    $scope.toggle = function (section) {
        section.toggle = !section.toggle;
        section.status = section.toggle ? "Ẩn" : "Hiện";
    }
}]);
angular.module("easylearncode.courses", ["easylearncode.core"]);
angular.module("easylearncode.course_paractice_detail", ["ui.bootstrap", "easylearncode.core", "ngAnimate"]).controller('InfoCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    var course_id = $location.search()['course_id'];
    $scope.course_name = "Python";
    $scope.course_description = "Khóa học ngôn ngữ lập trình pyhton";
    $scope.sections = [
        {
            name: 'Cú pháp python',
            units: [
                {time: '02:00', description: 'Cú pháp trong python', src: "/course/practice/viewer#!?exercise_id=cs101"},
                {time: '05:00', description: 'Thực hành tính một phép tính cơ bản', src: "/course/practice/viewer#!?exercise_id=cs101"},
            ]
        },
        {
            name: 'Chuỗi và cách in ra màn hình',
            units: [
                {time: '02:00', description: 'Chuỗi và cách in ra màn hình', src: "/course/practice/viewer#!?exercise_id=cs101"},
                {time: '05:00', description: 'Ngày và giờ', src: "/course/practice/viewer#!?exercise_id=cs101"},
            ]
        }
    ];
    $scope.toggle = function (section) {
        section.toggle = !section.toggle;
        section.status = section.toggle ? "Ẩn" : "Hiện";
    }
}]);
angular.module("easylearncode.course_paractice_viewer", ["ui.bootstrap", "ui.ace", 'easylearncode.core'])
    .controller("PracticeCtrl", ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {
        $scope.exercise = {
            lang: 'python',
            source: 'print "Hello World"'
        };

        $scope.updateVisualaztionUrl = function () {
            src = "http://pythontutor.com/iframe-embed.html#code=" + encodeURIComponent($scope.exercise.source) + "&cumulative=false&heapPrimitives=false&drawParentPointers=false&textReferences=false&showOnlyOutputs=false&py=2&curInstr=0&codeDivWidth=350&codeDivHeight=400";
            $("#visualaztionModal .modal-body").find("iframe").remove();
            var iframe = $('<iframe src="' + src + '" frameborder="0" width="800" height="500"></iframe>');
            $("#visualaztionModal .modal-body").append(iframe);
        }

    }])
    .directive('hoverClass', function () {
        return {
            restrict: 'A',
            scope: {
                addClass: '@',
                removeClass: '@'
            },
            link: function (scope, element) {
                element.on('mouseenter', function () {
                    element.addClass(scope.addClass);
                    element.removeClass(scope.removeClass);
                });
                element.on('mouseleave', function () {
                    element.addClass(scope.removeClass);
                    element.removeClass(scope.addClass);
                });
            }
        };
    });


angular.module("easylearncode.visualization", ["ui.bootstrap", "ui.ace", 'easylearncode.core'])
    .controller("VisualizationCtrl", ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {
        $scope.exercise = [
            {
                lang: 'python',
                source: 'print "Hello World"'
            },
            {
                lang: 'python',
                source:'def Tinhtong(a, b): \r\n\treturn a + b \r\nprint Tinhtong(12, 33)'
            }
        ];

        $scope.updateVisualaztionUrl = function () {
            src = "http://pythontutor.com/iframe-embed.html#code=" + encodeURIComponent($scope.exercise[1].source) + "&cumulative=false&heapPrimitives=false&drawParentPointers=false&textReferences=false&showOnlyOutputs=false&py=2&curInstr=0&codeDivWidth=350&codeDivHeight=400";
            $("#visualaztionModal .modal-body").find("iframe").remove();
            var iframe = $('<iframe src="' + src + '" frameborder="0" width="800" height="500"></iframe>');
            $("#visualaztionModal .modal-body").append(iframe);
        }

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
                $scope.result = output;
                $scope.$apply();
            }
        };

        $scope.errorCallback = function (e) {
        };

        $scope.timeoutCallback = function () {
        };

        $scope.resultCallback = function (result) {
            console.log(result);
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
                command: $scope.exercise[1].source,
                testScript: '',
                type: 'evalUser'
            };
            $scope.jsrepl.sandbox.post({
                type: 'engine.EasyLearnCode_Eval',
                data: dataObj
            });

        };

        $scope.reSet = function () {
            $scope.source = "";
        }


        $scope.jsrepl.loadLanguage("python", function () {
        });

    }])
    .directive('hoverClass', function () {
        return {
            restrict: 'A',
            scope: {
                addClass: '@',
                removeClass: '@'
            },
            link: function (scope, element) {
                element.on('mouseenter', function () {
                    element.addClass(scope.addClass);
                    element.removeClass(scope.removeClass);
                });
                element.on('mouseleave', function () {
                    element.addClass(scope.removeClass);
                    element.removeClass(scope.addClass);
                });
            }
        };
    });