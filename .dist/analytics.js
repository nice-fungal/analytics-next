!function() {
    var __webpack_modules__ = {
        564: function(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            var isodate = __webpack_require__(264);
            function traverse(input, strict) {
                return void 0 === strict && (strict = !0), input && "object" == typeof input ? function(obj, strict) {
                    return Object.keys(obj).forEach((function(key) {
                        obj[key] = traverse(obj[key], strict);
                    })), obj;
                }(input, strict) : Array.isArray(input) ? function(arr, strict) {
                    return arr.forEach((function(value, index) {
                        arr[index] = traverse(value, strict);
                    })), arr;
                }(input, strict) : isodate.is(input, strict) ? isodate.parse(input) : input;
            }
            module.exports = traverse;
        },
        174: function(module) {
            function multiple(fn) {
                return function(obj, path, val, options) {
                    var key, normalize = options && function(val) {
                        return "function" == typeof val;
                    }(options.normalizer) ? options.normalizer : defaultNormalize;
                    path = normalize(path);
                    for (var finished = !1; !finished; ) loop();
                    function loop() {
                        for (key in obj) {
                            var normalizedKey = normalize(key);
                            if (0 === path.indexOf(normalizedKey)) {
                                var temp = path.substr(normalizedKey.length);
                                if ("." === temp.charAt(0) || 0 === temp.length) {
                                    path = temp.substr(1);
                                    var child = obj[key];
                                    return null == child ? void (finished = !0) : path.length ? void (obj = child) : void (finished = !0);
                                }
                            }
                        }
                        key = void 0, finished = !0;
                    }
                    if (key) return null == obj ? obj : fn(obj, key, val);
                };
            }
            function del(obj, key) {
                return obj.hasOwnProperty(key) && delete obj[key], obj;
            }
            function replace(obj, key, val) {
                return obj.hasOwnProperty(key) && (obj[key] = val), obj;
            }
            function defaultNormalize(path) {
                return path.replace(/[^a-zA-Z0-9\.]+/g, "").toLowerCase();
            }
            module.exports = multiple((function(obj, key) {
                if (obj.hasOwnProperty(key)) return obj[key];
            })), module.exports.find = module.exports, module.exports.replace = function(obj, key, val, options) {
                return multiple(replace).call(this, obj, key, val, options), obj;
            }, module.exports.del = function(obj, key, options) {
                return multiple(del).call(this, obj, key, null, options), obj;
            };
        },
        264: function(__unused_webpack_module, exports) {
            "use strict";
            var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
            exports.parse = function(iso) {
                var numericKeys = [ 1, 5, 6, 7, 11, 12 ], arr = matcher.exec(iso), offset = 0;
                if (!arr) return new Date(iso);
                for (var val, i = 0; val = numericKeys[i]; i++) arr[val] = parseInt(arr[val], 10) || 0;
                arr[2] = parseInt(arr[2], 10) || 1, arr[3] = parseInt(arr[3], 10) || 1, arr[2]--, 
                arr[8] = arr[8] ? (arr[8] + "00").substring(0, 3) : 0, " " === arr[4] ? offset = (new Date).getTimezoneOffset() : "Z" !== arr[9] && arr[10] && (offset = 60 * arr[11] + arr[12], 
                "+" === arr[10] && (offset = 0 - offset));
                var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
                return new Date(millis);
            }, exports.is = function(string, strict) {
                return "string" == typeof string && ((!strict || !1 !== /^\d{4}-\d{2}-\d{2}/.test(string)) && matcher.test(string));
            };
        },
        285: function(module) {
            "function" == typeof Object.create ? module.exports = function(ctor, superCtor) {
                superCtor && (ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }));
            } : module.exports = function(ctor, superCtor) {
                if (superCtor) {
                    ctor.super_ = superCtor;
                    var TempCtor = function() {};
                    TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor, ctor.prototype.constructor = ctor;
                }
            };
        },
        870: function(module, __unused_webpack_exports, __webpack_require__) {
            "use strict";
            var isodate = __webpack_require__(264), milliseconds = __webpack_require__(228), seconds = __webpack_require__(76), toStr = Object.prototype.toString;
            module.exports = function(val) {
                return value = val, "[object Date]" === toStr.call(value) ? val : function(value) {
                    return "[object Number]" === toStr.call(value);
                }(val) ? new Date((num = val) < 315576e5 ? 1e3 * num : num) : isodate.is(val) ? isodate.parse(val) : milliseconds.is(val) ? milliseconds.parse(val) : seconds.is(val) ? seconds.parse(val) : new Date(val);
                var value, num;
            };
        },
        228: function(__unused_webpack_module, exports) {
            "use strict";
            var matcher = /\d{13}/;
            exports.is = function(string) {
                return matcher.test(string);
            }, exports.parse = function(millis) {
                return millis = parseInt(millis, 10), new Date(millis);
            };
        },
        76: function(__unused_webpack_module, exports) {
            "use strict";
            var matcher = /\d{10}/;
            exports.is = function(string) {
                return matcher.test(string);
            }, exports.parse = function(seconds) {
                var millis = 1e3 * parseInt(seconds, 10);
                return new Date(millis);
            };
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, __webpack_require__.d = function(exports, definition) {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    };
    var __webpack_exports__ = {};
    !function() {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        let _version = "npm";
        function getVersionType() {
            return _version;
        }
        let _globalCDN, _globalAnalyticsKey = "analytics";
        function getGlobalAnalytics() {
            return window[_globalAnalyticsKey];
        }
        const getCDN = () => {
            const globalCdnUrl = (() => {
                var _a;
                return null != _globalCDN ? _globalCDN : null === (_a = getGlobalAnalytics()) || void 0 === _a ? void 0 : _a._cdn;
            })();
            return globalCdnUrl || "https://cdn.segment.com";
        };
        function helpers_isString(obj) {
            return "string" == typeof obj;
        }
        function helpers_isFunction(obj) {
            return "function" == typeof obj;
        }
        function helpers_isPlainObject(obj) {
            return "object" === Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        }
        function isOffline() {
            return !window.navigator.onLine;
        }
        for (var BUFFER, IDX = 256, HEX = []; IDX--; ) HEX[IDX] = (IDX + 256).toString(16).substring(1);
        function v4() {
            var num, i = 0, out = "";
            if (!BUFFER || IDX + 16 > 256) {
                for (BUFFER = Array(i = 256); i--; ) BUFFER[i] = 256 * Math.random() | 0;
                i = IDX = 0;
            }
            for (;i < 16; i++) num = BUFFER[IDX + i], out += 6 == i ? HEX[15 & num | 64] : 8 == i ? HEX[63 & num | 128] : HEX[num], 
            1 & i && i > 1 && i < 11 && (out += "-");
            return IDX++, out;
        }
        function dset(obj, keys, val) {
            keys.split && (keys = keys.split("."));
            for (var x, k, i = 0, l = keys.length, t = obj; i < l && "__proto__" != (k = "" + keys[i++]) && "constructor" !== k && "prototype" !== k; ) t = t[k] = i === l ? val : typeof (x = t[k]) == typeof keys ? x : 0 * keys[i] != 0 || ~("" + keys[i]).indexOf(".") ? {} : [];
        }
        class context_ContextCancelation {
            constructor(options) {
                var _a, _b, _c;
                this.retry = null === (_a = options.retry) || void 0 === _a || _a, this.type = null !== (_b = options.type) && void 0 !== _b ? _b : "plugin Error", 
                this.reason = null !== (_c = options.reason) && void 0 !== _c ? _c : "";
            }
        }
        class CoreContext {
            constructor(event, id = v4(), stats = "new NullStats()", logger = "new CoreLogger()") {
                this.attempts = 0, this.event = event, this._id = id, this.logger = logger, this.stats = stats;
            }
            static system() {}
            isSame(other) {
                return other.id === this.id;
            }
            cancel(error) {
                if (error) throw error;
                throw new context_ContextCancelation({
                    reason: "Context Cancel"
                });
            }
            log(level, message, extras) {
                this.logger.log(level, message, extras);
            }
            get id() {
                return this._id;
            }
            updateEvent(path, val) {
                var _a;
                if ("integrations" === path.split(".")[0]) {
                    const integrationName = path.split(".")[1];
                    if (!1 === (null === (_a = this.event.integrations) || void 0 === _a ? void 0 : _a[integrationName])) return this.event;
                }
                return dset(this.event, path, val), this.event;
            }
            failedDelivery() {
                return this._failedDelivery;
            }
            setFailedDelivery(options) {
                this._failedDelivery = options;
            }
            logs() {
                return this.logger.logs;
            }
            flush() {
                this.logger.flush(), this.stats.flush();
            }
            toJSON() {
                return {
                    id: this._id,
                    event: this.event,
                    logs: this.logger.logs,
                    metrics: this.stats.metrics
                };
            }
        }
        class Context extends CoreContext {
            static system() {
                return new this({
                    type: "track",
                    event: "system"
                });
            }
            constructor(event, id) {
                super(event, id, "new Stats()");
            }
        }
        function invokeCallback(ctx, callback, delay) {
            return (timeoutInMs = delay, new Promise((resolve => setTimeout(resolve, timeoutInMs)))).then((() => {
                return promise = (() => {
                    try {
                        return Promise.resolve(callback(ctx));
                    } catch (err) {
                        return Promise.reject(err);
                    }
                })(), timeout = 1e3, new Promise(((resolve, reject) => {
                    const timeoutId = setTimeout((() => {
                        reject(Error("Promise timed out"));
                    }), timeout);
                    promise.then((val => (clearTimeout(timeoutId), resolve(val)))).catch(reject);
                }));
                var promise, timeout;
            })).catch((err => {
                null == ctx || ctx.log("warn", "Callback Error", {
                    error: err
                }), null == ctx || ctx.stats.increment("callback_error");
            })).then((() => ctx));
            var timeoutInMs;
        }
        async function dispatch(ctx, queue, emitter, options) {
            emitter.emit("dispatch_start", ctx);
            const startTime = Date.now();
            let dispatched;
            return dispatched = queue.isEmpty() ? await queue.dispatchSingle(ctx) : await queue.dispatch(ctx), 
            (null == options ? void 0 : options.callback) && (dispatched = await invokeCallback(dispatched, options.callback, ((startTimeInEpochMS, timeoutInMS) => {
                const elapsedTime = Date.now() - startTimeInEpochMS;
                return Math.max((null != timeoutInMS ? timeoutInMS : 300) - elapsedTime, 0);
            })(startTime, options.timeout))), (null == options ? void 0 : options.debug) && dispatched.flush(), 
            dispatched;
        }
        class Emitter {
            constructor(options) {
                var _a;
                this.callbacks = {}, this.warned = !1, this.maxListeners = null !== (_a = null == options ? void 0 : options.maxListeners) && void 0 !== _a ? _a : 10;
            }
            warnIfPossibleMemoryLeak(event) {
                this.warned || this.maxListeners && this.callbacks[event].length > this.maxListeners && (console.warn(`Event Emitter: Possible memory leak detected; ${String(event)} has exceeded ${this.maxListeners} listeners.`), 
                this.warned = !0);
            }
            on(event, callback) {
                return this.callbacks[event] ? (this.callbacks[event].push(callback), this.warnIfPossibleMemoryLeak(event)) : this.callbacks[event] = [ callback ], 
                this;
            }
            once(event, callback) {
                const on = (...args) => {
                    this.off(event, on), callback.apply(this, args);
                };
                return this.on(event, on), this;
            }
            off(event, callback) {
                var _a;
                const without = (null !== (_a = this.callbacks[event]) && void 0 !== _a ? _a : []).filter((fn => fn !== callback));
                return this.callbacks[event] = without, this;
            }
            emit(event, ...args) {
                var _a;
                return (null !== (_a = this.callbacks[event]) && void 0 !== _a ? _a : []).forEach((callback => {
                    callback.apply(this, args);
                })), this;
            }
        }
        const createBufferedPageContext = (url, canonicalUrl, search, path, title, referrer) => ({
            __t: "bpc",
            c: canonicalUrl,
            p: path,
            u: url,
            s: search,
            t: title,
            r: referrer
        }), BUFFERED_PAGE_CONTEXT_KEYS = Object.keys(createBufferedPageContext("", "", "", "", "", ""));
        const createPageContext = ({c: canonicalUrl, p: pathname, s: search, u: url, r: referrer, t: title}) => ({
            path: canonicalUrl ? (canonicalUrl => {
                try {
                    return new URL(canonicalUrl).pathname;
                } catch (_e) {
                    return "/" === canonicalUrl[0] ? canonicalUrl : "/" + canonicalUrl;
                }
            })(canonicalUrl) : pathname,
            referrer: referrer,
            search: search,
            title: title,
            url: canonicalUrl ? ((canonicalUrl, searchParams) => canonicalUrl.indexOf("?") > -1 ? canonicalUrl : canonicalUrl + searchParams)(canonicalUrl, search) : (href => {
                const hashIdx = href.indexOf("#");
                return -1 === hashIdx ? href : href.slice(0, hashIdx);
            })(url)
        }), getDefaultBufferedPageContext = () => {
            const c = document.querySelector("link[rel='canonical']");
            return createBufferedPageContext(location.href, c && c.getAttribute("href") || void 0, location.search, location.pathname, document.title, document.referrer);
        }, addPageContext = (event, pageCtx = (() => createPageContext(getDefaultBufferedPageContext()))()) => {
            const evtCtx = event.context;
            let pageContextFromEventProps;
            var object, keys;
            "page" === event.type && (pageContextFromEventProps = event.properties && (object = event.properties, 
            keys = Object.keys(pageCtx), Object.assign({}, ...keys.map((key => {
                if (object && Object.prototype.hasOwnProperty.call(object, key)) return {
                    [key]: object[key]
                };
            })))), event.properties = Object.assign(Object.assign(Object.assign({}, pageCtx), event.properties), event.name ? {
                name: event.name
            } : {})), evtCtx.page = Object.assign(Object.assign(Object.assign({}, pageCtx), pageContextFromEventProps), evtCtx.page);
        };
        Object.create;
        Object.create;
        class errors_ValidationError extends Error {
            constructor(field, message) {
                super(`${field} ${message}`), this.field = field;
            }
        }
        const objError = "is not an object";
        function validateEvent(event) {
            !function(event) {
                if (null == event) throw new errors_ValidationError("Event", "is nil");
                if ("object" != typeof event) throw new errors_ValidationError("Event", objError);
            }(event), function(event) {
                if (!helpers_isString(event.type)) throw new errors_ValidationError(".type", "is not a string");
            }(event), function(event) {
                if (!helpers_isString(event.messageId)) throw new errors_ValidationError(".messageId", "is not a string");
            }(event), "track" === event.type && (function(event) {
                if (!helpers_isString(event.event)) throw new errors_ValidationError(".event", "is not a string");
            }(event), function(event) {
                if (!helpers_isPlainObject(event.properties)) throw new errors_ValidationError(".properties", objError);
            }(event)), [ "group", "identify" ].includes(event.type) && function(event) {
                if (!helpers_isPlainObject(event.traits)) throw new errors_ValidationError(".traits", objError);
            }(event);
        }
        class InternalEventFactorySettings {
            constructor(settings) {
                var _a, _b;
                this.settings = settings, this.createMessageId = settings.createMessageId, this.onEventMethodCall = null !== (_a = settings.onEventMethodCall) && void 0 !== _a ? _a : () => {}, 
                this.onFinishedEvent = null !== (_b = settings.onFinishedEvent) && void 0 !== _b ? _b : () => {};
            }
        }
        class EventFactory extends class {
            constructor(settings) {
                this.settings = new InternalEventFactorySettings(settings);
            }
            track(event, properties, options, globalIntegrations) {
                return this.settings.onEventMethodCall({
                    type: "track",
                    options: options
                }), this.normalize(Object.assign(Object.assign({}, this.baseEvent()), {
                    event: event,
                    type: "track",
                    properties: null != properties ? properties : {},
                    options: Object.assign({}, options),
                    integrations: Object.assign({}, globalIntegrations)
                }));
            }
            page(category, page, properties, options, globalIntegrations) {
                var _a;
                this.settings.onEventMethodCall({
                    type: "page",
                    options: options
                });
                const event = {
                    type: "page",
                    properties: Object.assign({}, properties),
                    options: Object.assign({}, options),
                    integrations: Object.assign({}, globalIntegrations)
                };
                return null !== category && (event.category = category, event.properties = null !== (_a = event.properties) && void 0 !== _a ? _a : {}, 
                event.properties.category = category), null !== page && (event.name = page), this.normalize(Object.assign(Object.assign({}, this.baseEvent()), event));
            }
            baseEvent() {
                return {
                    integrations: {},
                    options: {}
                };
            }
            context(options) {
                var _a;
                const eventOverrideKeys = [ "userId", "anonymousId", "timestamp", "messageId" ];
                delete options.integrations;
                const providedOptionsKeys = Object.keys(options), context = null !== (_a = options.context) && void 0 !== _a ? _a : {}, eventOverrides = {};
                return providedOptionsKeys.forEach((key => {
                    "context" !== key && (eventOverrideKeys.includes(key) ? dset(eventOverrides, key, options[key]) : dset(context, key, options[key]));
                })), [ context, eventOverrides ];
            }
            normalize(event) {
                var _a, _b;
                const integrationBooleans = Object.keys(null !== (_a = event.integrations) && void 0 !== _a ? _a : {}).reduce(((integrationNames, name) => {
                    var _a;
                    return Object.assign(Object.assign({}, integrationNames), {
                        [name]: Boolean(null === (_a = event.integrations) || void 0 === _a ? void 0 : _a[name])
                    });
                }), {});
                var obj, fn;
                event.options = (obj = event.options || {}, fn = (_, value) => void 0 !== value, 
                Object.keys(obj).filter((k => fn(k, obj[k]))).reduce(((acc, key) => (acc[key] = obj[key], 
                acc)), {}));
                const allIntegrations = Object.assign(Object.assign({}, integrationBooleans), null === (_b = event.options) || void 0 === _b ? void 0 : _b.integrations), [context, overrides] = event.options ? this.context(event.options) : [], {options: options} = event, rest = function(s, e) {
                    var t = {};
                    for (var p in s) Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0 && (t[p] = s[p]);
                    if (null != s && "function" == typeof Object.getOwnPropertySymbols) {
                        var i = 0;
                        for (p = Object.getOwnPropertySymbols(s); i < p.length; i++) e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]) && (t[p[i]] = s[p[i]]);
                    }
                    return t;
                }(event, [ "options" ]), evt = Object.assign(Object.assign(Object.assign(Object.assign({
                    timestamp: new Date
                }, rest), {
                    context: context,
                    integrations: allIntegrations
                }), overrides), {
                    messageId: options.messageId || this.settings.createMessageId()
                });
                return this.settings.onFinishedEvent(evt), validateEvent(evt), evt;
            }
        } {
            constructor(user) {
                super({
                    createMessageId: () => `ajs-next-${Date.now()}-${v4()}`,
                    onEventMethodCall: ({options: options}) => {
                        this.maybeUpdateAnonId(options);
                    },
                    onFinishedEvent: event => (this.addIdentity(event), event)
                }), this.user = user;
            }
            maybeUpdateAnonId(options) {
                (null == options ? void 0 : options.anonymousId) && this.user.anonymousId(options.anonymousId);
            }
            addIdentity(event) {
                this.user.id() && (event.userId = this.user.id()), this.user.anonymousId() && (event.anonymousId = this.user.anonymousId());
            }
            track(event, properties, options, globalIntegrations, pageCtx) {
                const ev = super.track(event, properties, options, globalIntegrations);
                return addPageContext(ev, pageCtx), ev;
            }
            page(category, page, properties, options, globalIntegrations, pageCtx) {
                const ev = super.page(category, page, properties, options, globalIntegrations);
                return addPageContext(ev, pageCtx), ev;
            }
        }
        class PriorityQueue extends Emitter {
            constructor(maxAttempts, queue, seen) {
                super(), this.future = [], this.maxAttempts = maxAttempts, this.queue = queue, this.seen = null != seen ? seen : {};
            }
            push(...items) {
                const accepted = items.map((operation => !(this.updateAttempts(operation) > this.maxAttempts || this.includes(operation)) && (this.queue.push(operation), 
                !0)));
                return this.queue = this.queue.sort(((a, b) => this.getAttempts(a) - this.getAttempts(b))), 
                accepted;
            }
            pushWithBackoff(item, minTimeout = 0) {
                if (0 == minTimeout && 0 === this.getAttempts(item)) return this.push(item)[0];
                const attempt = this.updateAttempts(item);
                if (attempt > this.maxAttempts || this.includes(item)) return !1;
                let timeout = function(params) {
                    const random = Math.random() + 1, {minTimeout: minTimeout = 500, factor: factor = 2, attempt: attempt, maxTimeout: maxTimeout = 1 / 0} = params;
                    return Math.min(random * minTimeout * Math.pow(factor, attempt), maxTimeout);
                }({
                    attempt: attempt - 1
                });
                return minTimeout > 0 && timeout < minTimeout && (timeout = minTimeout), setTimeout((() => {
                    this.queue.push(item), this.future = this.future.filter((f => f.id !== item.id)), 
                    this.emit("onRemoveFromFuture");
                }), timeout), this.future.push(item), !0;
            }
            getAttempts(item) {
                var _a;
                return null !== (_a = this.seen[item.id]) && void 0 !== _a ? _a : 0;
            }
            updateAttempts(item) {
                return this.seen[item.id] = this.getAttempts(item) + 1, this.getAttempts(item);
            }
            includes(item) {
                return this.queue.includes(item) || this.future.includes(item) || Boolean(this.queue.find((i => i.id === item.id))) || Boolean(this.future.find((i => i.id === item.id)));
            }
            pop() {
                return this.queue.shift();
            }
            get length() {
                return this.queue.length;
            }
            get todo() {
                return this.queue.length + this.future.length;
            }
        }
        let loc = {
            getItem() {},
            setItem() {},
            removeItem() {}
        };
        try {
            loc = window.localStorage ? window.localStorage : loc;
        } catch (err) {
            console.warn("Unable to access localStorage", err);
        }
        function persisted(key) {
            const items = loc.getItem(key);
            return (items ? JSON.parse(items) : []).map((p => new Context(p.event, p.id)));
        }
        function seen(key) {
            const stored = loc.getItem(key);
            return stored ? JSON.parse(stored) : {};
        }
        function remove(key) {
            loc.removeItem(key);
        }
        function mutex(key, onUnlock, attempt = 0) {
            const lockKey = `persisted-queue:v1:${key}:lock`, rawLock = loc.getItem(lockKey), lock = rawLock ? JSON.parse(rawLock) : null, allowed = null === lock || (lock => (new Date).getTime() > lock)(lock);
            if (allowed) return loc.setItem(lockKey, JSON.stringify((new Date).getTime() + 50)), 
            onUnlock(), void loc.removeItem(lockKey);
            !allowed && attempt < 3 ? setTimeout((() => {
                mutex(key, onUnlock, attempt + 1);
            }), 50) : console.error("Unable to retrieve lock");
        }
        class PersistedPriorityQueue extends PriorityQueue {
            constructor(maxAttempts, key) {
                super(maxAttempts, []);
                const itemsKey = `persisted-queue:v1:${key}:items`, seenKey = `persisted-queue:v1:${key}:seen`;
                let saved = [], lastSeen = {};
                mutex(key, (() => {
                    try {
                        saved = persisted(itemsKey), lastSeen = seen(seenKey), remove(itemsKey), remove(seenKey), 
                        this.queue = [ ...saved, ...this.queue ], this.seen = Object.assign(Object.assign({}, lastSeen), this.seen);
                    } catch (err) {
                        console.error(err);
                    }
                })), window.addEventListener("pagehide", (() => {
                    if (this.todo > 0) {
                        const items = [ ...this.queue, ...this.future ];
                        try {
                            mutex(key, (() => {
                                !function(key, items) {
                                    const merged = [ ...items, ...persisted(key) ].reduce(((acc, item) => Object.assign(Object.assign({}, acc), {
                                        [item.id]: item
                                    })), {});
                                    loc.setItem(key, JSON.stringify(Object.values(merged)));
                                }(itemsKey, items), function(key, memory) {
                                    const stored = seen(key);
                                    loc.setItem(key, JSON.stringify(Object.assign(Object.assign({}, stored), memory)));
                                }(seenKey, this.seen);
                            }));
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }));
            }
        }
        function attempt(ctx, plugin) {
            (new Date).getTime();
            const hook = plugin[ctx.event.type];
            if (void 0 === hook) return Promise.resolve(ctx);
            return async function(fn) {
                try {
                    return await fn();
                } catch (err) {
                    return Promise.reject(err);
                }
            }((() => hook.apply(plugin, [ ctx ]))).then((ctx => {
                (new Date).getTime();
                return ctx;
            })).catch((err => {
                if (err instanceof context_ContextCancelation && "middleware_cancellation" === err.type) throw err;
                return err;
            }));
        }
        function ensure(ctx, plugin) {
            return attempt(ctx, plugin).then((newContext => {
                if (newContext instanceof CoreContext) return newContext;
                ctx.cancel(newContext);
            }));
        }
        class CoreEventQueue extends Emitter {
            constructor(priorityQueue) {
                super(), this.criticalTasks = (() => {
                    let taskCompletionPromise, resolvePromise, count = 0;
                    return {
                        done: () => taskCompletionPromise,
                        run: op => {
                            const returnValue = op();
                            var value;
                            return "object" == typeof (value = returnValue) && null !== value && "then" in value && "function" == typeof value.then && (1 == ++count && (taskCompletionPromise = new Promise((res => resolvePromise = res))), 
                            returnValue.finally((() => 0 == --count && resolvePromise()))), returnValue;
                        }
                    };
                })(), this.plugins = [], this.failedInitializations = [], this.flushing = !1, this.queue = priorityQueue, 
                this.queue.on("onRemoveFromFuture", (() => {
                    this.scheduleFlush(0);
                }));
            }
            async register(ctx, plugin, instance) {
                this.plugins.push(plugin);
                const handleLoadError = err => {
                    this.failedInitializations.push(plugin.name), this.emit("initialization_failure", plugin), 
                    console.warn(plugin.name, err), this.plugins = this.plugins.filter((p => p !== plugin));
                };
                if ("destination" === plugin.type && "Segment.io" !== plugin.name) plugin.load(ctx, instance).catch(handleLoadError); else try {
                    await plugin.load(ctx, instance);
                } catch (err) {
                    handleLoadError(err);
                }
            }
            async dispatch(ctx) {
                this.queue.push(ctx);
                const willDeliver = this.subscribeToDelivery(ctx);
                return this.scheduleFlush(0), willDeliver;
            }
            async subscribeToDelivery(ctx) {
                return new Promise((resolve => {
                    const onDeliver = (flushed, delivered) => {
                        flushed.isSame(ctx) && (this.off("flush", onDeliver), resolve(flushed));
                    };
                    this.on("flush", onDeliver);
                }));
            }
            async dispatchSingle(ctx) {
                return this.queue.updateAttempts(ctx), ctx.attempts = 1, this.deliver(ctx).catch((err => this.enqueuRetry(err, ctx) ? this.subscribeToDelivery(ctx) : (ctx.setFailedDelivery({
                    reason: err
                }), ctx)));
            }
            isEmpty() {
                return 0 === this.queue.length;
            }
            scheduleFlush(timeout = 500) {
                this.flushing || (this.flushing = !0, setTimeout((() => {
                    this.flush().then((() => {
                        setTimeout((() => {
                            this.flushing = !1, this.queue.length && this.scheduleFlush(0);
                        }), 0);
                    }));
                }), timeout));
            }
            async deliver(ctx) {
                await this.criticalTasks.done();
                const start = Date.now();
                try {
                    ctx = await this.flushOne(ctx);
                    Date.now();
                    return this.emit("delivery_success", ctx), ctx;
                } catch (err) {
                    const error = err;
                    throw this.emit("delivery_failure", ctx, error), err;
                }
            }
            enqueuRetry(err, ctx) {
                return !(err instanceof context_ContextCancelation && !err.retry) && this.queue.pushWithBackoff(ctx);
            }
            async flush() {
                if (0 === this.queue.length) return [];
                let ctx = this.queue.pop();
                if (!ctx) return [];
                ctx.attempts = this.queue.getAttempts(ctx);
                try {
                    ctx = await this.deliver(ctx), this.emit("flush", ctx, !0);
                } catch (err) {
                    return this.enqueuRetry(err, ctx) || (ctx.setFailedDelivery({
                        reason: err
                    }), this.emit("flush", ctx, !1)), [];
                }
                return [ ctx ];
            }
            isReady() {
                return !0;
            }
            availableExtensions(denyList) {
                const available = this.plugins.filter((p => {
                    var _a, _b, _c;
                    if ("destination" !== p.type && "Segment.io" !== p.name) return !0;
                    let alternativeNameMatch;
                    return null === (_a = p.alternativeNames) || void 0 === _a || _a.forEach((name => {
                        void 0 !== denyList[name] && (alternativeNameMatch = denyList[name]);
                    })), null !== (_c = null !== (_b = denyList[p.name]) && void 0 !== _b ? _b : alternativeNameMatch) && void 0 !== _c ? _c : !1 !== ("Segment.io" === p.name || denyList.All);
                })), {before: before = [], enrichment: enrichment = [], destination: destination = [], after: after = []} = function(collection, grouper) {
                    const results = {};
                    return collection.forEach((item => {
                        var _a;
                        let key;
                        if ("string" == typeof grouper) {
                            const suggestedKey = item[grouper];
                            key = "string" != typeof suggestedKey ? JSON.stringify(suggestedKey) : suggestedKey;
                        } else grouper instanceof Function && (key = grouper(item));
                        void 0 !== key && (results[key] = [ ...null !== (_a = results[key]) && void 0 !== _a ? _a : [], item ]);
                    })), results;
                }(available, "type");
                return {
                    before: before,
                    enrichment: enrichment,
                    destinations: destination,
                    after: after
                };
            }
            async flushOne(ctx) {
                var _a, _b;
                if (!this.isReady()) throw new Error("Not ready");
                ctx.attempts > 1 && this.emit("delivery_retry", ctx);
                const {before: before, enrichment: enrichment} = this.availableExtensions(null !== (_a = ctx.event.integrations) && void 0 !== _a ? _a : {});
                for (const beforeWare of before) {
                    const temp = await ensure(ctx, beforeWare);
                    temp instanceof CoreContext && (ctx = temp), this.emit("message_enriched", ctx, beforeWare);
                }
                for (const enrichmentWare of enrichment) {
                    const temp = await attempt(ctx, enrichmentWare);
                    temp instanceof CoreContext && (ctx = temp), this.emit("message_enriched", ctx, enrichmentWare);
                }
                const {destinations: destinations, after: after} = this.availableExtensions(null !== (_b = ctx.event.integrations) && void 0 !== _b ? _b : {});
                await new Promise(((resolve, reject) => {
                    setTimeout((() => {
                        const attempts = destinations.map((destination => attempt(ctx, destination)));
                        Promise.all(attempts).then(resolve).catch(reject);
                    }), 0);
                })), this.emit("message_delivered", ctx);
                const afterCalls = after.map((after => attempt(ctx, after)));
                return await Promise.all(afterCalls), ctx;
            }
        }
        class EventQueue extends CoreEventQueue {
            constructor(nameOrQueue) {
                super("string" == typeof nameOrQueue ? new PersistedPriorityQueue(4, nameOrQueue) : nameOrQueue);
            }
            async flush() {
                return isOffline() ? [] : super.flush();
            }
        }
        function bindAll(obj) {
            const proto = obj.constructor.prototype;
            for (const key of Object.getOwnPropertyNames(proto)) if ("constructor" !== key) {
                const desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key);
                desc && "function" == typeof desc.value && (obj[key] = obj[key].bind(obj));
            }
            return obj;
        }
        const types_StoreType_Cookie = "cookie", types_StoreType_LocalStorage = "localStorage", types_StoreType_Memory = "memory", _logStoreKeyError = (store, action, key, err) => {
            console.warn(`${store.constructor.name}: Can't ${action} key "${key}" | Err: ${err}`);
        };
        class UniversalStorage {
            constructor(stores) {
                this.stores = stores;
            }
            get(key) {
                let val = null;
                for (const store of this.stores) try {
                    if (val = store.get(key), null != val) return val;
                } catch (e) {
                    _logStoreKeyError(store, "get", key, e);
                }
                return null;
            }
            set(key, value) {
                this.stores.forEach((store => {
                    try {
                        store.set(key, value);
                    } catch (e) {
                        _logStoreKeyError(store, "set", key, e);
                    }
                }));
            }
            clear(key) {
                this.stores.forEach((store => {
                    try {
                        store.remove(key);
                    } catch (e) {
                        _logStoreKeyError(store, "remove", key, e);
                    }
                }));
            }
            getAndSync(key) {
                const val = this.get(key), coercedValue = "number" == typeof val ? val.toString() : val;
                return this.set(key, coercedValue), coercedValue;
            }
        }
        class MemoryStorage {
            constructor() {
                this.cache = {};
            }
            get(key) {
                var _a;
                return null !== (_a = this.cache[key]) && void 0 !== _a ? _a : null;
            }
            set(key, value) {
                this.cache[key] = value;
            }
            remove(key) {
                delete this.cache[key];
            }
        }
        class LocalStorage {
            localStorageWarning(key, state) {
                console.warn(`Unable to access ${key}, localStorage may be ${state}`);
            }
            get(key) {
                var _a;
                try {
                    const val = localStorage.getItem(key);
                    if (null === val) return null;
                    try {
                        return null !== (_a = JSON.parse(val)) && void 0 !== _a ? _a : null;
                    } catch (e) {
                        return null != val ? val : null;
                    }
                } catch (err) {
                    return this.localStorageWarning(key, "unavailable"), null;
                }
            }
            set(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (_a) {
                    this.localStorageWarning(key, "full");
                }
            }
            remove(key) {
                try {
                    return localStorage.removeItem(key);
                } catch (err) {
                    this.localStorageWarning(key, "unavailable");
                }
            }
        }
        function initializeStorages(args) {
            return args.map((s => {
                let type;
                switch (type = function(s) {
                    return "object" == typeof s && void 0 !== s.name;
                }(s) ? s.name : s, type) {
                  case types_StoreType_LocalStorage:
                    return new LocalStorage;

                  case types_StoreType_Memory:
                    return new MemoryStorage;

                  default:
                    throw new Error(`Unknown Store Type: ${s}`);
                }
            }));
        }
        const defaults = {
            persist: !0,
            cookie: {
                key: "ajs_user_id",
                oldKey: "ajs_user"
            },
            localStorage: {
                key: "ajs_user_traits"
            }
        };
        class User {
            constructor(options = defaults, cookieOptions) {
                var _a, _b, _c, _d;
                this.options = {}, this.id = id => {
                    if (this.options.disable) return null;
                    const prevId = this.identityStore.getAndSync(this.idKey);
                    if (void 0 !== id) {
                        this.identityStore.set(this.idKey, id);
                        id !== prevId && null !== prevId && null !== id && this.anonymousId(null);
                    }
                    const retId = this.identityStore.getAndSync(this.idKey);
                    if (retId) return retId;
                    const retLeg = this.legacyUserStore.get(defaults.cookie.oldKey);
                    return retLeg ? "object" == typeof retLeg ? retLeg.id : retLeg : null;
                }, this.anonymousId = id => {
                    if (this.options.disable) return null;
                    if (void 0 === id) {
                        const val = this.identityStore.getAndSync(this.anonKey);
                        if (val) return val;
                    }
                    return null === id ? (this.identityStore.set(this.anonKey, null), this.identityStore.getAndSync(this.anonKey)) : (this.identityStore.set(this.anonKey, null != id ? id : v4()), 
                    this.identityStore.getAndSync(this.anonKey));
                }, this.traits = traits => {
                    var _a;
                    if (!this.options.disable) return null === traits && (traits = {}), traits && this.traitsStore.set(this.traitsKey, null != traits ? traits : {}), 
                    null !== (_a = this.traitsStore.get(this.traitsKey)) && void 0 !== _a ? _a : {};
                }, this.options = Object.assign(Object.assign({}, defaults), options), this.cookieOptions = cookieOptions, 
                this.idKey = null !== (_b = null === (_a = options.cookie) || void 0 === _a ? void 0 : _a.key) && void 0 !== _b ? _b : defaults.cookie.key, 
                this.traitsKey = null !== (_d = null === (_c = options.localStorage) || void 0 === _c ? void 0 : _c.key) && void 0 !== _d ? _d : defaults.localStorage.key, 
                this.anonKey = "ajs_anonymous_id", this.identityStore = this.createStorage(this.options, cookieOptions), 
                this.legacyUserStore = this.createStorage(this.options, cookieOptions, (s => s === types_StoreType_Cookie)), 
                this.traitsStore = this.createStorage(this.options, cookieOptions, (s => s !== types_StoreType_Cookie));
                const legacyUser = this.legacyUserStore.get(defaults.cookie.oldKey);
                legacyUser && "object" == typeof legacyUser && (legacyUser.id && this.id(legacyUser.id), 
                legacyUser.traits && this.traits(legacyUser.traits)), bindAll(this);
            }
            identify(id, traits) {
                if (this.options.disable) return;
                traits = null != traits ? traits : {};
                const currentId = this.id();
                null !== currentId && currentId !== id || (traits = Object.assign(Object.assign({}, this.traits()), traits)), 
                id && this.id(id), this.traits(traits);
            }
            logout() {
                this.anonymousId(null), this.id(null), this.traits({});
            }
            reset() {
                this.logout(), this.identityStore.clear(this.idKey), this.identityStore.clear(this.anonKey), 
                this.traitsStore.clear(this.traitsKey);
            }
            load() {
                return new User(this.options, this.cookieOptions);
            }
            save() {
                return !0;
            }
            createStorage(options, cookieOpts, filterStores) {
                let stores = [ types_StoreType_LocalStorage, types_StoreType_Memory ];
                return options.persist ? (options.localStorageFallbackDisabled && (stores = stores.filter((s => s !== types_StoreType_LocalStorage))), 
                filterStores && (stores = stores.filter(filterStores)), new UniversalStorage(initializeStorages(stores))) : new UniversalStorage([ new MemoryStorage ]);
            }
        }
        User.defaults = defaults;
        const flushSyncAnalyticsCalls = (name, analytics, buffer) => {
            buffer.getAndRemove(name).forEach((c => {
                callAnalyticsMethod(analytics, c).catch(console.error);
            }));
        }, flushOn = flushSyncAnalyticsCalls.bind(void 0, "on"), flushSetAnonymousID = flushSyncAnalyticsCalls.bind(void 0, "setAnonymousId"), popPageContext = args => {
            if (hasBufferedPageContextAsLastArg(args)) {
                const ctx = args.pop();
                return createPageContext(ctx);
            }
        }, hasBufferedPageContextAsLastArg = args => function(bufferedPageCtx) {
            if (!helpers_isPlainObject(bufferedPageCtx)) return !1;
            if ("bpc" !== bufferedPageCtx.__t) return !1;
            for (const k in bufferedPageCtx) if (!BUFFERED_PAGE_CONTEXT_KEYS.includes(k)) return !1;
            return !0;
        }(args[args.length - 1]);
        class PreInitMethodCall {
            constructor(method, args, resolve = (() => {}), reject = console.error) {
                this.method = method, this.resolve = resolve, this.reject = reject, this.called = !1, 
                this.args = args;
            }
        }
        class PreInitMethodCallBuffer {
            constructor(...calls) {
                this._callMap = {}, this.add(...calls);
            }
            get calls() {
                return this._pushSnippetWindowBuffer(), this._callMap;
            }
            set calls(calls) {
                this._callMap = calls;
            }
            get(methodName) {
                var _a;
                return null !== (_a = this.calls[methodName]) && void 0 !== _a ? _a : [];
            }
            getAndRemove(methodName) {
                const calls = this.get(methodName);
                return this.calls[methodName] = [], calls;
            }
            add(...calls) {
                calls.forEach((call => {
                    [ "track", "page" ].includes(call.method) && !hasBufferedPageContextAsLastArg(call.args) && (call.args = [ ...call.args, getDefaultBufferedPageContext() ]), 
                    this.calls[call.method] ? this.calls[call.method].push(call) : this.calls[call.method] = [ call ];
                }));
            }
            clear() {
                this._pushSnippetWindowBuffer(), this.calls = {};
            }
            toArray() {
                return [].concat(...Object.values(this.calls));
            }
            _pushSnippetWindowBuffer() {
                if ("npm" === getVersionType()) return;
                const wa = getGlobalAnalytics();
                if (!Array.isArray(wa)) return;
                const calls = wa.splice(0, wa.length).map((([methodName, ...args]) => new PreInitMethodCall(methodName, args)));
                this.add(...calls);
            }
        }
        async function callAnalyticsMethod(analytics, call) {
            try {
                if (call.called) return;
                call.called = !0;
                const result = analytics[call.method](...call.args);
                "object" == typeof (value = result) && null !== value && "then" in value && "function" == typeof value.then && await result, 
                call.resolve(result);
            } catch (err) {
                call.reject(err);
            }
            var value;
        }
        class AnalyticsInstanceSettings {
            constructor(settings) {
                var _a;
                this.timeout = 300, this.writeKey = settings.writeKey, this.cdnSettings = null !== (_a = settings.cdnSettings) && void 0 !== _a ? _a : {
                    integrations: {},
                    edgeFunction: {}
                }, this.cdnURL = settings.cdnURL;
            }
        }
        class Analytics extends Emitter {
            constructor(settings, options) {
                var _a, _b;
                super(), this._debug = !1, this.initialized = !1, this.user = () => this._user;
                const cookieOptions = null == options ? void 0 : options.cookie, disablePersistance = null !== (_a = null == options ? void 0 : options.disableClientPersistence) && void 0 !== _a && _a;
                this.settings = new AnalyticsInstanceSettings(settings), this.queue = function(name, retryQueue = !1, disablePersistance = !1) {
                    const maxAttempts = retryQueue ? 10 : 1, priorityQueue = disablePersistance ? new PriorityQueue(maxAttempts, []) : new PersistedPriorityQueue(maxAttempts, name);
                    return new EventQueue(priorityQueue);
                }(`${settings.writeKey}:event-queue`, null == options ? void 0 : options.retryQueue, disablePersistance);
                const storageSetting = null == options ? void 0 : options.storage;
                this._universalStorage = this.createStore(disablePersistance, storageSetting, cookieOptions), 
                this._user = new User(Object.assign({
                    persist: !disablePersistance,
                    storage: null == options ? void 0 : options.storage
                }, null == options ? void 0 : options.user), cookieOptions).load(), this.eventFactory = new EventFactory(this._user), 
                this.integrations = null !== (_b = null == options ? void 0 : options.integrations) && void 0 !== _b ? _b : {}, 
                this.options = null != options ? options : {}, bindAll(this);
            }
            createStore(disablePersistance, storageSetting, cookieOptions) {
                return new UniversalStorage(disablePersistance ? [ new MemoryStorage ] : initializeStorages([ types_StoreType_LocalStorage ]));
            }
            get storage() {
                return this._universalStorage;
            }
            async track(...args) {
                const pageCtx = popPageContext(args), [name, data, opts, cb] = function(eventName, properties, options, callback) {
                    var _a;
                    const args = [ eventName, properties, options, callback ], name = helpers_isPlainObject(eventName) ? eventName.event : eventName;
                    if (!name || !helpers_isString(name)) throw new Error("Event missing");
                    const data = helpers_isPlainObject(eventName) ? null !== (_a = eventName.properties) && void 0 !== _a ? _a : {} : helpers_isPlainObject(properties) ? properties : {};
                    let opts = {};
                    return helpers_isFunction(options) || (opts = null != options ? options : {}), helpers_isPlainObject(eventName) && !helpers_isFunction(properties) && (opts = null != properties ? properties : {}), 
                    [ name, data, opts, args.find(helpers_isFunction) ];
                }(...args), segmentEvent = this.eventFactory.track(name, data, opts, this.integrations, pageCtx);
                return this._dispatch(segmentEvent, cb).then((ctx => (this.emit("track", name, ctx.event.properties, ctx.event.options), 
                ctx)));
            }
            async page(...args) {
                const pageCtx = popPageContext(args), [category, page, properties, options, callback] = function(category, name, properties, options, callback) {
                    var _a, _b;
                    let resolvedCategory = null, resolvedName = null;
                    const args = [ category, name, properties, options, callback ], strings = args.filter(helpers_isString);
                    void 0 !== strings[0] && void 0 !== strings[1] && (resolvedCategory = strings[0], 
                    resolvedName = strings[1]), 1 === strings.length && (resolvedCategory = null, resolvedName = strings[0]);
                    const resolvedCallback = args.find(helpers_isFunction), objects = args.filter((obj => null === resolvedName ? helpers_isPlainObject(obj) : helpers_isPlainObject(obj) || null === obj)), resolvedProperties = null !== (_a = objects[0]) && void 0 !== _a ? _a : {}, resolvedOptions = null !== (_b = objects[1]) && void 0 !== _b ? _b : {};
                    return [ resolvedCategory, resolvedName, resolvedProperties, resolvedOptions, resolvedCallback ];
                }(...args), segmentEvent = this.eventFactory.page(category, page, properties, options, this.integrations, pageCtx);
                return this._dispatch(segmentEvent, callback).then((ctx => (this.emit("page", category, page, ctx.event.properties, ctx.event.options), 
                ctx)));
            }
            async register(...plugins) {
                const ctx = Context.system(), registrations = plugins.map((xt => this.queue.register(ctx, xt, this)));
                return await Promise.all(registrations), ctx;
            }
            debug(toggle) {
                return !1 === toggle && localStorage.getItem("debug") && localStorage.removeItem("debug"), 
                this._debug = toggle, this;
            }
            timeout(timeout) {
                this.settings.timeout = timeout;
            }
            async _dispatch(event, callback) {
                const ctx = new Context(event);
                return isOffline() && !this.options.retryQueue ? ctx : dispatch(ctx, this.queue, this, {
                    callback: callback,
                    debug: this._debug,
                    timeout: this.settings.timeout
                });
            }
            async addSourceMiddleware(fn) {
                return console.debug(fn), this;
            }
            setAnonymousId(id) {
                return this._user.anonymousId(id);
            }
            async ready(callback = (res => res)) {
                return Promise.all(this.queue.plugins.map((i => i.ready ? i.ready() : Promise.resolve()))).then((res => (callback(res), 
                res)));
            }
        }
        const createDeferred = () => {
            let resolve, reject, settled = !1;
            const promise = new Promise(((_resolve, _reject) => {
                resolve = (...args) => {
                    settled = !0, _resolve(...args);
                }, reject = (...args) => {
                    settled = !0, _reject(...args);
                };
            }));
            return {
                resolve: resolve,
                reject: reject,
                promise: promise,
                isSettled: () => settled
            };
        };
        function js_cookie_assign(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) target[key] = source[key];
            }
            return target;
        }
        var js_cookie = function init(converter, defaultAttributes) {
            function set(key, value, attributes) {
                if ("undefined" != typeof document) {
                    "number" == typeof (attributes = js_cookie_assign({}, defaultAttributes, attributes)).expires && (attributes.expires = new Date(Date.now() + 864e5 * attributes.expires)), 
                    attributes.expires && (attributes.expires = attributes.expires.toUTCString()), key = encodeURIComponent(key).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
                    var stringifiedAttributes = "";
                    for (var attributeName in attributes) attributes[attributeName] && (stringifiedAttributes += "; " + attributeName, 
                    !0 !== attributes[attributeName] && (stringifiedAttributes += "=" + attributes[attributeName].split(";")[0]));
                    return document.cookie = key + "=" + converter.write(value, key) + stringifiedAttributes;
                }
            }
            return Object.create({
                set: set,
                get: function(key) {
                    if ("undefined" != typeof document && (!arguments.length || key)) {
                        for (var cookies = document.cookie ? document.cookie.split("; ") : [], jar = {}, i = 0; i < cookies.length; i++) {
                            var parts = cookies[i].split("="), value = parts.slice(1).join("=");
                            try {
                                var foundKey = decodeURIComponent(parts[0]);
                                if (jar[foundKey] = converter.read(value, foundKey), key === foundKey) break;
                            } catch (e) {}
                        }
                        return key ? jar[key] : jar;
                    }
                },
                remove: function(key, attributes) {
                    set(key, "", js_cookie_assign({}, attributes, {
                        expires: -1
                    }));
                },
                withAttributes: function(attributes) {
                    return init(this.converter, js_cookie_assign({}, this.attributes, attributes));
                },
                withConverter: function(converter) {
                    return init(js_cookie_assign({}, this.converter, converter), this.attributes);
                }
            }, {
                attributes: {
                    value: Object.freeze(defaultAttributes)
                },
                converter: {
                    value: Object.freeze(converter)
                }
            });
        }({
            read: function(value) {
                return '"' === value[0] && (value = value.slice(1, -1)), value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
            },
            write: function(value) {
                return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
            }
        }, {
            path: "/"
        });
        function tld(url) {
            const parsedUrl = function(url) {
                try {
                    return new URL(url);
                } catch (_a) {
                    return;
                }
            }(url);
            if (!parsedUrl) return;
            const lvls = function(url) {
                const parts = url.hostname.split("."), last = parts[parts.length - 1], levels = [];
                if (4 === parts.length && parseInt(last, 10) > 0) return levels;
                if (parts.length <= 1) return levels;
                for (let i = parts.length - 2; i >= 0; --i) levels.push(parts.slice(i).join("."));
                return levels;
            }(parsedUrl);
            for (let i = 0; i < lvls.length; ++i) {
                const cname = "__tld__", domain = lvls[i], opts = {
                    domain: "." + domain
                };
                try {
                    if (js_cookie.set(cname, "1", opts), js_cookie.get(cname)) return js_cookie.remove(cname, opts), 
                    domain;
                } catch (_) {
                    return;
                }
            }
        }
        class CookieStorage {
            static get defaults() {
                return {
                    maxage: 365,
                    domain: tld(window.location.href),
                    path: "/",
                    sameSite: "Lax"
                };
            }
            constructor(options = CookieStorage.defaults) {
                this.options = Object.assign(Object.assign({}, CookieStorage.defaults), options);
            }
            opts() {
                return {
                    sameSite: this.options.sameSite,
                    expires: this.options.maxage,
                    domain: this.options.domain,
                    path: this.options.path,
                    secure: this.options.secure
                };
            }
            get(key) {
                var _a;
                try {
                    const value = js_cookie.get(key);
                    if (null == value) return null;
                    try {
                        return null !== (_a = JSON.parse(value)) && void 0 !== _a ? _a : null;
                    } catch (e) {
                        return null != value ? value : null;
                    }
                } catch (e) {
                    return null;
                }
            }
            set(key, value) {
                "string" == typeof value ? js_cookie.set(key, value, this.opts()) : null === value ? js_cookie.remove(key, this.opts()) : js_cookie.set(key, JSON.stringify(value), this.opts());
            }
            remove(key) {
                return js_cookie.remove(key, this.opts());
            }
        }
        let cookieOptions;
        function getCookieOptions() {
            if (cookieOptions) return cookieOptions;
            const domain = tld(window.location.href);
            return cookieOptions = {
                expires: 31536e6,
                secure: !1,
                path: "/"
            }, domain && (cookieOptions.domain = domain), cookieOptions;
        }
        function utm(query) {
            return query.startsWith("?") && (query = query.substring(1)), (query = query.replace(/\?/g, "&")).split("&").reduce(((acc, str) => {
                const [k, v = ""] = str.split("=");
                if (k.includes("utm_") && k.length > 4) {
                    let utmParam = k.slice(4);
                    "campaign" === utmParam && (utmParam = "name"), acc[utmParam] = function(encodedURIComponent) {
                        try {
                            return decodeURIComponent(encodedURIComponent.replace(/\+/g, " "));
                        } catch (_a) {
                            return encodedURIComponent;
                        }
                    }(v);
                }
                return acc;
            }), {});
        }
        const envEnrichment = new class {
            constructor() {
                this.name = "Page Enrichment", this.type = "before", this.version = "0.1.0", this.isLoaded = () => !0, 
                this.load = async (_ctx, instance) => {
                    this.instance = instance;
                    try {
                        this.userAgentData = await async function(hints) {
                            const userAgentData = navigator.userAgentData;
                            if (userAgentData) return hints ? userAgentData.getHighEntropyValues(hints).catch((() => userAgentData.toJSON())) : userAgentData.toJSON();
                        }(this.instance.options.highEntropyValuesClientHints);
                    } catch (_) {}
                    return Promise.resolve();
                }, this.enrich = ctx => {
                    var _a, _b;
                    const evtCtx = ctx.event.context, search = evtCtx.page.search || "", query = "object" == typeof search ? (obj => {
                        try {
                            const searchParams = new URLSearchParams;
                            return Object.entries(obj).forEach((([k, v]) => {
                                Array.isArray(v) ? v.forEach((value => searchParams.append(k, value))) : searchParams.append(k, v);
                            })), searchParams.toString();
                        } catch (_a) {
                            return "";
                        }
                    })(search) : search;
                    evtCtx.userAgent = navigator.userAgent, evtCtx.userAgentData = this.userAgentData;
                    const locale = navigator.userLanguage || navigator.language;
                    void 0 === evtCtx.locale && void 0 !== locale && (evtCtx.locale = locale), null !== (_a = evtCtx.library) && void 0 !== _a || (evtCtx.library = {
                        name: "analytics.js",
                        version: ("web" === getVersionType() ? "next" : "npm:next") + "-1.74.0"
                    }), query && !evtCtx.campaign && (evtCtx.campaign = utm(query));
                    const amp = function() {
                        const ampId = js_cookie.get("_ga");
                        if (ampId && ampId.startsWith("amp")) return ampId;
                    }();
                    amp && (evtCtx.amp = {
                        id: amp
                    }), function(query, ctx, disablePersistance) {
                        var _a;
                        const storage = new UniversalStorage(disablePersistance ? [] : [ new CookieStorage(getCookieOptions()) ]), stored = storage.get("s:context.referrer"), ad = null !== (_a = function(query) {
                            const queryIds = {
                                btid: "dataxu",
                                urid: "millennial-media"
                            };
                            query.startsWith("?") && (query = query.substring(1));
                            const parts = (query = query.replace(/\?/g, "&")).split("&");
                            for (const part of parts) {
                                const [k, v] = part.split("=");
                                if (queryIds[k]) return {
                                    id: v,
                                    type: queryIds[k]
                                };
                            }
                        }(query)) && void 0 !== _a ? _a : stored;
                        ad && (ctx && (ctx.referrer = Object.assign(Object.assign({}, ctx.referrer), ad)), 
                        storage.set("s:context.referrer", ad));
                    }(query, evtCtx, null !== (_b = this.instance.options.disableClientPersistence) && void 0 !== _b && _b);
                    try {
                        evtCtx.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    } catch (_) {}
                    return ctx;
                }, this.track = this.enrich, this.identify = this.enrich, this.page = this.enrich, 
                this.group = this.enrich, this.alias = this.enrich, this.screen = this.enrich;
            }
        };
        function findScript(src) {
            return Array.prototype.slice.call(window.document.querySelectorAll("script")).find((s => s.src === src));
        }
        function clone(properties) {
            if ("object" != typeof properties) return properties;
            if ("[object Object]" === Object.prototype.toString.call(properties)) {
                const temp = {};
                for (const key in properties) Object.prototype.hasOwnProperty.call(properties, key) && (temp[key] = clone(properties[key]));
                return temp;
            }
            return Array.isArray(properties) ? properties.map(clone) : properties;
        }
        var lib = __webpack_require__(870), lib_default = __webpack_require__.n(lib), analytics_js_obj_case = __webpack_require__(174), analytics_js_obj_case_default = __webpack_require__.n(analytics_js_obj_case), analytics_js_isodate_traverse_lib = __webpack_require__(564), analytics_js_isodate_traverse_lib_default = __webpack_require__.n(analytics_js_isodate_traverse_lib);
        function Facade(obj, opts) {
            opts = opts || {}, this.raw = clone(obj), "clone" in opts || (opts.clone = !0), 
            opts.clone && (obj = clone(obj)), "traverse" in opts || (opts.traverse = !0), obj.timestamp = "timestamp" in obj ? lib_default()(obj.timestamp) : new Date, 
            opts.traverse && analytics_js_isodate_traverse_lib_default()(obj), this.opts = opts, 
            this.obj = obj;
        }
        const f = Facade.prototype;
        function transform(obj) {
            return clone(obj);
        }
        f.proxy = function(field) {
            let fields = field.split("."), obj = this[field = fields.shift()] || this.obj[field];
            return obj ? ("function" == typeof obj && (obj = obj.call(this) || {}), 0 === fields.length || (obj = analytics_js_obj_case_default()(obj, fields.join("."))), 
            this.opts.clone ? transform(obj) : obj) : obj;
        }, f.field = function(field) {
            let obj = this.obj[field];
            return this.opts.clone ? transform(obj) : obj;
        }, Facade.proxy = function(field) {
            return function() {
                return this.proxy(field);
            };
        }, Facade.field = function(field) {
            return function() {
                return this.field(field);
            };
        }, Facade.multi = function(path) {
            return function() {
                let multi = this.proxy(path + "s");
                if (Array.isArray(multi)) return multi;
                let one = this.proxy(path);
                return one && (one = [ this.opts.clone ? clone(one) : one ]), one || [];
            };
        }, Facade.one = function(path) {
            return function() {
                let one = this.proxy(path);
                if (one) return one;
                let multi = this.proxy(path + "s");
                return Array.isArray(multi) ? multi[0] : void 0;
            };
        }, f.json = function() {
            let ret = this.opts.clone ? clone(this.obj) : this.obj;
            return this.type && (ret.type = this.type()), ret;
        }, f.rawEvent = function() {
            return this.raw;
        }, f.options = function(integration) {
            let obj = this.obj.options || this.obj.context || {}, options = this.opts.clone ? clone(obj) : obj;
            if (!integration) return options;
            if (!this.enabled(integration)) return;
            let integrations = this.integrations(), value = integrations[integration] || analytics_js_obj_case_default()(integrations, integration);
            return "object" != typeof value && (value = analytics_js_obj_case_default()(this.options(), integration)), 
            "object" == typeof value ? value : {};
        }, f.context = f.options, f.enabled = function(integration) {
            let allEnabled = this.proxy("options.providers.all");
            "boolean" != typeof allEnabled && (allEnabled = this.proxy("options.all")), "boolean" != typeof allEnabled && (allEnabled = this.proxy("integrations.all")), 
            "boolean" != typeof allEnabled && (allEnabled = !0);
            let enabled = allEnabled, options = this.integrations();
            if (options.providers && options.providers.hasOwnProperty(integration) && (enabled = options.providers[integration]), 
            options.hasOwnProperty(integration)) {
                let settings = options[integration];
                enabled = "boolean" != typeof settings || settings;
            }
            return !!enabled;
        }, f.integrations = function() {
            return this.obj.integrations || this.proxy("options.providers") || this.options();
        }, f.active = function() {
            let active = this.proxy("options.active");
            return null == active && (active = !0), active;
        }, f.anonymousId = function() {
            return this.field("anonymousId") || this.field("sessionId");
        }, f.sessionId = f.anonymousId, f.groupId = Facade.proxy("options.groupId"), f.traits = function(aliases) {
            let ret = this.proxy("options.traits") || {}, id = this.userId();
            aliases = aliases || {}, id && (ret.id = id);
            for (const alias in aliases) if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
                const value = null == this[alias] ? this.proxy("options.traits." + alias) : this[alias]();
                if (null == value) continue;
                ret[aliases[alias]] = value, delete ret[alias];
            }
            return ret;
        }, f.library = function() {
            let library = this.proxy("options.library");
            return library ? "string" == typeof library ? {
                name: library,
                version: null
            } : library : {
                name: "unknown",
                version: null
            };
        }, f.userAgent = Facade.proxy("context.userAgent"), f.timezone = Facade.proxy("context.timezone"), 
        f.timestamp = Facade.field("timestamp"), f.channel = Facade.field("channel"), f.ip = Facade.proxy("context.ip"), 
        f.userId = Facade.field("userId");
        var inherits_browser = __webpack_require__(285), inherits_browser_default = __webpack_require__.n(inherits_browser);
        const matcher = /.+\@.+\..+/;
        function isEmail(string) {
            return matcher.test(string);
        }
        let trim = str => str.trim();
        function Identify(dictionary, opts) {
            Facade.call(this, dictionary, opts);
        }
        inherits_browser_default()(Identify, Facade);
        const i = Identify.prototype;
        function Track(dictionary, opts) {
            Facade.call(this, dictionary, opts);
        }
        i.action = function() {
            return "identify";
        }, i.type = i.action, i.traits = function(aliases) {
            let ret = this.field("traits") || {}, id = this.userId();
            aliases = aliases || {}, id && (ret.id = id);
            for (let alias in aliases) {
                let value = null == this[alias] ? this.proxy("traits." + alias) : this[alias]();
                null != value && (ret[aliases[alias]] = value, alias !== aliases[alias] && delete ret[alias]);
            }
            return ret;
        }, i.email = function() {
            let email = this.proxy("traits.email");
            if (email) return email;
            let userId = this.userId();
            return isEmail(userId) ? userId : void 0;
        }, i.created = function() {
            let created = this.proxy("traits.created") || this.proxy("traits.createdAt");
            if (created) return lib_default()(created);
        }, i.name = function() {
            let name = this.proxy("traits.name");
            if ("string" == typeof name) return trim(name);
            let firstName = this.firstName(), lastName = this.lastName();
            return firstName && lastName ? trim(firstName + " " + lastName) : void 0;
        }, i.uid = function() {
            return this.userId() || this.username() || this.email();
        }, i.description = function() {
            return this.proxy("traits.description") || this.proxy("traits.background");
        }, i.avatar = function() {
            let traits = this.traits();
            return analytics_js_obj_case_default()(traits, "avatar") || analytics_js_obj_case_default()(traits, "photoUrl") || analytics_js_obj_case_default()(traits, "avatarUrl");
        }, i.username = Facade.proxy("traits.username"), inherits_browser_default()(Track, Facade);
        let t = Track.prototype;
        function Page(dictionary, opts) {
            Facade.call(this, dictionary, opts);
        }
        t.action = function() {
            return "track";
        }, t.type = t.action, t.event = Facade.field("event"), t.value = Facade.proxy("properties.value"), 
        t.category = Facade.proxy("properties.category"), t.id = Facade.proxy("properties.id"), 
        t.name = Facade.proxy("properties.name"), t.description = Facade.proxy("properties.description"), 
        t.plan = Facade.proxy("properties.plan"), t.referrer = function() {
            return this.proxy("context.referrer.url") || this.proxy("context.page.referrer") || this.proxy("properties.referrer");
        }, t.query = Facade.proxy("options.query"), t.properties = function(aliases) {
            let ret = this.field("properties") || {};
            aliases = aliases || {};
            for (const alias in aliases) if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
                const value = null == this[alias] ? this.proxy("properties." + alias) : this[alias]();
                if (null == value) continue;
                ret[aliases[alias]] = value, delete ret[alias];
            }
            return ret;
        }, t.username = function() {
            return this.proxy("traits.username") || this.proxy("properties.username") || this.userId() || this.sessionId();
        }, t.email = function() {
            let email = this.proxy("traits.email") || this.proxy("properties.email") || this.proxy("options.traits.email");
            if (email) return email;
            let userId = this.userId();
            return isEmail(userId) ? userId : void 0;
        }, t.identify = function() {
            let json = this.json();
            return json.traits = this.traits(), new Identify(json, this.opts);
        }, inherits_browser_default()(Page, Facade);
        const p = Page.prototype;
        function to_facade_toFacade(evt, options) {
            let fcd = new Facade(evt, options);
            return "track" === evt.type && (fcd = new Track(evt, options)), "identify" === evt.type && (fcd = new Identify(evt, options)), 
            "page" === evt.type && (fcd = new Page(evt, options)), Object.defineProperty(fcd, "obj", {
                value: evt,
                writable: !0
            }), fcd;
        }
        p.action = function() {
            return "page";
        }, p.type = p.action, p.category = Facade.field("category"), p.name = Facade.field("name"), 
        p.title = Facade.proxy("properties.title"), p.path = Facade.proxy("properties.path"), 
        p.url = Facade.proxy("properties.url"), p.referrer = function() {
            return this.proxy("context.referrer.url") || this.proxy("context.page.referrer") || this.proxy("properties.referrer");
        }, p.properties = function(aliases) {
            let props = this.field("properties") || {}, category = this.category(), name = this.name();
            aliases = aliases || {}, category && (props.category = category), name && (props.name = name);
            for (const alias in aliases) if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
                const value = null == this[alias] ? this.proxy("properties." + alias) : this[alias]();
                if (null == value) continue;
                props[aliases[alias]] = value, alias !== aliases[alias] && delete props[alias];
            }
            return props;
        }, p.event = function(name) {
            return name ? "Viewed " + name + " Page" : "Loaded a Page";
        }, p.track = function(name) {
            let json = this.json();
            return json.event = this.event(name), json.timestamp = this.timestamp(), json.properties = this.properties(), 
            new Track(json, this.opts);
        };
        class ActionDestination {
            constructor(name, action) {
                this.version = "1.0.0", this.alternativeNames = [], this.loadPromise = createDeferred(), 
                this.middleware = [], this.identify = this._createMethod("identify"), this.page = this._createMethod("page"), 
                this.track = this._createMethod("track"), this.action = action, this.name = name, 
                this.type = action.type, this.alternativeNames.push(action.name);
            }
            addMiddleware(...fn) {
                "destination" === this.type && this.middleware.push(...fn);
            }
            async transform(ctx) {
                const modifiedEvent = await async function(destination, evt, middleware) {
                    let modifiedEvent = to_facade_toFacade(evt, {
                        clone: !0,
                        traverse: !1
                    }).rawEvent();
                    async function applyMiddleware(event, fn) {
                        let nextCalled = !1, returnedEvent = null;
                        return await fn({
                            payload: to_facade_toFacade(event, {
                                clone: !0,
                                traverse: !1
                            }),
                            integration: destination,
                            next(evt) {
                                nextCalled = !0, null === evt && (returnedEvent = null), evt && (returnedEvent = evt.obj);
                            }
                        }), nextCalled || null === returnedEvent || (returnedEvent = returnedEvent, returnedEvent.integrations = Object.assign(Object.assign({}, event.integrations), {
                            [destination]: !1
                        })), returnedEvent;
                    }
                    for (const md of middleware) {
                        const result = await applyMiddleware(modifiedEvent, md);
                        if (null === result) return null;
                        modifiedEvent = result;
                    }
                    return modifiedEvent;
                }(this.name, ctx.event, this.middleware);
                return null === modifiedEvent && ctx.cancel(new context_ContextCancelation({
                    retry: !1,
                    reason: "dropped by destination middleware"
                })), new Context(modifiedEvent);
            }
            _createMethod(methodName) {
                return async ctx => {
                    if (!this.action[methodName]) return ctx;
                    let transformedContext = ctx;
                    "destination" === this.type && (transformedContext = await this.transform(ctx));
                    try {
                        if (!await this.ready()) throw new Error("Something prevented the destination from getting ready");
                        await this.action[methodName](transformedContext);
                    } catch (error) {
                        throw error;
                    }
                    return ctx;
                };
            }
            isLoaded() {
                return this.action.isLoaded();
            }
            async ready() {
                try {
                    return await this.loadPromise.promise, !0;
                } catch (_a) {
                    return !1;
                }
            }
            async load(ctx, analytics) {
                if (this.loadPromise.isSettled()) return this.loadPromise.promise;
                try {
                    const loadP = this.action.load(ctx, analytics);
                    return this.loadPromise.resolve(await loadP), loadP;
                } catch (error) {
                    throw this.loadPromise.reject(error), error;
                }
            }
            unload(ctx, analytics) {
                var _a, _b;
                return null === (_b = (_a = this.action).unload) || void 0 === _b ? void 0 : _b.call(_a, ctx, analytics);
            }
        }
        async function loadPluginFactory(remotePlugin) {
            try {
                const defaultCdn = new RegExp("https://cdn.segment.(com|build)"), cdn = getCDN();
                if (await function(src, attributes) {
                    const found = findScript(src);
                    if (void 0 !== found) {
                        const status = null == found ? void 0 : found.getAttribute("status");
                        if ("loaded" === status) return Promise.resolve(found);
                        if ("loading" === status) return new Promise(((resolve, reject) => {
                            found.addEventListener("load", (() => resolve(found))), found.addEventListener("error", (err => reject(err)));
                        }));
                    }
                    return new Promise(((resolve, reject) => {
                        var _a;
                        const script = window.document.createElement("script");
                        script.type = "text/javascript", script.src = src, script.async = !0, script.setAttribute("status", "loading");
                        for (const [k, v] of Object.entries(null != attributes ? attributes : {})) script.setAttribute(k, v);
                        script.onload = () => {
                            script.onerror = script.onload = null, script.setAttribute("status", "loaded"), 
                            resolve(script);
                        }, script.onerror = () => {
                            script.onerror = script.onload = null, script.setAttribute("status", "error"), reject(new Error(`Failed to load ${src}`));
                        };
                        const firstExistingScript = window.document.querySelector("script");
                        firstExistingScript ? null === (_a = firstExistingScript.parentElement) || void 0 === _a || _a.insertBefore(script, firstExistingScript) : window.document.head.appendChild(script);
                    }));
                }(remotePlugin.url.replace(defaultCdn, cdn)), "function" == typeof window[remotePlugin.libraryName]) return window[remotePlugin.libraryName];
            } catch (err) {
                throw console.error("Failed to create PluginFactory", remotePlugin), err;
            }
        }
        async function remoteLoader(loadSettings, settings, mergedIntegrations, routingMiddleware) {
            var _a, _b, _c;
            const allPlugins = [], cdn = getCDN(), routingRules = null !== (_b = null === (_a = settings.middlewareSettings) || void 0 === _a ? void 0 : _a.routingRules) && void 0 !== _b ? _b : [], pluginPromises = (null !== (_c = settings.remotePlugins) && void 0 !== _c ? _c : []).map((async remotePlugin => {
                remotePlugin.creationName || (remotePlugin.creationName = `AnalyticsPlugin${remotePlugin.name}`), 
                remotePlugin.libraryName || (remotePlugin.libraryName = `AnalyticsPlugin${remotePlugin.name}`), 
                remotePlugin.url || (remotePlugin.url = `${cdn}analytics-plugin-${remotePlugin.name.toLocaleLowerCase()}.js`);
                try {
                    const pluginFactory = await loadPluginFactory(remotePlugin);
                    if (pluginFactory) {
                        const plugin = await pluginFactory(Object.assign(Object.assign({
                            app: loadSettings.app || {},
                            rum: loadSettings.rum || {}
                        }, remotePlugin.settings), mergedIntegrations[remotePlugin.name])), plugins = Array.isArray(plugin) ? plugin : [ plugin ];
                        !function(pluginLike) {
                            if (!Array.isArray(pluginLike)) throw new Error("Not a valid list of plugins");
                            const required = [ "load", "isLoaded", "name", "version", "type" ];
                            pluginLike.forEach((plugin => {
                                required.forEach((method => {
                                    var _a;
                                    if (void 0 === plugin[method]) throw new Error(`Plugin: ${null !== (_a = plugin.name) && void 0 !== _a ? _a : "unknown"} missing required function ${method}`);
                                }));
                            }));
                        }(plugins);
                        const routing = routingRules.filter((rule => rule.destinationName === remotePlugin.creationName));
                        plugins.forEach((plugin => {
                            const wrapper = new ActionDestination(remotePlugin.creationName, plugin);
                            routing.length && routingMiddleware && wrapper.addMiddleware(routingMiddleware), 
                            allPlugins.push(wrapper);
                        }));
                    }
                } catch (error) {
                    console.warn("Failed to load Remote Plugin", error);
                }
            }));
            return await Promise.all(pluginPromises), allPlugins.filter(Boolean);
        }
        var _a, _b;
        const inspectorHost = null !== (_a = (_b = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : null).__SEGMENT_INSPECTOR__) && void 0 !== _a ? _a : _b.__SEGMENT_INSPECTOR__ = {};
        async function flushFinalBuffer(analytics, buffer) {
            await (async (analytics, buffer) => {
                for (const c of buffer.getAndRemove("addSourceMiddleware")) await callAnalyticsMethod(analytics, c).catch(console.error);
            })(analytics, buffer), ((analytics, buffer) => {
                Object.keys(buffer.calls).forEach((m => {
                    buffer.getAndRemove(m).forEach((c => {
                        setTimeout((() => {
                            callAnalyticsMethod(analytics, c).catch(console.error);
                        }), 0);
                    }));
                }));
            })(analytics, buffer);
        }
        async function registerPlugins(loadSettings, cdnSettings, analytics, options, pluginLikes = [], preInitBuffer) {
            !function(analytics, buffer) {
                flushSetAnonymousID(analytics, buffer), flushOn(analytics, buffer);
            }(analytics, preInitBuffer);
            const pluginsFromSettings = null == pluginLikes ? void 0 : pluginLikes.filter((pluginLike => "object" == typeof pluginLike)), mergedSettings = function(cdnSettings, options) {
                var _a;
                const optionOverrides = Object.entries(null !== (_a = options.integrations) && void 0 !== _a ? _a : {}).reduce(((overrides, [integration, options]) => "object" == typeof options ? Object.assign(Object.assign({}, overrides), {
                    [integration]: options
                }) : Object.assign(Object.assign({}, overrides), {
                    [integration]: {}
                })), {});
                return Object.entries(cdnSettings.integrations).reduce(((integrationSettings, [integration, settings]) => Object.assign(Object.assign({}, integrationSettings), {
                    [integration]: Object.assign(Object.assign({}, settings), optionOverrides[integration])
                })), {});
            }(cdnSettings, options), remotePlugins = await remoteLoader(loadSettings, cdnSettings, mergedSettings).catch((() => [])), basePlugins = [ envEnrichment, ...remotePlugins ], ctx = await analytics.register(...basePlugins, ...pluginsFromSettings);
            return await (async (analytics, buffer) => {
                for (const c of buffer.getAndRemove("register")) await callAnalyticsMethod(analytics, c).catch(console.error);
            })(analytics, preInitBuffer), ctx;
        }
        async function loadAnalytics(settings, options = {}, preInitBuffer) {
            var _a, _b, _c, key;
            options.globalAnalyticsKey && (key = options.globalAnalyticsKey, _globalAnalyticsKey = key), 
            settings.cdnURL && (cdn => {
                const globalAnalytics = getGlobalAnalytics();
                globalAnalytics && (globalAnalytics._cdn = cdn), _globalCDN = cdn;
            })(settings.cdnURL), options.initialPageview && preInitBuffer.add(new PreInitMethodCall("page", []));
            let cdnSettings = settings.cdnSettings;
            const retryQueue = null === (_b = null === (_a = cdnSettings.integrations["Segment.io"]) || void 0 === _a ? void 0 : _a.retryQueue) || void 0 === _b || _b;
            options = Object.assign({
                retryQueue: retryQueue
            }, options);
            const analytics = new Analytics(Object.assign(Object.assign({}, settings), {
                cdnSettings: cdnSettings,
                cdnURL: settings.cdnURL
            }), options);
            (analytics => {
                var _a;
                null === (_a = inspectorHost.attach) || void 0 === _a || _a.call(inspectorHost, analytics);
            })(analytics);
            const plugins = null !== (_c = settings.plugins) && void 0 !== _c ? _c : [], ctx = await registerPlugins(settings, cdnSettings, analytics, options, plugins, preInitBuffer);
            return analytics.initialized = !0, analytics.emit("initialize", settings, options), 
            await flushFinalBuffer(analytics, preInitBuffer), [ analytics, ctx ];
        }
        class AnalyticsBrowser extends class {
            constructor(loader) {
                this.track = this._createMethod("track"), this.page = this._createMethod("page"), 
                this.register = this._createMethod("register"), this.VERSION = "1.74.0", this._preInitBuffer = new PreInitMethodCallBuffer, 
                this._promise = loader(this._preInitBuffer), this._promise.then((([ajs, ctx]) => {
                    this.instance = ajs, this.ctx = ctx;
                })).catch((() => {}));
            }
            then(...args) {
                return this._promise.then(...args);
            }
            catch(...args) {
                return this._promise.catch(...args);
            }
            finally(...args) {
                return this._promise.finally(...args);
            }
            _createMethod(methodName) {
                return (...args) => {
                    if (this.instance) {
                        const result = this.instance[methodName](...args);
                        return Promise.resolve(result);
                    }
                    return new Promise(((resolve, reject) => {
                        this._preInitBuffer.add(new PreInitMethodCall(methodName, args, resolve, reject));
                    }));
                };
            }
        } {
            constructor() {
                const {promise: loadStart, resolve: resolveLoadStart} = createDeferred();
                super((buffer => loadStart.then((([settings, options]) => loadAnalytics(settings, options, buffer))))), 
                this._resolveLoadStart = (settings, options) => resolveLoadStart([ settings, options ]);
            }
            load(settings, options = {}) {
                return this._resolveLoadStart(settings, options), this;
            }
            static load(settings, options = {}) {
                return (new AnalyticsBrowser).load(settings, options);
            }
            static standalone(settings, options) {
                return AnalyticsBrowser.load(settings, options).then((res => res[0]));
            }
        }
        !function(version) {
            _version = version;
        }("web"), async function() {
            var _a, _b, _c, _d;
            const settings = null !== (_b = null === (_a = getGlobalAnalytics()) || void 0 === _a ? void 0 : _a._loadSettings) && void 0 !== _b ? _b : {
                writeKey: "REQUIRED"
            }, options = null !== (_d = null === (_c = getGlobalAnalytics()) || void 0 === _c ? void 0 : _c._loadOptions) && void 0 !== _d ? _d : {};
            var analytics;
            analytics = await AnalyticsBrowser.standalone(settings, options), window[_globalAnalyticsKey] = analytics;
        }();
    }(), window.AnalyticsNext = __webpack_exports__;
}();