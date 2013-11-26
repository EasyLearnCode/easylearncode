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