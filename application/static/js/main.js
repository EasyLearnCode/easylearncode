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
(function () {
    angular.module("easylearncode.core", ["ngResource", "services", "controllers", "directives", "oldFilters", "oldMeta"]);
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
    angular.module("easylearncode.courseCatalog", ["ngRoute", "easylearncode.core"]);
    angular.module("easylearncode.editor", ["easylearncode.core", "services.editor", "directives.editor", "controllers.editor", "services.lesson"]);
    angular.module("easylearncode.settings", ["easylearncode.core", "controllers.settings", "directives.location"]);
    angular.module("easylearncode.payment", ["easylearncode.core"]);
    angular.module("easylearncode.simple", ["easylearncode.core"]);
    angular.module("easylearncode.contest", ["ui.bootstrap", "ui.ace", "easylearncode.core", "timer"]);
    angular.module("easylearncode.home", ["ui.bootstrap", "easylearncode.core"]);
    angular.module("easylearncode.game", ["easylearncode.core"]);
    angular.module("easylearncode.learn", ["ui.bootstrap", "ui.ace", "easylearncode.core", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster", "info.vietnamcode.nampnq.videogular.plugins.youtube", "info.vietnamcode.nampnq.videogular.plugins.quiz", "ngSocial", "ngDisqus", "LocalStorageModule"]);
    angular.module("easylearncode.info", ["ui.bootstrap", "easylearncode.core", "ngAnimate"]);
    angular.module("easylearncode.contest_result", ["easylearncode.core"]);
    angular.module("easylearncode.contest_result_user", ["easylearncode.core"]);
    angular.module("easylearncode.core").config(["$locationProvider",
        function ($locationProvider) {
            $locationProvider.html5Mode(!1);
            $locationProvider.hashPrefix("!")
        }
    ])
})();
angular.module("easylearncode.core").run(function () {
    var indexOfValue = _.indexOf;

    // using .mixin allows both wrapped and unwrapped calls:
    // _(array).indexOf(...) and _.indexOf(array, ...)
    _.mixin({

        // return the index of the first array element passing a test
        indexOf: function (array, test) {
            // delegate to standard indexOf if the test isn't a function
            if (!_.isFunction(test)) return indexOfValue(array, test);
            // otherwise, look for the index
            for (var x = 0; x < array.length; x++) {
                if (test(array[x])) return x;
            }
            // not found, return fail value
            return -1;
        }

    });
})
angular.module("easylearncode.core").run(function run($http, csrf_token) {
    $http.defaults.headers.post['X-CSRFToken'] = csrf_token;
});
angular.module("easylearncode.core").service("api", ["$resource", function ($resource) {
    this.Model = $resource('/api/:type/:id');

}])
angular.module('easylearncode.learn')
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('easylearncode');
    }]);
angular.module("easylearncode.core").filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
angular.module("easylearncode.core")
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .filter("imageSize", ["$filter", function () {
        return function (a, d, b) {
            if (a) {
                b = 0 === b ? void 0 : b;
                d = 0 === d ? void 0 : d;
                if ("number" !== typeof d && "number" !== typeof b)
                    return a;
                var c = Math.max(b, d) || b || d;
                if (a.match(/\/\/[^.\/]+\.ggpht\.com\//) || a.match(/\/_ah\/img\//)) {
                    var e =
                        /#[\w=_\-&]*w=(\d+)&h=(\d+)/.exec(a);
                    e && (c = 1 * e[1], e = 1 * e[2], d = Math.min(b / e, d / c) || b / e || d / c, d = [c * d, e * d], a = a.replace(/\=s\d+(-c)?/, "=s" + Math.round(Math.max(d[0], d[1]))))
                } else
                    a.match(/\/\/robohash\.org\//) && c && (a = a + "?size=" + c + "x" + c);
                return a
            }
        }
    }]);
angular.module("controllers.header").controller('HeaderController', ['$scope', '$window', function ($scope, $window) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $window.location.pathname;
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
                return "string" === typeof c && "" === c.replace(/^\s\s*/, "").replace(/\s\s*$/, "") || undefined == c || "undefined" === typeof c || "boolean" === typeof c && !c ? {
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
angular.module("easylearncode.contest").controller("ContestCtrl",
    ["$scope", "api", "$http", "csrf_token", "channelToken", "$location",
        function ($scope, api, $http, csrf_token, channelToken, $location) {
            $scope.firstDayOfWeek = Date.parse("last monday");
            $scope.lastDayOfWeek = Date.parse("next sunday");
            $scope.nextfirstDayOfWeek = Date.parse("next monday");
            $scope.loaded = false;
            $scope.compiling = false;
            $scope.resultQuantity = 3;
            $scope.isShowCompileResult = false;
            $scope.compile_result = [];
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
            ];
            $scope.aceLoaded = function (_editor) {
                _editor.setOptions({
                    enableBasicAutocompletion: true
                });
            };
            $scope.viewResult = function (result) {
                $scope.current_level = result.level;
                $scope.resetCode();
                _.find($scope.langs, function (lang) {
                    if (lang.lang.toLocaleLowerCase() == result.language.toLocaleLowerCase()) {
                        lang.active = true;
                        lang.source = result.code.content;
                        return {}
                    }
                })
            }
            $scope.showMoreResult = function () {
                $scope.resultQuantity += 2;
            }
            $scope.changeCurrentLevel = function (level) {
                $scope.current_level = level;

            }
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


            $scope.submitCode = function (type) {

                type = type || "run";
                _.find($scope.langs, function (lang) {
                        if (lang.active) {
                            if (lang.source) {
                                if (type == 'submit') {

                                    bootbox.prompt("Nhập tên file", function (result) {
                                        if (result === null) {


                                        } else {
                                            $scope.compiling = true;
                                            $http.post('/api/contest/submit', {"weekly_quiz_level_key": $scope.current_level.Id, "source": lang.source,
                                                "_csrf_token": csrf_token, "lang": lang.lang, "type": type, 'filename': result}).success(function (data) {
                                                    $scope.isShowCompileResult = true;
                                                    $scope.compile_result = [];
                                                });
                                        }
                                    });
                                }
                                else {
                                    $scope.compiling = true;
                                    $http.post('/api/contest/submit', {"weekly_quiz_level_key": $scope.current_level.Id, "source": lang.source,
                                        "_csrf_token": csrf_token, "lang": lang.lang, "type": type, 'filename': ""}).success(function (data) {
                                            $scope.isShowCompileResult = true;
                                            $scope.compile_result = [];
                                        });
                                }

                            } else {
                                $(function () {
                                    $('#codeEmptyModal').modal();
                                });
                            }
                            return {};
                        }
                    }
                )
                ;
            }
            if ($location.search()['result_id']) {
                $http.get('/api/contest?recurse=True').success(function (data) {
                    if (_.isEmpty(data.data)) {
                        $(function () {
                            $('#noContestModal').modal();
                        });
                    } else {
                        $scope.current_week_data = data.data;
                        $scope.current_week_data.level_keys = _.sortBy($scope.current_week_data.level_keys, function (level) {
                            return level.level;
                        })
                        $http.get('/api/quizresults/' + $location.search()['result_id'] + '?recurse=True').success(function (data) {
                            $scope.current_level = data.level;
                            $scope.resetCode();
                            _.find($scope.langs, function (lang) {
                                if (lang.lang == data.language) {
                                    lang.active = true;
                                    lang.source = data.code.content;
                                    return {}
                                }
                            })
                        });


                        $http.get('/api/contest/info?user_id=me&recurse=True').success(function (data) {
                            $scope.current_week_user_data = data.data;
                            $scope.current_week_user_data.run_code_result = _.sortBy($scope.current_week_user_data.run_code_result,function (result) {
                                return result.created;
                            }).reverse();
                        })
                        $scope.loaded = true;
                    }

                });
            } else {
                $http.get('/api/contest?recurse=True').success(function (data) {
                    if (_.isEmpty(data.data)) {
                        $(function () {
                            $('#noContestModal').modal();
                        });
                    } else {
                        $scope.current_week_data = data.data;
                        $scope.current_week_data.level_keys = _.sortBy($scope.current_week_data.level_keys, function (level) {
                            return level.level;
                        })
                        $scope.current_level = _.find($scope.current_week_data.level_keys, function (level) {
                            return level.is_current_level;
                        });
                        $http.get('/api/contest/info?user_id=me&recurse=True').success(function (data) {
                            $scope.current_week_user_data = data.data;
                            $scope.current_week_user_data.run_code_result = _.sortBy($scope.current_week_user_data.run_code_result,function (result) {
                                return result.created;
                            }).reverse();
                        })
                        $scope.loaded = true;
                    }

                });
            }
            var channel = new goog.appengine.Channel(channelToken);

            var handler = {
                'onopen': function () {
                    console.log(arguments)
                },
                'onmessage': function (result) {
                    console.log(arguments);
                    result.data = JSON.parse(result.data);
                    if (result.data.type) {
                        if ((result.data.type == 'run_code_result' || result.data.type == 'submit_code_result')) {
                            $scope.compiling = false;
                            $scope.compile_result.push(result.data);
                            $scope.$apply();
                        }
                        else if (result.data.type == "submit_sumary_result") {

                            if (result.data.result) {
                                time_used = result.data.time_used;
                                memory_used = result.data.memory_used;
                                score = result.data.score;
                                bootbox.alert("Bạn đã qua level với thời gian " + time_used + " bộ nhớ " + memory_used + ". Điểm: " + score, function () {
                                    $http.get('/api/contest?recurse=True').success(function (data) {
                                        $scope.current_week_data = data.data;
                                        $scope.current_week_data.level_keys = _.sortBy($scope.current_week_data.level_keys, function (level) {
                                            return level.level;
                                        })
                                        $scope.current_level = api.Model.get({type: 'levels', id: result.data.next_level_key, recurse: true});
                                        $scope.resetCode();
                                    });
                                });
                                //TODO: Show sumary submit result
                                //TODO: Go to next level
                            } else {
                                bootbox.alert("Bạn không vượt qua level!", function () {

                                });
                            }
                            $http.get('/api/contest/info?user_id=me&recurse=True').success(function (data) {
                                $scope.current_week_user_data = data.data;
                                $scope.current_week_user_data.run_code_result = _.sortBy($scope.current_week_user_data.run_code_result,function (result) {
                                    return result.created;
                                }).reverse();
                            })

                        }
                    }
                },
                'onerror': function () {
                },
                'onclose': function () {
                }
            };
            var socket = channel.open(handler);

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
    $("[rel='tooltip']").tooltip();
}).controller('LearnCtrl', ['$scope', '$http', '$location', '$sce', '$compile', '$window', 'api', '$timeout', 'localStorageService', 'csrf_token', "$q", '$rootScope', 'VG_EVENTS', function ($scope, $http, $location, $sce, $compile, $window, api, $timeout, localStorageService, csrf_token, $q, $rootScope, VG_EVENTS) {
        var runCodeDeferred = $q.defer()
        $scope.loaded = false;
        $scope.showAlert = false;
        $scope.lectures = [];
        $scope.rate_lecture = null;
        $scope.rate = 3;
        $scope.max = 5;
        $scope.isReadonly = false;
        api.Model.query({type: 'lessons', filter: 'Lecture==' + $location.search()['lecture_id'] + '' }, function (data) {
            $scope.lessonCurrent = data[0]
            api.Model.query({type: 'courses', filter: 'Lesson==' + data[0].Id + '', recurse: true, depth: 6  }, function (data) {
                angular.forEach(data[0].lesson_keys, function (lesson) {
                    angular.forEach(lesson.lecture_keys, function (lecture) {
                        $scope.lectures.push(lecture);
                    })
                });
                $scope.lecture = _.where($scope.lectures, {Id: $location.search()['lecture_id']})[0];
                $scope.jsrepl.loadLanguage($scope.lessonCurrent.language.toLowerCase(), function () {
                    $scope.jsreplReady = true;
                });
                $scope.editor.getSession().setMode("ace/mode/"+$scope.lessonCurrent.language.toLowerCase()+"");
                $scope.loadLecture();
                $scope.loaded = true;
            })
        })
        $window.disqus_shortname = 'easylearncode2014';
        $scope.current_title = (document.title);
        $scope.getCurrentLectureIndex = function () {
            return _.indexOf($scope.lectures, function (lec) {
                return lec.Id == $location.search()['lecture_id'];
            })
        }
        $scope.current_url = (document.location.href);
        var c = document.getElementsByTagName('meta');
        for (var x = 0, y = c.length; x < y; x++) {
            if (c[x].name.toLowerCase() == "description") {
                $scope.current_description = c[x];
            }
        }
        $scope.isEditorFullScreen = false;
        $scope.aceLoaded = function (_editor) {
            $scope.editor = _editor;
            _editor.setOptions({
                enableBasicAutocompletion: true
            });
        }
        $scope.toggleFullScreen = function () {
            $scope.isEditorFullScreen = !$scope.isEditorFullScreen;
            if ($scope.isEditorFullScreen) {
                angular.element('body').css({'overflow': 'hidden'});
            } else {
                angular.element('body').css({'overflow': 'auto'});
            }
            $timeout(function () {
                $scope.editor.resize()
            }, 10);
        }
        $scope.lang =
        {
            name: 'Python',
            mode: 'python',
            lang: 'PYTHON',
            source: "'''\n# Read input from stdin and provide input before running code\n\nname = raw_input('What is your name?\\n')\nprint 'Hi, %s.' % name\n'''\nprint 'Hello World!'\n"
        };

        $scope.inputCallback = function (callback) {

        };

        $scope.outputCallback = function (output, cls) {

        };

        $scope.errorCallback = function (e) {
        };

        $scope.timeoutCallback = function () {
        };

        $scope.resultCallback = function (result) {
            var code, error_msg, isSuccess, output, resultObj, result_val, _ref;
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
                if (resultObj.type === 'eval_User') {
                    $scope.kq = '>> ' + output;
                }
                else if (resultObj.type === 'evalSolution') {
                    if (result_val === 'true' || result_val === 'True') {
                        isSuccess = true;
                    } else if (result_val !== 'false' && result_val !== 'False') {
                        error_msg = result_val;
                    }
                    if (isSuccess) {
                        if (localStorageService.get("score") == null) {
                            localStorageService.add("score", $scope.current_test.score);
                        }
                        else localStorageService.add("score", parseFloat(localStorageService.get("score")) + $scope.current_test.score);
                        $scope.$apply(function () {
                            data = {
                                result: true,
                                description: 'Chúc mừng bạn :D'
                            }
                            runCodeDeferred.resolve(data);
                        })

                    } else {
                        $scope.$apply(function () {
                            data = {
                                result: false,
                                description: utf8_decode(result_val)
                            }
                            runCodeDeferred.resolve(data);
                        })

                    }
                } else if (resultObj.type === 'evalUser') {
                    if (result) {
                        $scope.jqconsole.Write('==> ' + result, 'output');
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
                    result = JSON.stringify(result);
                    code = JSON.stringify(code);
                    output = JSON.stringify(output);
                    command = 'easylearncode_validate(' + result + ', ' + code + ', ' + output + ')';
                    command = command.replace(/#{/g, '\\#{');
                    dataObj = {
                        command: command,
                        testScript: $scope.current_test.test_script,
                        type: 'evalSolution'
                    };
                    $scope.jsrepl.sandbox.post({
                        type: 'engine.EasyLearnCode_Eval',
                        data: dataObj
                    });
                }
            } else if (result) {
                //$scope.jqconsole.Write('==> ' + result, 'output');
            }
        };

        $scope.onQuizSubmit = function (data) {
            console.log(data);
            if (data.type == "Quiz") {
                quizs = _.where($scope.lecture.quiz_keys, {Id: data.id});
                result = false;
                description = "";
                if (quizs.length == 0) {
                    description: "Có lỗi xin vui lòng kiểm tra lại!";
                }
                else {
                    answer = _.where(quizs[0].answer_keys, {Id: data.answer})
                    if (answer[0].is_true == true) {
                        result = true;
                        description = "Chúc mừng bạn đã trả lời đúng!";
                        if (localStorageService.get("score") == null) {
                            localStorageService.add("score", parseFloat(data.score));
                        }
                        else localStorageService.add("score", parseFloat(localStorageService.get("score")) + parseFloat(data.score));
                    }
                }
                return {
                    result: result,
                    description: description
                }
            } else if (data.type == "Test") {
                runCodeDeferred = $q.defer();
                tests = _.where($scope.lecture.test_keys, {Id: data.id});
                $scope.current_test = tests[0];
                dataObj = {
                    command: data.code,
                    testScript: '',
                    type: 'evalUser'
                };
                $scope.jsrepl.sandbox.post({
                    type: 'engine.EasyLearnCode_Eval',
                    data: dataObj
                });
                return runCodeDeferred.promise;
            }
        }
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
                type: 'eval_User'
            };
            $scope.jsrepl.sandbox.post({
                type: 'engine.EasyLearnCode_Eval',
                data: dataObj
            });
        };

        $scope.runCodeInHackerEarth = function () {
            $http.post('/api/runcode', {"lang": ""+$scope.lessonCurrent.language.toUpperCase()+"", "source": $scope.code,
                "_csrf_token": csrf_token}).success(function (data) {
                   if(data.compile_status == "OK"){
                       $scope.kq = ">>"+data.run_status.output
                   }
                   else $scope.kq = data.compile_status

                });
        }

        $scope.reSet = function () {
            $scope.code = "";
        }

        $scope.currentTime = 0;
        $scope.totalTime = 0;
        $scope.state = null;
        $scope.volume = 1;
        $scope.isCompleted = false;
        $scope.API = null;

        $scope.onPlayerReady = function (API) {
            $scope.API = API;
        };

        $rootScope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, function () {
            $scope.API.setSize(700, 380);
        })

        $scope.onCompleteVideo = function () {
            $scope.isCompleted = true;
            scores = 0;
            _.each($scope.config.plugins.quiz.data, function (elm, index) {
                scores = scores + elm.score;
            });
            //score = parseFloat(localStorageService.get("score"));
            //if (score * 100 / scores < 70) {
            $http.post('/api/users/me/passedLecture', {lecture_id: $scope.lecture.Id}).success(function (data) {
                console.log(data);
                cur_index = _.indexOf($scope.lectures, function (obj) {
                    return obj.Id == $scope.lecture.Id;
                });
                if (cur_index == $scope.lectures.length - 1) {
                    //Xử lý khi học hết khóa học
                } else {
                    $http.post('/api/users/me/currentLecture', {lecture_id: $scope.lectures[cur_index + 1].Id}).success(function (data) {

                    });
                }

            })
            //}
            $scope.$apply(function () {
                $scope.showAlert = true;
                $scope.alert = {
                    type: 'info',
                    msg: '<strong>Chúc mừng bạn đã hoàn thành bài học này !!!</strong><br>Bài kế tiếp<button class="btn btn-primary pull-right" onclick="nextLecture()">Tiếp tục</button><div class="clearfix"></div>'
                }
            })
        };
        $window.nextLecture = function () {
            cur_index = _.indexOf($scope.lectures, function (obj) {
                return obj.Id == $scope.lecture.Id;
            });
            if (cur_index >= $scope.lectures - 1 || cur_index < 0) return;
            if ($scope.lecture._is_passed_lecture == false) {
                api.Model.get({type: "lectures", id: $scope.lecture.Id, recurse: true, depth: 3}, function (data) {
                    $scope.lectures[cur_index]._is_current_lecture = data._is_current_lecture;
                    $scope.lectures[cur_index]._is_passed_lecture = data._is_passed_lecture;
                });
                api.Model.get({type: "lectures", id: $scope.lectures[cur_index + 1].Id, recurse: true, depth: 3}, function (data) {
                    $scope.lectures[cur_index + 1]._is_current_lecture = data._is_current_lecture;
                    $scope.lectures[cur_index + 1]._is_passed_lecture = data._is_passed_lecture;
                    console.log(data);
                    $scope.goLecture($scope.lectures[cur_index + 1]);
                });
            } else {
                $scope.goLecture($scope.lectures[cur_index + 1]);
            }
            $scope.showAlert = false;
        }

        $scope.onUpdateState = function (state) {
            $scope.state = state;
        };

        $scope.onUpdateTime = function (currentTime, totalTime) {
            $scope.currentTime = currentTime;
            $scope.totalTime = totalTime;
            angular.forEach($scope.lecture.code_keys, function (code) {
                if (currentTime - code.time < 2 && currentTime - code.time > 0) {
                    if ($scope.state == 'play')
                        $scope.code = code.content;
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
            $location.path("/").search('lecture_id', lecture.Id).replace();
            $scope.lecture = lecture;
            $scope.loadLecture();
        }
        $scope.loadLecture = function () {
            $scope.lesson_user = null;
            if (!$scope.lecture._is_passed_lecture && !$scope.lecture._is_current_lecture) {
                $scope.lecture = $scope.lectures[0];
                $location.path("/").search('lecture_id', $scope.lecture.Id).replace();
            }
            $http.get("/api/lessons?filter=Lecture==" + $scope.lecture.Id + "").success(function (data) {
                $scope.lessonCurrent = data[0];
                $http.get("/api/users/me").success(function (data) {
                    $http.get("/api/lesson_users?filter=user==" + data.Id + "&lesson==" + $scope.lessonCurrent.Id + "").success(function (lesson_user) {
                        $scope.lesson_user = lesson_user[0];
                        if ($scope.lesson_user == null) {
                            $http.post("/api/users/me/currentLecture", {lecture_id: $scope.lecture.Id}).success(function (data) {
                                console.log(data);
                            })
                        }
                    });
                });
            });
            $scope.youtubeUrl = $sce.trustAsResourceUrl("http://www.youtube.com/watch?v=" + $scope.lecture.youtube_id);
            $scope.show = false;
            if (angular.isDefined($scope.vgScope)) {
                $scope.vgScope.$destroy();
            }
            $scope.vgScope = $scope.$new(false);
            $('#video').html($compile("<videogular id=\"khung-video\"\r\n                                    vg-player-ready=\"onPlayerReady\" vg-complete=\"onCompleteVideo\" vg-update-time=\"onUpdateTime\" vg-update-size=\"onUpdateSize\" vg-update-volume=\"onUpdateVolume\" vg-update-state=\"onUpdateState\"\r\n                                    vg-width=\"config.width\" vg-height=\"config.height\" vg-theme=\"config.theme.url\" vg-autoplay=\"config.autoPlay\" vg-stretch=\"config.stretch.value\" vg-responsive=\"config.responsive\">\r\n<video preload='metadata' id=\"video_content\">\r\n<source type=\"video/youtube\" src=\"" + $scope.youtubeUrl + "\"  /></video>\r\n                                    <vg-youtube></vg-youtube>\r\n                                    <vg-quiz vg-data='config.plugins.quiz.data' vg-quiz-submit=\"onQuizSubmit\" vg-quiz-skip=\"onQuizSkip\" vg-quiz-continue=\"onQuizContinue\" vg-quiz-show-explanation=\"onQuizShowExplanation\"></vg-quiz>\r\n                                    <vg-poster-image vg-url='config.plugins.poster.url' vg-stretch=\"config.stretch.value\"></vg-poster-image>\r\n                                    <vg-buffering></vg-buffering>\r\n                                    <vg-overlay-play vg-play-icon=\"config.theme.playIcon\"></vg-overlay-play>\r\n\r\n                                    <vg-controls vg-autohide=\"config.autoHide\" vg-autohide-time=\"config.autoHideTime\" style=\"height: 50px;\">\r\n                                        <vg-play-pause-button vg-play-icon=\"config.theme.playIcon\" vg-pause-icon=\"config.theme.pauseIcon\"></vg-play-pause-button>\r\n                                        <vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>\r\n                                        <vg-scrubBar>\r\n                                            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>\r\n                                        </vg-scrubBar>\r\n                                        <vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>\r\n                                        <vg-volume>\r\n                                            <vg-mutebutton\r\n                                                vg-volume-level-3-icon=\"config.theme.volumeLevel3Icon\"\r\n                                                vg-volume-level-2-icon=\"config.theme.volumeLevel2Icon\"\r\n                                                vg-volume-level-1-icon=\"config.theme.volumeLevel1Icon\"\r\n                                                vg-volume-level-0-icon=\"config.theme.volumeLevel0Icon\"\r\n                                                vg-mute-icon=\"config.theme.muteIcon\">\r\n                                            </vg-mutebutton>\r\n                                            <vg-volumebar></vg-volumebar>\r\n                                        </vg-volume>\r\n                                        <vg-fullscreenButton vg-enter-full-screen-icon=\"config.theme.enterFullScreenIcon\" vg-exit-full-screen-icon=\"config.theme.exitFullScreenIcon\"></vg-fullscreenButton>\r\n                                    </vg-controls>\r\n                                </videogular>")($scope.vgScope));
            localStorageService.remove("score");
            $scope.config.plugins.quiz.data = $scope.lecture.quiz_keys;
            angular.forEach($scope.lecture.test_keys, function (test) {
                $scope.config.plugins.quiz.data.push(test);
            });
            console.log($scope.config.plugins.quiz.data);
            $scope.rate_lecture = null;
            $http.get("/api/users/me").success(function (data) {
                $http.get("/api/rates?filter=User==" + data.Id + "&filter=Lecture==" + $scope.lecture.Id + "").success(function (rate) {
                    console.log(rate[0]);
                    if (rate.length > 0)
                        $scope.rate_lecture = rate[0];
                    if ($scope.rate_lecture != null) {
                        $scope.rate = $scope.rate_lecture.rate;
                        $scope.isReadonly = true;
                    }
                })
            });
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

        $scope.setRate = function () {
            if ($scope.isReadonly == true) return;
            $scope.isReadonly = true;
            $http.get("/api/users/me").success(function (data) {
                console.log(data);
                if ($scope.rate_lecture == null) {
                    $scope.rate_lecture = {
                        rate: $scope.rate,
                        lecture_key: $scope.lecture.Id,
                        user_key: data.Id
                    }
                    api.Model.save({type: 'rates'}, $scope.rate_lecture);
                } else {
                    $scope.rate_lecture.rate = $scope.rate;
                    api.Model.save({type: 'rates', id: $scope.rate_lecture.Id}, $scope.rate_lecture)
                }
            });
        }
        $scope.editRate = function () {
            $scope.isReadonly = false;
        }
        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            if (value < 3) $scope.strRate = "Chưa tốt";
            else if (value == 3) $scope.strRate = "Tốt";
            else $scope.strRate = "Rất tốt"
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
            $scope.API.pause();
        }
        $scope.$on('$locationChangeSuccess', function () {
            $scope.current_url = (document.location.href);
        });
    }]).directive('hoverClass', function () {
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

angular.module("easylearncode.contest_result_user").controller('ContestResultUserCtrl',
    ['$scope', 'api', '$http', 'csrf_token', '$location', function ($scope, api, $http, csrf_token, $location) {
        $http.get('/api/contest/info?user_id=me&recurse=True').success(function (data) {
            $scope.current_week_user_data = data.data;
            $scope.current_week_user_data.run_code_result = _.sortBy($scope.current_week_user_data.run_code_result,function (result) {
                return result.created;
            }).reverse();
        })
    }]);
angular.module("easylearncode.contest_result").controller('ContestResultCtrl', ['$scope', 'api', '$http', 'csrf_token', '$location', function ($scope, api, $http, csrf_token, $location) {
    yearcurrent = (new Date()).getFullYear();
    monthcurrent = (new Date()).getMonth() + 1;
    $scope.months = [
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6},
        {value: 7},
        {value: 8},
        {value: 9},
        {value: 10},
        {value: 11},
        {value: 12}
    ];
    _.find($scope.months, function (month) {
        if (month.value == monthcurrent) {
            $scope.month = month;
            return {}
        }
    })
    $scope.years = [
        {value: yearcurrent},
        {value: yearcurrent - 1},
        {value: yearcurrent - 2},
        {value: yearcurrent - 3},
        {value: yearcurrent - 4},
        {value: yearcurrent - 5}
    ]
    $scope.year = $scope.years[0];
    $scope.weeks = new Array();
    var date_start = (new Date($scope.year.value, $scope.month.value - 1, 1)).toISOString();
    var date_finish = (new Date($scope.year.value, $scope.month.value, 0)).toISOString();
    $http.get('/api/quizs?recurse=true&filter=start_date>=' + date_start + '&filter=start_date<=' + date_finish).success(function (data) {
        $scope.weeks = data;
    });
    $http.get('/api/contest?recurse=True').success(function (data) {
        if (_.isEmpty(data.data)) {
        } else {
            $scope.results = data.data.top_player;
            $scope.currentWeek = data.data.Id;
        }

    });
    $scope.get_weeks = function () {
        $scope.weeks = new Array();
        var date_start = (new Date($scope.year.value, $scope.month.value - 1, 1)).toISOString();
        var date_finish = (new Date($scope.year.value, $scope.month.value, 0)).toISOString();
        $http.get('/api/quizs?recurse=true&filter=start_date>=' + date_start + '&filter=start_date<=' + date_finish).success(function (data) {
            $scope.weeks = data;
            $scope.results = new Array();
            $scope.currentWeek = 0;
            $scope.details = new Array();
        });
    }

    $scope.getThisResult = function (key) {
        $http.get('/api/contest?recurse=True&Id=' + key).success(function (data) {
            if (_.isEmpty(data.data)) {
            } else {
                $scope.results = data.data.top_player;
                $scope.currentWeek = data.data.Id;
                $scope.details = new Array();
            }

        });
    }
    $scope.get_detail = function (key) {
        $http.get('/api/contest/info?recurse=True&Id=' + $scope.currentWeek + "&user_id=" + key).success(function (data) {
            $scope.details = data.data;
            $scope.details.run_code_result = _.sortBy($scope.details.run_code_result,function (result) {
                return result.created;
            }).reverse();
        })
    }
    $scope.resultQuantity = 5;

}]);

angular.module("easylearncode.info").controller('InfoCtrl', ['$scope', '$http', '$location', 'api', '$window', function ($scope, $http, $location, api, $window) {
    var course_id = $location.search()['course_id'];
    $scope.loaded = false;
    api.Model.get({type: 'courses', id: course_id, recurse: true, depth: 1000}, function (data) {
        $scope.loaded = true;
        $scope.course = data;
        $scope.loaded = true;
    });
    $window.onscroll = function () {
        var e = $(window).scrollTop(), n = $("#footer").offset().top - 130, r = $("#current-curriculum"), i = r.offset().top - 100, o = {position: r[0].style.position, top: r[0].style.top};
        if (e + r.height() >= n) {
            if (r.css("position") === "fixed") {
                var s = n - r.height() + 30;
                r.css({position: "absolute", top: s > 0 ? s : 0})
            }
        } else
            e >= i ? r.css({position: "fixed", top: 100 + "px"}) : e < i && r.css(o)
    };
}]);
angular.module("easylearncode.course_practice_detail", ["ui.bootstrap", "easylearncode.core", "ngAnimate"])
    .controller('InfoCtrl', ['$scope', 'api', '$location', '$window', function ($scope, api, $location, $window) {
        var course_id = $location.search()['course_id'];
        $scope.course = api.Model.get({type: 'courses', id: course_id, recurse: true, depth: 2});
        $window.onscroll = function () {
            var e = $(window).scrollTop(), n = $("#footer").offset().top - 130, r = $("#current-curriculum"), i = r.offset().top - 100, o = {position: r[0].style.position, top: r[0].style.top};
            if (e + r.height() >= n) {
                if (r.css("position") === "fixed") {
                    var s = n - r.height() + 30;
                    r.css({position: "absolute", top: s > 0 ? s : 0})
                }
            } else
                e >= i ? r.css({position: "fixed", top: 100 + "px"}) : e < i && r.css(o)
        };
    }]);
angular.module("easylearncode.course_practice_viewer", ["ui.bootstrap", "ui.ace", 'easylearncode.core', "ngRoute"])
    .config(["$routeProvider",function($routeProvider){
        $routeProvider.when(
            '/',{
                templateUrl:'/templates/angular/practice/practice.html',
                controller:'PracticeCtrl'
            }
        )
    }])
    .controller("PracticeCtrl", ["$scope", "$sce", "$timeout", "api", '$compile', "$window", '$location', '$http', function ($scope, $sce, $timeout, api, $compile, $window, $location, $http) {
        //TODO: Sort projects, checkpoints by index
        var jqconsole;
        var jsrepl;
        var exercise_item_id = $location.search()['exercise_item_id'];
        $scope.loaded = false;
        $scope.exercise_item = api.Model.get({type: 'exercise_items', id: exercise_item_id, recurse: true, depth: 3});
        $scope.jsreplReady = false;
        $scope.isEditorFullScreen = false;
        $scope.showAlert = false;
        $scope.showConsole = false;
        $scope.aceLoaded = function (_editor) {
            $scope.editor = _editor;
        }
        $scope.changeLanguage = function (lang) {
            $scope.editor.getSession().setMode("ace/mode/" + lang);
        }
        $scope.getCurrentProject = function(){
            result =  _.find($scope.exercise_item.projects, function(project){
                return project._is_current_project == true;
            })
            if (!result){
                $scope.exercise_item.projects[0]._is_current_project = true;
                result = $scope.exercise_item.projects[0];
            }
            return result;

        }
        $scope.getProgressExercises = function(){
            if(!$scope.exercise_item.projects){
                return {
                    index: 0,
                    total: 0
                }
            }
            var e = $scope.exercise_item.projects,
                t = $scope.getCurrentProject(),
                n = 0,
                r = 0,
                i = t.index,
                s = $scope.current_checkpoint.index;
            return _.each(e,function(e) {
                i > 0 ? n += e._checkpoints_count : i === 0 && (n += s + 1), i--, r += e._checkpoints_count
            }), {
                index: n,
                total: r
            }
        }
        $scope.toggleSection = function(e){
            var t = $(e.currentTarget);
            if (t.hasClass("is-active")) return !1;
            $(".js-section.is-active").removeClass("is-active").next(".js-section__content").collapse("hide");
            t.addClass("is-active").next(".js-section__content").collapse("show");
        }
        $scope.initDropDown = function(){
            $(".js-section").filter(".is-active").next(".js-section__content").collapse("show");
        }
        $scope.initCurrentCheckpoint = function(){
            var _current_checkpoint;
            _.find($scope.exercise_item.projects,function(project){
                 _.find(project.checkpoints,function(checkpoint){
                    if(checkpoint._is_current_checkpoint){
                        $scope.changeCurrentCheckpoint(checkpoint);
                        _current_checkpoint = checkpoint;
                        return {}
                    }
                });
            })
            if(!_current_checkpoint){
                $scope.exercise_item.projects[0]._is_current_project = true;
                $scope.exercise_item.projects[0].checkpoints[0]._is_current_checkpoint = true;
                $scope.changeCurrentCheckpoint($scope.exercise_item.projects[0].checkpoints[0]);
            }
        }
        $scope.toggleFullScreen = function () {
            $scope.isEditorFullScreen = !$scope.isEditorFullScreen;
            if ($scope.isEditorFullScreen) {
                angular.element('body').css({'overflow': 'hidden'});
                angular.element('.console-alert').addClass('full-screen');
            } else {
                angular.element('body').css({'overflow': 'auto'});
                angular.element('.console-alert').removeClass('full-screen');
            }
            $timeout(function () {
                $scope.editor.resize()
            }, 10);
        }
        $scope.runCode = function () {
            $scope.showConsole = true;
            jqconsole.Reset();
            dataObj = {
                command: $scope.source,
                testScript: '',
                type: 'evalUser'
            };
            jsrepl.sandbox.post({
                type: 'engine.EasyLearnCode_Eval',
                data: dataObj
            });
        }
        $scope.alert = {
            type: 'success', msg: 'Well done! You <a href="#">successfully</a> read this important alert message.'
        }
        $scope.changeCurrentCheckpoint = function (checkpoint) {
            _.each($scope.exercise_item.projects,function(project){
                project._is_current_project = false;
                _.each(project.checkpoints, function(_checkpoint){
                    _checkpoint._is_current_checkpoint = false;
                    if(_checkpoint.Id === checkpoint.Id){
                        project._is_current_project = true;
                        _checkpoint._is_current_checkpoint = true;
                    }
                })
            })
            $scope.current_checkpoint = checkpoint;
            $scope.source = $scope.current_checkpoint.default_files[0].content;
            $scope.showDropDownMenu = false;
        }
        $scope.inputCallback = function (callback) {
            jqconsole.Input(function (result) {
                var e;
                try {
                    callback(result);
                } catch (_error) {

                }
            });

        };
        $scope.outputCallback = function (output, cls) {
            if (output) {
                jqconsole.Write(output, cls);
            }
        };
        $scope.resultCallback = function (result) {
            var code, error_msg, isSuccess, output, resultObj, result_val, _ref;
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
                        $scope.$apply(function () {
                            $scope.showAlert = true;
                            $scope.alert = {
                                type: 'info',
                                msg: '<i class="fa fa-sun-o"></i> <strong>Tuyệt vời ông mặt trời!!!</strong><br>Tiếp tục nào<a class="btn btn-primary pull-right" onclick="nextCheckpoint()">Tiếp tục</a><div class="clearfix"></div>'
                            }
                            $http.post('/api/users/me/checkpoints',{checkpoint_id: $scope.current_checkpoint.Id, status:'passed', file:$scope.source}).success(function(data){
                                if(data.next_item){
                                    //TODO: Show success message
                                }
                            });
                        })
                    } else {
                        $scope.$apply(function () {
                            $scope.showAlert = true;
                            $scope.alert = {
                                type: 'danger',
                                msg: '<i class="fa fa-exclamation-triangle"></i><strong> Có điều gì lầm lẫn! </strong><br>' + utf8_decode(result_val)
                            }
                        })
                    }
                } else if (resultObj.type === 'evalUser') {
                    if (result) {
                        //$scope.jqconsole.Write('==> ' + result, 'output');
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
                    result = JSON.stringify(result);
                    code = JSON.stringify(code);
                    output = JSON.stringify(output);
                    command = 'easylearncode_validate(' + result + ', ' + code + ', ' + output + ')';
                    command = command.replace(/#{/g, '\\#{');
                    dataObj = {
                        command: command,
                        testScript: $scope.current_checkpoint.test_functions,
                        type: 'evalSolution'
                    };
                    jsrepl.sandbox.post({
                        type: 'engine.EasyLearnCode_Eval',
                        data: dataObj
                    });
                }
            } else if (result) {
                $scope.jqconsole.Write('==> ' + result, 'output');
            }
        };
        $scope.errorCallback = function (e) {
            $scope.jqconsole.Write(e, 'error');

        };
        $scope.timeoutCallback = function () {

        }
        $scope.exercise_item.$promise.then(
            function () {
                $scope.initCurrentCheckpoint();
                $scope.loaded = true;
                $timeout($scope.initDropDown);
                $timeout(function(){
                    jqconsole = $('#console').jqconsole('  >> EasyLearnCode Python Compiler v0.1 <<\n', '>>>');
                    jsrepl = new JSREPL({
                        input: $scope.inputCallback,
                        output: $scope.outputCallback,
                        result: $scope.resultCallback,
                        error: $scope.errorCallback,
                        timeout: {
                            time: 30000,
                            callback: $scope.timeoutCallback
                        }
                    });
                    jsrepl.loadLanguage($scope.getCurrentProject().language.toLowerCase(), function () {
                        $scope.$apply(function () {
                            $scope.jsreplReady = true;
                        })
                    });
                    $scope.changeLanguage($scope.getCurrentProject().language.toLowerCase());
                })
            });

        $timeout(function () {
            $window.nextCheckpoint = function () {
                $scope.showAlert = false;
                $scope.showConsole = false;
                _current_project = $scope.getCurrentProject();
                if(_current_project.index == $scope.exercise_item.projects.length - 1){
                    //TODO: Next exercise item
                }
                else{
                    if($scope.current_checkpoint.index == _current_project.checkpoints.length - 1){
                        _.each($scope.exercise_item.projects,function(project){
                            _.each(project.checkpoints, function(_checkpoint){
                                if(project.index == _current_project.index+1 && _checkpoint.index === 0){
                                    $scope.changeCurrentCheckpoint(_checkpoint);
                                    return {}
                                }
                            })
                        })
                    }else{
                        $scope.changeCurrentCheckpoint(_.find(_current_project.checkpoints, function(checkpoint){
                            return checkpoint.index == $scope.current_checkpoint.index+1;
                        }))
                    }
                }
                $scope.$apply();
            }
        })

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


angular.module("easylearncode.visualization", ["ui.bootstrap", "ui.ace", 'easylearncode.core', 'angularTreeview'])
    .controller("VisualizationCtrl", ["$scope", "$sce", "$timeout", function ($scope, $sce, $timeout) {
        var jqconsole = $('#console').jqconsole('  >> EasyLearnCode Python Compiler v0.1 <<\n', '>>>');
        $scope.jsreplReady = false;
        $scope.isEditorFullScreen = false;
        $scope.showConsole = false;
        $scope.aceLoaded = function (_editor) {
            $scope.editor = _editor;
        }
        $scope.toggleFullScreen = function () {
            $scope.isEditorFullScreen = !$scope.isEditorFullScreen;
            if ($scope.isEditorFullScreen) {
                angular.element('body').css({'overflow': 'hidden'});
            } else {
                angular.element('body').css({'overflow': 'auto'});
            }
            $timeout(function () {
                $scope.editor.resize()
            }, 10);
        }
        $scope.exercise = [
            {
                lang: 'python',
                source: 'print "Hello World"'
            },
            {
                lang: 'python',
                source: 'def Tinhtong(a, b): \r\n\treturn a + b \r\nprint Tinhtong(12, 33)'
            }
        ];

        $scope.updateVisualizationUrl = function () {
            src = "http://pythontutor.com/iframe-embed.html#code=" + encodeURIComponent($scope.TreeId.currentNode.code) + "&cumulative=false&heapPrimitives=false&drawParentPointers=false&textReferences=false&showOnlyOutputs=false&py=2&curInstr=0&codeDivWidth=350&codeDivHeight=400";
            $("#visualizationModal .modal-body").find("iframe").remove();
            var iframe = $('<iframe src="' + src + '" frameborder="0" width="800" height="500"></iframe>');
            $("#visualizationModal .modal-body").append(iframe);
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
                jqconsole.Write('==> ' + output);
            }
        };

        $scope.errorCallback = function (e) {
            jqconsole.Write(e, 'error');
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
            $scope.showConsole = true;
            jqconsole.Reset();
            dataObj = {
                command: $scope.TreeId.currentNode.code,//$scope.exercise[1].source,
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
            $scope.$apply(function () {
                $scope.jsreplReady = true;
            })
        });

        $scope.Tests =
            [
                { "title": "Phần 1: Kiến thức cơ bản về Python", "id": "LessonId1", "children": [
                    { "title": "Bài 1: Giới thiệu về chương trình, loại dữ liệu và giá trị", "id": "LectureId01", "children": [
                        {"description": "Lệnh print - Hiển thị một chuỗi, hoặc một biến nào đó là màn hình", "title": "Ví dụ 1.1", "id": "LessonId01", "code": 'print(3+7)\r\nprint(2-1) \r\nprint("this is a chunk of text")', "children": []},
                        {"title": "Ví dụ 1.2", "id": "LessonId02", "code": 'a = 3+5\r\nb= a*a-a-1\r\nc = a*b\r\nprint(c)', "children": []},
                        {"title": "Ví dụ 1.3", "id": "LessonId03", "code": 'a = -6\r\nb= a*a-a-1\r\nc = a*b\r\nif(a<0):\r\n\tprint(c)\r\nelse:\r\n\tprint(c-a)', "children": []},
                        {"title": "Ví dụ 1.4", "id": "LessonId04", "code": 'a = -6\r\nb= a*a-a-1\r\nc = a*b\r\nif(a<0):\r\n\tprint("a<0")\r\n\tprint(c)\r\nelse:\r\n\tprint("a is not less than 0")\r\n\tprint(c-a)\r\n\tprint("We are done with the program")', "children": []}
                    ]},
                    { "title": "Bài 3: List trong Python", "id": "LectureId03", "children": [
                        {"title": "Ví dụ 3.1", "id": "LessonId05", "code": "a =[1, 2, -7, 9, 11]\r\nprint(a)\r\na[1] = \"Sal's String\"\r\nprint (a)\r\nb=a\r\nprint(b)\r\nc = a[:]\r\nprint (c)\r\nb[0] = 0\r\nprint(b)\r\nprint(a)\r\nprint(c)\r\na.append(\"new elemen\")\r\nprint(a)\r\nprint(b)\r\nprint(c)", "children": []}
                    ]},
                    { "title": "Bài 4: Vòng lặp for trong python", "id": "LectureId04", "children": [
                        {"title": "Ví dụ 4.1", "id": "LessonId06", "code": "print range(6)\r\nprint range(7)\r\nprint range(1,7)\r\nprint range(0, 8, 2)\r\nprint range(3, 31, 3)", "children": []},
                        {"title": "Ví dụ 4.2", "id": "LessonId07", "code": "for i in range(5):\n    print i", "children": []},
                        {"title": "Ví dụ 4.3", "id": "LessonId08", "code": "sum = 0\r\nfor i in range(5):\r\n    sum = sum+i\r\n    print sum", "children": []}
                    ]},
                    { "title": "Bài 5: Vòng lặp while trong python", "id": "LectureId05", "children": [
                        {"title": "Ví dụ 5.1", "id": "LessonId09", "code": "#this while loop calculates the sum of 0 throunh 9 (including 9) and places\n#it in the variable \"sum\"\nsum = 0\ni = 0\nwhile i < 10:\n    sum = sum + i\n    print sum\n    i = i +1\n    \n#for i in range(10):\n#    sum = sum + i\n#    print sum", "children": []}
                    ]},
                    { "title": "Bài 6: Kiểu chuỗi trong python", "id": "LectureId06", "children": [
                        {"title": "Ví dụ 6.1", "id": "LessonId10", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\n", "children": []},
                        {"title": "Ví dụ 6.2", "id": "LessonId11", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\nprint a +b", "children": []},
                        {"title": "Ví dụ 6.3", "id": "LessonId12", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\nprint math_string.find('*')\nprint math_string.find('3')", "children": []},
                        {"title": "Ví dụ 6.4", "id": "LessonId13", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\nprint c.replace('i', 'o')\nprint c", "children": []},
                        {"title": "Ví dụ 6.5", "id": "LessonId14", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\nc = c.replace('i', 'o')\nprint c", "children": []},
                        {"title": "Ví dụ 6.6", "id": "LessonId15", "code": "a = \"My first test string\"\nb = 'Another test string that I have defined'\nc = \"this is Sal's string\"\nd = 'My favorite word is \"asparaus\", what is your?'\nmath_string = \"3+4*2\"\nexpression_string = \"a+' '+b+' tiger'\"\nprint a\nprint b\nprint c\nprint d\nprint math_string\nprint expression_string\nprint eval(math_string)\nprint eval(math_string + '1')", "children": []},
                    ]},
                    { "title": "Bài 7: Viết một chương trình đơn giản", "id": "LectureId07", "children": [
                        {"title": "Ví dụ 7.1", "id": "LessonId16", "code": "#Enter non-negative integer to take the factorial of:\nnumber = 10\n\nproduct = 1\nfor i in range(number):\n    product = product * (i+1)\n\nprint product", "children": []}
                    ]},
                    { "title": "Bài 11: Định nghĩa hàm trong python", "id": "LectureId08", "children": [
                        {"title": "Ví dụ 11.1", "id": "LessonId17", "code": "#returns the facturial of the argument \"number\"\ndef factorial(number):    \n    product = 1\n    for i in range(number):\n        product = product * (i+1)\n    return product\n\nprint factorial(10)", "children": []}
                    ]},
                    { "title": "Bài 13: Hàm đệ quy", "id": "LectureId09", "children": [
                        {"title": "Ví dụ 13.1", "id": "LessonId18", "code": "def factorial(number):\n    if number <= 1:\n        return 1\n    else:\n        return number*factorial(number -1)\n\nprint factorial(10)", "children": []}
                    ]},
                ]},
                { "title": "Phần 2: Python nâng cao", "id": "LessonId2", "children": [
                    { "title": "Bài 1", "id": "LectureId33", "children": [
                    ]}
                ]}
            ];
    }]);
angular.module("easylearncode.account", ["easylearncode.core", "ngRoute"]);
angular.module("easylearncode.account")
    .config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when("/password",
            {
                templateUrl: "/templates/angular/account/password.html",
                controller: "passwordTab"
            })
            .when("/my-courses",
            {
                templateUrl: "/templates/angular/account/my_courses.html",
                controller: "myCoursesTab"
            })
            .when("/linked-accounts",
            {
                templateUrl: "/templates/angular/account/linked_accounts.html",
                controller: "linkedAccountsTab"
            })
            .otherwise(
            {
                templateUrl: "/templates/angular/account/contact_info.html",
                controller: "contactInfoTab"
            })
    }])
    .controller("accountPage", ["$scope", "$location", function ($scope, $location) {
        $scope.isActive = function (path) {
            return $location.path() ? $location.path() === path : "/contact-info" === path
        }
    }])
    .controller("contactInfoTab", ["$scope", "api", "validator", "$window", '$http', function ($scope, api, validator, $window, $http) {
        $scope.saveDisabled = !1;
        $scope.showForm = !1;
        $scope.serverSuccess = "";
        $scope.serverError = "";
        $scope.contactInfoErrors = {};
        api.Model.get({'type': 'users', 'id': 'me'}, function (data) {
            $scope.user = data;
            $scope.showForm = !0
        })
        $scope.saveContactInfo = function () {
            if (!$scope.saveDisabled) {
                $scope.saveDisabled = !0;
                $scope.serverSuccess = "";
                $scope.serverError = "";
                var b;
                b = validator.check({setsFirstName: {pretty: "first name", value: $scope.user.name, validators: [
                    {type: "required"}
                ]}, setsLastName: {pretty: "last name", value: $scope.user.last_name, validators: [
                    {type: "required"}
                ]}, setsEmail: {pretty: "email address", value: $scope.user.email, validators: [
                    {type: "required", chained: [
                        {type: "email"}
                    ]}
                ]}});
                $scope.contactInfoErrors = b.errorText;
                b.valid ? $http.post('/settings/profile', {'name': $scope.user.name, 'last_name': $scope.user.last_name, 'username': $scope.user.username}).success(function (b) {
                    if (b.type == 'success') {
                        $scope.serverSuccess = "Contact Information Saved";
                        $window.location.reload()
                    } else {
                        $scope.serverError = b.msg;

                    }
                    $scope.saveDisabled = !1
                }).error(
                    function (b) {
                        $scope.serverError = b.error;
                        $scope.saveDisabled = !1
                    }) : $scope.saveDisabled = !1
            }
        }
    }])
    .controller("passwordTab", ["$scope", "api", "validator", "$http", function ($scope, api, validator, $http) {
        function reset() {
            $scope.currentPassword = "";
            $scope.newPassword = "";
            $scope.confirmedNewPassword = "";
            $scope.saveDisabled = !1
        }

        $scope.serverSuccess = "";
        $scope.serverError = "";
        reset();
        $scope.passwordErrors = {};
        $scope.showForm = !1;
        api.Model.get({'type': 'users', 'id': 'me'}, function (b) {
            $scope.user = b;
            $scope.showForm = !0
        });
        $scope.resetPassword = function () {
            if (!$scope.saveDisabled) {
                $scope.saveDisabled = !0;
                $scope.serverSuccess = "";
                $scope.serverError = "";
                var f;
                f = {setsNewPass: {pretty: "new password", value: $scope.newPassword,
                    validators: [
                        {type: "strLen", args: [6, void 0]}
                    ]}, setsConfirmedNewPass: {pretty: "new password confirmation", value: $scope.confirmedNewPassword, validators: [
                    {type: "required", failMsg: "A password confirmation is required.", disabled: "" === $scope.newPassword, chained: [
                        {type: "equal", args: [$scope.newPassword, "password"]}
                    ]}
                ]}};
                $scope.user._has_password !== null && (f.setsCurrPass = {pretty: "password", value: $scope.currentPassword, validators: [
                    {type: "required", failMsg: "The current password is required.", disabled: "" === $scope.newPassword && "" === $scope.confirmedNewPassword}
                ]});
                f = validator.check(f);
                $scope.passwordErrors = f.errorText;
                f.valid ? (f = {"current_password": $scope.currentPassword, "password": $scope.newPassword}, $http.post('/settings/password', f).success(function (b) {
                    if (b.type == 'success') {
                        $scope.serverSuccess = "Password successfully updated!";
                    } else {
                        $scope.serverError = b.msg;
                    }
                    reset()
                }).error(function (b) {
                        $scope.serverError = b.error;
                        reset()
                    })) : reset()
            }
        }
    }])
    .controller("linkedAccountsTab", ["$scope", "$timeout", "api",'$window','$http', function($scope, $timeout, api, $window, $http) {
        $scope.loading = !0;
        $scope.getLinkedAccountTypes = function() {
            if(!$scope.user||!$scope.user.used_providers){
                return [];
            }
            return _.union($scope.user.used_providers, $scope.user.unused_providers)
        };
        $scope.disconnect = function(provider) {
            $http.post('/social_login/'+provider.name+'/delete',{}).success(function(){
                $window.location.reload()
            })

        };
        $scope.connect = function(provider) {
            $scope.loading = !0;
            $window.location.href = '/social_login/'+provider.name;

        };
        api.Model.get({type:'users', id:'me'}).$promise.then(function(data) {
            $scope.loading = !1;
            $scope.user = data;
            _.each($scope.user.used_providers, function(provider){
                provider.used = true;
            })
        })
    }]);
angular.module("easylearncode.courseCatalog")
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/:collectionTitle",
            {
                templateUrl: "/templates/angular/course_catalog/all.html",
                controller: "courseList"
            }).otherwise({redirectTo: "/All"})
    }])
    .controller("courseCatalog", ["$scope", "api", function ($scope, api) {
        $scope.loaded = !1;
        $scope.loadingComplete = function () {
            $scope.loaded = !0
        };
        $scope.catalogPromise = api.Model.query({type: 'courses'});
    }])
    .controller("courseList", ["$scope", "$routeParams", "$timeout", "$location", "api", function ($scope, $routeParams, $timeout, $location, api) {
        $scope.activeCategoryTitle = $routeParams.collectionTitle || "All";
        $scope.catalogPromise || ($scope.catalogPromise = api.Model.query({type: 'courses'}));
        $scope.catalogPromise.$promise.then(function (data) {
            $scope.fullCourses = data;
            $scope.loadingComplete()
        })
    }])
    .directive("courseSummary", function () {
        var c = {beginner: 1, intermediate: 2, advanced: 3};
        return {
            scope: {
                course: "=",
                catagories: "="
            },
            templateUrl: "/templates/angular/course_catalog/course_summary.html",
            link: function (scope) {
                scope.scrollTop = function () {
                    $("html, body").animate({scrollTop: 0}, 500)
                }
            }}
    });
angular.module("easylearncode.teacher", ["ui.bootstrap", "ui.ace", 'easylearncode.core', 'ngRoute', 'angularjsFormBuilder', "ngResource", "ng-breadcrumbs", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster", "info.vietnamcode.nampnq.videogular.plugins.youtube", "info.vietnamcode.nampnq.videogular.plugins.quiz"])
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
    .service("formService", function () {
        var cleanData, parseData;
        this.setCleanDataFunc = function (cleanDataFunc) {
            cleanData = cleanDataFunc;
        }
        this.setParseDataFunc = function (parseDataFunc) {
            parseData = parseDataFunc;
        }
        this.getDataFromForm = function (form) {
            if (cleanData) {
                _form = cleanData(form);
            } else {
                _form = angular.copy(form);
            }
            var data = {}
            _.each(_form.form_fields, function (field) {
                data[field.field_name] = field.field_value;
            });
            return data;
        }
        this.fillFormData = function (form, data) {
            if (parseData) {
                _data = parseData(data);
            } else {
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
    .config(["$locationProvider", "$routeProvider", function ($locationProvider, $routeProvider) {
        $routeProvider
            .when("/",
            {
                templateUrl: "/templates/angular/teacher/course.html",
                controller: "CourseTeacherCtrl"
            })
            .when("/:courseId/lessons",
            {
                templateUrl: "/templates/angular/teacher/lesson.html",
                controller: "LessonTeacherCtrl",
                label: 'Lessons'
            })
            .when("/:courseId/lessons/:lessonId/lectures",
            {
                templateUrl: "/templates/angular/teacher/lecture.html",
                controller: "LectureTeacherCtrl",
                label: 'Lectures'
            })
            .when("/:courseId/lessons/:lessonId/lectures/:lectureId/questions",
            {
                templateUrl: "/templates/angular/teacher/question.html",
                controller: "QuestionLectureCtrl",
                label: 'Questions'
            })
            .otherwise({redirectTo: "/"})
    }])
    .config(["$locationProvider",
        function ($locationProvider) {
            $locationProvider.html5Mode(!1);
            $locationProvider.hashPrefix("!")
        }
    ])
    .controller("BreadCrumbsCtrl", ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
        $scope.breadcrumbs = breadcrumbs;
    }])
    .controller("CourseTeacherCtrl", ["$scope", "$sce", "$timeout", 'formService', 'formModalService','api', '$http', function ($scope, $sce, $timeout, formService, formModalService, api, $http) {

        $http.get("/api/users/me").success(function(data){
            $scope.user_curent = data;
            $http.get("api/courses?filter=author=="+data.Id+"").success(function(data){
                $scope.courses = data;
            })
        })
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
                }
            ]
        }
        var cleanData = function (form) {
            var _form = angular.copy(form);
            _.each(_form.form_fields, function (field) {
                if (field.field_name == "tags") {
                    field.field_value = field.field_value.split(',');
                }
                if (field.field_name == "is_available" || field.field_name == "is_new") {
                    field.field_value = field.field_value ? true : false;
                }
            });
            return _form;
        }
        var parseData = function (data) {
            var _data = angular.copy(data);
            for (prop in _data) {
                if (prop == "tags") {
                    _data[prop] = _data[prop].join(",");
                }
            }
            ;
            return _data;
        }
        formService.setCleanDataFunc(cleanData);
        formService.setParseDataFunc(parseData);
        $scope.showAddModal = function () {
            var addForm = $.extend(true, {}, form);
            formModalService.showFormModal(addForm, function (form) {
                var data = formService.getDataFromForm(form);
                data.author = $scope.user_curent.Id;
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
            editForm.form_fields = _.reject(editForm.form_fields, function (field) {
                return field.field_name == "adminKey"
            });
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
    .controller("LessonTeacherCtrl", ["$scope", "$sce", "$timeout", 'formService', 'formModalService','api', '$http', '$routeParams', function ($scope, $sce, $timeout, formService, formModalService, api, $http, $routeParams) {
        $scope.course = api.Model.get({type: 'courses', id: $routeParams.courseId, recurse: true, depth: 2});
        console.log($routeParams.courseId);
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
    }])
    .controller("LectureTeacherCtrl", ["$scope", "api", "$routeParams", '$http', 'formModalService', function ($scope, api, $routeParams, $http, formModalService) {
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
    }])
 .controller("QuestionLectureCtrl", ["$scope", "api", "$routeParams", '$modal', '$http', '$sce', '$compile', '$rootScope', "VG_EVENTS", 'formModalService', function ($scope, api, $routeParams, $modal, $http, $sce, $compile, $rootScope, VG_EVENTS, formModalService) {
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
        api.Model.query({type: 'lessons', filter: 'Lecture==' + $location.search()['lecture_id'] + '' }, function (data) {
            $scope.lesson = data[0];
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
angular.module("easylearncode.dashboard",["easylearncode.core", "angularMoment"])
    .constant('angularMomentConfig', {
        timezone: 'Asia/Ho_Chi_Minh' // optional
    })
    .controller("dashboardCtrl", ["$scope", "api", '$window', function($scope, api, $window){
        $window.moment.lang('vn');
        $scope.currentUser = api.Model.get({type:"users",id:'me'});
        $scope.currentUser.$promise.then(function(data){
            if(data._current_courses){
                $scope.current_courses = data._current_courses;
            }else{
                $scope.courses = api.Model.query({type:'courses'})
            }
        })
        $scope.getPercent = function(percent){
            return parseInt(percent*100)+'%';
        }

    }])
