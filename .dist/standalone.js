/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2559:
/*!*********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/clone.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clone = void 0;
function clone(properties) {
    if (Object.prototype.toString.call(properties) === '[object Object]') {
        var temp = {};
        for (var key in properties) {
            temp[key] = clone(properties[key]);
        }
        return temp;
    }
    else if (Array.isArray(properties)) {
        return properties.map(clone);
    }
    else {
        return properties;
    }
}
exports.clone = clone;
//# sourceMappingURL=clone.js.map

/***/ }),

/***/ 1717:
/*!**********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/delete.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delete = void 0;
var inherits_1 = __importDefault(__webpack_require__(/*! inherits */ 1285));
var facade_1 = __webpack_require__(/*! ./facade */ 6526);
function Delete(dictionary, opts) {
    facade_1.Facade.call(this, dictionary, opts);
}
exports.Delete = Delete;
inherits_1.default(Delete, facade_1.Facade);
Delete.prototype.type = function () {
    return "delete";
};
//# sourceMappingURL=delete.js.map

/***/ }),

/***/ 6526:
/*!**********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/facade.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Facade = void 0;
var clone_1 = __webpack_require__(/*! ./clone */ 2559);
var is_enabled_1 = __importDefault(__webpack_require__(/*! ./is-enabled */ 3243));
var new_date_1 = __importDefault(__webpack_require__(/*! new-date */ 5870));
var analytics_js_obj_case_1 = __importDefault(__webpack_require__(/*! @head.js/analytics.js-obj-case */ 9174));
var analytics_js_isodate_traverse_1 = __importDefault(__webpack_require__(/*! @head.js/analytics.js-isodate-traverse */ 1564));
function Facade(obj, opts) {
    opts = opts || {};
    this.raw = clone_1.clone(obj);
    if (!("clone" in opts))
        opts.clone = true;
    if (opts.clone)
        obj = clone_1.clone(obj);
    if (!("traverse" in opts))
        opts.traverse = true;
    if (!("timestamp" in obj))
        obj.timestamp = new Date();
    else
        obj.timestamp = new_date_1.default(obj.timestamp);
    if (opts.traverse)
        analytics_js_isodate_traverse_1.default(obj);
    this.opts = opts;
    this.obj = obj;
}
exports.Facade = Facade;
var f = Facade.prototype;
f.proxy = function (field) {
    var fields = field.split(".");
    field = fields.shift();
    var obj = this[field] || this.field(field);
    if (!obj)
        return obj;
    if (typeof obj === "function")
        obj = obj.call(this) || {};
    if (fields.length === 0)
        return this.opts.clone ? transform(obj) : obj;
    obj = analytics_js_obj_case_1.default(obj, fields.join("."));
    return this.opts.clone ? transform(obj) : obj;
};
f.field = function (field) {
    var obj = this.obj[field];
    return this.opts.clone ? transform(obj) : obj;
};
Facade.proxy = function (field) {
    return function () {
        return this.proxy(field);
    };
};
Facade.field = function (field) {
    return function () {
        return this.field(field);
    };
};
Facade.multi = function (path) {
    return function () {
        var multi = this.proxy(path + "s");
        if (Array.isArray(multi))
            return multi;
        var one = this.proxy(path);
        if (one)
            one = [this.opts.clone ? clone_1.clone(one) : one];
        return one || [];
    };
};
Facade.one = function (path) {
    return function () {
        var one = this.proxy(path);
        if (one)
            return one;
        var multi = this.proxy(path + "s");
        if (Array.isArray(multi))
            return multi[0];
    };
};
f.json = function () {
    var ret = this.opts.clone ? clone_1.clone(this.obj) : this.obj;
    if (this.type)
        ret.type = this.type();
    return ret;
};
f.rawEvent = function () {
    return this.raw;
};
f.options = function (integration) {
    var obj = this.obj.options || this.obj.context || {};
    var options = this.opts.clone ? clone_1.clone(obj) : obj;
    if (!integration)
        return options;
    if (!this.enabled(integration))
        return;
    var integrations = this.integrations();
    var value = integrations[integration] || analytics_js_obj_case_1.default(integrations, integration);
    if (typeof value !== "object")
        value = analytics_js_obj_case_1.default(this.options(), integration);
    return typeof value === "object" ? value : {};
};
f.context = f.options;
f.enabled = function (integration) {
    var allEnabled = this.proxy("options.providers.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = this.proxy("options.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = this.proxy("integrations.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = true;
    var enabled = allEnabled && is_enabled_1.default(integration);
    var options = this.integrations();
    if (options.providers && options.providers.hasOwnProperty(integration)) {
        enabled = options.providers[integration];
    }
    if (options.hasOwnProperty(integration)) {
        var settings = options[integration];
        if (typeof settings === "boolean") {
            enabled = settings;
        }
        else {
            enabled = true;
        }
    }
    return !!enabled;
};
f.integrations = function () {
    return (this.obj.integrations || this.proxy("options.providers") || this.options());
};
f.active = function () {
    var active = this.proxy("options.active");
    if (active === null || active === undefined)
        active = true;
    return active;
};
f.anonymousId = function () {
    return this.field("anonymousId") || this.field("sessionId");
};
f.sessionId = f.anonymousId;
f.groupId = Facade.proxy("options.groupId");
f.traits = function (aliases) {
    var ret = this.proxy("options.traits") || {};
    var id = this.userId();
    aliases = aliases || {};
    if (id)
        ret.id = id;
    for (var alias in aliases) {
        var value = this[alias] == null
            ? this.proxy("options.traits." + alias)
            : this[alias]();
        if (value == null)
            continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
    }
    return ret;
};
f.library = function () {
    var library = this.proxy("options.library");
    if (!library)
        return { name: "unknown", version: null };
    if (typeof library === "string")
        return { name: library, version: null };
    return library;
};
f.device = function () {
    var device = this.proxy("context.device");
    if (typeof device !== "object" || device === null) {
        device = {};
    }
    var library = this.library().name;
    if (device.type)
        return device;
    if (library.indexOf("ios") > -1)
        device.type = "ios";
    if (library.indexOf("android") > -1)
        device.type = "android";
    return device;
};
f.userAgent = Facade.proxy("context.userAgent");
f.timezone = Facade.proxy("context.timezone");
f.timestamp = Facade.field("timestamp");
f.channel = Facade.field("channel");
f.ip = Facade.proxy("context.ip");
f.userId = Facade.field("userId");
function transform(obj) {
    return clone_1.clone(obj);
}
//# sourceMappingURL=facade.js.map

/***/ }),

/***/ 3994:
/*!************************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/identify.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Identify = void 0;
var facade_1 = __webpack_require__(/*! ./facade */ 6526);
var analytics_js_obj_case_1 = __importDefault(__webpack_require__(/*! @head.js/analytics.js-obj-case */ 9174));
var inherits_1 = __importDefault(__webpack_require__(/*! inherits */ 1285));
var is_email_1 = __importDefault(__webpack_require__(/*! ./is-email */ 3266));
var new_date_1 = __importDefault(__webpack_require__(/*! new-date */ 5870));
var trim = function (str) { return str.trim(); };
function Identify(dictionary, opts) {
    facade_1.Facade.call(this, dictionary, opts);
}
exports.Identify = Identify;
inherits_1.default(Identify, facade_1.Facade);
var i = Identify.prototype;
i.action = function () {
    return "identify";
};
i.type = i.action;
i.traits = function (aliases) {
    var ret = this.field("traits") || {};
    var id = this.userId();
    aliases = aliases || {};
    if (id)
        ret.id = id;
    for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy("traits." + alias) : this[alias]();
        if (value == null)
            continue;
        ret[aliases[alias]] = value;
        if (alias !== aliases[alias])
            delete ret[alias];
    }
    return ret;
};
i.email = function () {
    var email = this.proxy("traits.email");
    if (email)
        return email;
    var userId = this.userId();
    if (is_email_1.default(userId))
        return userId;
};
i.created = function () {
    var created = this.proxy("traits.created") || this.proxy("traits.createdAt");
    if (created)
        return new_date_1.default(created);
};
i.name = function () {
    var name = this.proxy("traits.name");
    if (typeof name === "string") {
        return trim(name);
    }
    var firstName = this.firstName();
    var lastName = this.lastName();
    if (firstName && lastName) {
        return trim(firstName + " " + lastName);
    }
};
i.uid = function () {
    return this.userId() || this.username() || this.email();
};
i.description = function () {
    return this.proxy("traits.description") || this.proxy("traits.background");
};
i.avatar = function () {
    var traits = this.traits();
    return (analytics_js_obj_case_1.default(traits, "avatar") || analytics_js_obj_case_1.default(traits, "photoUrl") || analytics_js_obj_case_1.default(traits, "avatarUrl"));
};
i.username = facade_1.Facade.proxy("traits.username");
//# sourceMappingURL=identify.js.map

/***/ }),

/***/ 6445:
/*!*********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/index.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delete = exports.Screen = exports.Page = exports.Track = exports.Identify = exports.Facade = void 0;
var facade_1 = __webpack_require__(/*! ./facade */ 6526);
Object.defineProperty(exports, "Facade", ({ enumerable: true, get: function () { return facade_1.Facade; } }));
var identify_1 = __webpack_require__(/*! ./identify */ 3994);
Object.defineProperty(exports, "Identify", ({ enumerable: true, get: function () { return identify_1.Identify; } }));
var track_1 = __webpack_require__(/*! ./track */ 9085);
Object.defineProperty(exports, "Track", ({ enumerable: true, get: function () { return track_1.Track; } }));
var page_1 = __webpack_require__(/*! ./page */ 1351);
Object.defineProperty(exports, "Page", ({ enumerable: true, get: function () { return page_1.Page; } }));
var screen_1 = __webpack_require__(/*! ./screen */ 1525);
Object.defineProperty(exports, "Screen", ({ enumerable: true, get: function () { return screen_1.Screen; } }));
var delete_1 = __webpack_require__(/*! ./delete */ 1717);
Object.defineProperty(exports, "Delete", ({ enumerable: true, get: function () { return delete_1.Delete; } }));
exports["default"] = __assign(__assign({}, facade_1.Facade), { Identify: identify_1.Identify,
    Track: track_1.Track,
    Page: page_1.Page,
    Screen: screen_1.Screen,
    Delete: delete_1.Delete });
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3266:
/*!************************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/is-email.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var matcher = /.+\@.+\..+/;
function isEmail(string) {
    return matcher.test(string);
}
exports["default"] = isEmail;
//# sourceMappingURL=is-email.js.map

/***/ }),

/***/ 3243:
/*!**************************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/is-enabled.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var disabled = {
    Salesforce: true,
};
function default_1(integration) {
    return !disabled[integration];
}
exports["default"] = default_1;
//# sourceMappingURL=is-enabled.js.map

/***/ }),

/***/ 1351:
/*!********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/page.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Page = void 0;
var inherits_1 = __importDefault(__webpack_require__(/*! inherits */ 1285));
var facade_1 = __webpack_require__(/*! ./facade */ 6526);
var track_1 = __webpack_require__(/*! ./track */ 9085);
var is_email_1 = __importDefault(__webpack_require__(/*! ./is-email */ 3266));
function Page(dictionary, opts) {
    facade_1.Facade.call(this, dictionary, opts);
}
exports.Page = Page;
inherits_1.default(Page, facade_1.Facade);
var p = Page.prototype;
p.action = function () {
    return "page";
};
p.type = p.action;
p.category = facade_1.Facade.field("category");
p.name = facade_1.Facade.field("name");
p.title = facade_1.Facade.proxy("properties.title");
p.path = facade_1.Facade.proxy("properties.path");
p.url = facade_1.Facade.proxy("properties.url");
p.referrer = function () {
    return (this.proxy("context.referrer.url") ||
        this.proxy("context.page.referrer") ||
        this.proxy("properties.referrer"));
};
p.properties = function (aliases) {
    var props = this.field("properties") || {};
    var category = this.category();
    var name = this.name();
    aliases = aliases || {};
    if (category)
        props.category = category;
    if (name)
        props.name = name;
    for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy("properties." + alias) : this[alias]();
        if (value == null)
            continue;
        props[aliases[alias]] = value;
        if (alias !== aliases[alias])
            delete props[alias];
    }
    return props;
};
p.email = function () {
    var email = this.proxy("context.traits.email") || this.proxy("properties.email");
    if (email)
        return email;
    var userId = this.userId();
    if (is_email_1.default(userId))
        return userId;
};
p.fullName = function () {
    var category = this.category();
    var name = this.name();
    return name && category ? category + " " + name : name;
};
p.event = function (name) {
    return name ? "Viewed " + name + " Page" : "Loaded a Page";
};
p.track = function (name) {
    var json = this.json();
    json.event = this.event(name);
    json.timestamp = this.timestamp();
    json.properties = this.properties();
    return new track_1.Track(json, this.opts);
};
//# sourceMappingURL=page.js.map

/***/ }),

/***/ 1525:
/*!**********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/screen.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Screen = void 0;
var inherits_1 = __importDefault(__webpack_require__(/*! inherits */ 1285));
var page_1 = __webpack_require__(/*! ./page */ 1351);
var track_1 = __webpack_require__(/*! ./track */ 9085);
function Screen(dictionary, opts) {
    page_1.Page.call(this, dictionary, opts);
}
exports.Screen = Screen;
inherits_1.default(Screen, page_1.Page);
Screen.prototype.action = function () {
    return "screen";
};
Screen.prototype.type = Screen.prototype.action;
Screen.prototype.event = function (name) {
    return name ? "Viewed " + name + " Screen" : "Loaded a Screen";
};
Screen.prototype.track = function (name) {
    var json = this.json();
    json.event = this.event(name);
    json.timestamp = this.timestamp();
    json.properties = this.properties();
    return new track_1.Track(json, this.opts);
};
//# sourceMappingURL=screen.js.map

/***/ }),

/***/ 9085:
/*!*********************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-facade/dist/track.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Track = void 0;
var inherits_1 = __importDefault(__webpack_require__(/*! inherits */ 1285));
var facade_1 = __webpack_require__(/*! ./facade */ 6526);
var identify_1 = __webpack_require__(/*! ./identify */ 3994);
var is_email_1 = __importDefault(__webpack_require__(/*! ./is-email */ 3266));
function Track(dictionary, opts) {
    facade_1.Facade.call(this, dictionary, opts);
}
exports.Track = Track;
inherits_1.default(Track, facade_1.Facade);
var t = Track.prototype;
t.action = function () {
    return "track";
};
t.type = t.action;
t.event = facade_1.Facade.field("event");
t.value = facade_1.Facade.proxy("properties.value");
t.category = facade_1.Facade.proxy("properties.category");
t.id = facade_1.Facade.proxy("properties.id");
t.name = facade_1.Facade.proxy("properties.name");
t.description = facade_1.Facade.proxy("properties.description");
t.plan = facade_1.Facade.proxy("properties.plan");
t.referrer = function () {
    return (this.proxy("context.referrer.url") ||
        this.proxy("context.page.referrer") ||
        this.proxy("properties.referrer"));
};
t.query = facade_1.Facade.proxy("options.query");
t.properties = function (aliases) {
    var ret = this.field("properties") || {};
    aliases = aliases || {};
    for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy("properties." + alias) : this[alias]();
        if (value == null)
            continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
    }
    return ret;
};
t.username = function () {
    return (this.proxy("traits.username") ||
        this.proxy("properties.username") ||
        this.userId() ||
        this.sessionId());
};
t.email = function () {
    var email = this.proxy("traits.email") ||
        this.proxy("properties.email") ||
        this.proxy("options.traits.email");
    if (email)
        return email;
    var userId = this.userId();
    if (is_email_1.default(userId))
        return userId;
};
t.revenue = function () {
    var revenue = this.proxy("properties.revenue");
    var event = this.event();
    var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;
    if (!revenue && event && event.match(orderCompletedRegExp)) {
        revenue = this.proxy("properties.total");
    }
    return currency(revenue);
};
t.identify = function () {
    var json = this.json();
    json.traits = this.traits();
    return new identify_1.Identify(json, this.opts);
};
function currency(val) {
    if (!val)
        return;
    if (typeof val === "number") {
        return val;
    }
    if (typeof val !== "string") {
        return;
    }
    val = val.replace(/\$/g, "");
    val = parseFloat(val);
    if (!isNaN(val)) {
        return val;
    }
}
//# sourceMappingURL=track.js.map

/***/ }),

/***/ 1564:
/*!******************************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-isodate-traverse/lib/index.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isodate = __webpack_require__(/*! @segment/isodate */ 8264);

/**
 * Expose `traverse`.
 */
module.exports = traverse;

/**
 * Recursively traverse an object or array, and convert
 * all ISO date strings parse into Date objects.
 *
 * @param {Object} input - object, array, or string to convert
 * @param {Boolean} strict - only convert strings with year, month, and date
 * @return {Object}
 */
function traverse(input, strict) {
  if (strict === undefined) strict = true;
  if (input && typeof input === 'object') {
    return traverseObject(input, strict);
  } else if (Array.isArray(input)) {
    return traverseArray(input, strict);
  } else if (isodate.is(input, strict)) {
    return isodate.parse(input);
  }
  return input;
}

/**
 * Object traverser helper function.
 *
 * @param {Object} obj - object to traverse
 * @param {Boolean} strict - only convert strings with year, month, and date
 * @return {Object}
 */
function traverseObject(obj, strict) {
  Object.keys(obj).forEach(function(key) {
    obj[key] = traverse(obj[key], strict);
  });
  return obj;
}

/**
 * Array traverser helper function
 *
 * @param {Array} arr - array to traverse
 * @param {Boolean} strict - only convert strings with year, month, and date
 * @return {Array}
 */
function traverseArray(arr, strict) {
  arr.forEach(function(value, index) {
    arr[index] = traverse(value, strict);
  });
  return arr;
}


/***/ }),

/***/ 9174:
/*!******************************************************************!*\
  !*** ../../node_modules/@head.js/analytics.js-obj-case/index.js ***!
  \******************************************************************/
/***/ (function(module) {


var identity = function(_){ return _; };


/**
 * Module exports, export
 */

module.exports = multiple(find);
module.exports.find = module.exports;


/**
 * Export the replacement function, return the modified object
 */

module.exports.replace = function (obj, key, val, options) {
  multiple(replace).call(this, obj, key, val, options);
  return obj;
};


/**
 * Export the delete function, return the modified object
 */

module.exports.del = function (obj, key, options) {
  multiple(del).call(this, obj, key, null, options);
  return obj;
};


/**
 * Compose applying the function to a nested key
 */

function multiple (fn) {
  return function (obj, path, val, options) {
    var normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
    path = normalize(path);

    var key;
    var finished = false;

    while (!finished) loop();

    function loop() {
      for (key in obj) {
        var normalizedKey = normalize(key);
        if (0 === path.indexOf(normalizedKey)) {
          var temp = path.substr(normalizedKey.length);
          if (temp.charAt(0) === '.' || temp.length === 0) {
            path = temp.substr(1);
            var child = obj[key];

            // we're at the end and there is nothing.
            if (null == child) {
              finished = true;
              return;
            }

            // we're at the end and there is something.
            if (!path.length) {
              finished = true;
              return;
            }

            // step into child
            obj = child;

            // but we're done here
            return;
          }
        }
      }

      key = undefined;
      // if we found no matching properties
      // on the current object, there's no match.
      finished = true;
    }

    if (!key) return;
    if (null == obj) return obj;

    // the `obj` and `key` is one above the leaf object and key, so
    // start object: { a: { 'b.c': 10 } }
    // end object: { 'b.c': 10 }
    // end key: 'b.c'
    // this way, you can do `obj[key]` and get `10`.
    return fn(obj, key, val);
  };
}


/**
 * Find an object by its key
 *
 * find({ first_name : 'Calvin' }, 'firstName')
 */

function find (obj, key) {
  if (obj.hasOwnProperty(key)) return obj[key];
}


/**
 * Delete a value for a given key
 *
 * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
 */

function del (obj, key) {
  if (obj.hasOwnProperty(key)) delete obj[key];
  return obj;
}


/**
 * Replace an objects existing value with a new one
 *
 * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
 */

function replace (obj, key, val) {
  if (obj.hasOwnProperty(key)) obj[key] = val;
  return obj;
}

/**
 * Normalize a `dot.separated.path`.
 *
 * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
 *
 * @param {String} path
 * @return {String}
 */

function defaultNormalize(path) {
  return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
}

/**
 * Check if a value is a function.
 *
 * @param {*} val
 * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
 */

function isFunction(val) {
  return typeof val === 'function';
}


/***/ }),

/***/ 8264:
/*!********************************************************!*\
  !*** ../../node_modules/@segment/isodate/lib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * Matcher, slightly modified from:
 *
 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
 */

var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

/**
 * Convert an ISO date string to a date. Fallback to native `Date.parse`.
 *
 * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
 *
 * @param {String} iso
 * @return {Date}
 */

exports.parse = function(iso) {
  var numericKeys = [1, 5, 6, 7, 11, 12];
  var arr = matcher.exec(iso);
  var offset = 0;

  // fallback to native parsing
  if (!arr) {
    return new Date(iso);
  }

  /* eslint-disable no-cond-assign */
  // remove undefined values
  for (var i = 0, val; val = numericKeys[i]; i++) {
    arr[val] = parseInt(arr[val], 10) || 0;
  }
  /* eslint-enable no-cond-assign */

  // allow undefined days and months
  arr[2] = parseInt(arr[2], 10) || 1;
  arr[3] = parseInt(arr[3], 10) || 1;

  // month is 0-11
  arr[2]--;

  // allow abitrary sub-second precision
  arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

  // apply timezone if one exists
  if (arr[4] === ' ') {
    offset = new Date().getTimezoneOffset();
  } else if (arr[9] !== 'Z' && arr[10]) {
    offset = arr[11] * 60 + arr[12];
    if (arr[10] === '+') {
      offset = 0 - offset;
    }
  }

  var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
  return new Date(millis);
};


/**
 * Checks whether a `string` is an ISO date string. `strict` mode requires that
 * the date string at least have a year, month and date.
 *
 * @param {String} string
 * @param {Boolean} strict
 * @return {Boolean}
 */

exports.is = function(string, strict) {
  if (typeof string !== 'string') {
    return false;
  }
  if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
    return false;
  }
  return matcher.test(string);
};


/***/ }),

/***/ 1285:
/*!*******************************************************!*\
  !*** ../../node_modules/inherits/inherits_browser.js ***!
  \*******************************************************/
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 5870:
/*!************************************************!*\
  !*** ../../node_modules/new-date/lib/index.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isodate = __webpack_require__(/*! @segment/isodate */ 8264);
var milliseconds = __webpack_require__(/*! ./milliseconds */ 5228);
var seconds = __webpack_require__(/*! ./seconds */ 6076);

var objProto = Object.prototype;
var toStr = objProto.toString;

function isDate(value) {
  return toStr.call(value) === "[object Date]";
}

function isNumber(value) {
  return toStr.call(value) === "[object Number]";
}

/**
 * Returns a new Javascript Date object, allowing a variety of extra input types
 * over the native Date constructor.
 *
 * @param {Date|string|number} val
 */
module.exports = function newDate(val) {
  if (isDate(val)) return val;
  if (isNumber(val)) return new Date(toMs(val));

  // date strings
  if (isodate.is(val)) {
    return isodate.parse(val);
  }
  if (milliseconds.is(val)) {
    return milliseconds.parse(val);
  }
  if (seconds.is(val)) {
    return seconds.parse(val);
  }

  // fallback to Date.parse
  return new Date(val);
};

/**
 * If the number passed val is seconds from the epoch, turn it into milliseconds.
 * Milliseconds would be greater than 31557600000 (December 31, 1970).
 *
 * @param {number} num
 */
function toMs(num) {
  if (num < 31557600000) return num * 1000;
  return num;
}


/***/ }),

/***/ 5228:
/*!*******************************************************!*\
  !*** ../../node_modules/new-date/lib/milliseconds.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * Matcher.
 */

var matcher = /\d{13}/;

/**
 * Check whether a string is a millisecond date string.
 *
 * @param {string} string
 * @return {boolean}
 */
exports.is = function (string) {
  return matcher.test(string);
};

/**
 * Convert a millisecond string to a date.
 *
 * @param {string} millis
 * @return {Date}
 */
exports.parse = function (millis) {
  millis = parseInt(millis, 10);
  return new Date(millis);
};


/***/ }),

/***/ 6076:
/*!**************************************************!*\
  !*** ../../node_modules/new-date/lib/seconds.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


/**
 * Matcher.
 */

var matcher = /\d{10}/;

/**
 * Check whether a string is a second date string.
 *
 * @param {string} string
 * @return {Boolean}
 */
exports.is = function (string) {
  return matcher.test(string);
};

/**
 * Convert a second string to a date.
 *
 * @param {string} seconds
 * @return {Date}
 */
exports.parse = function (seconds) {
  var millis = parseInt(seconds, 10) * 1000;
  return new Date(millis);
};


/***/ }),

/***/ 4791:
/*!*************************************************!*\
  !*** ../../node_modules/spark-md5/spark-md5.js ***!
  \*************************************************/
/***/ (function(module) {

(function (factory) {
    if (true) {
        // Node/CommonJS
        module.exports = factory();
    } else { var glob; }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a  = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d  = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c  = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b  = (b << 22 | b >>> 10) + c | 0;

        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a  = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d  = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c  = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b  = (b << 20 | b >>> 12) + c | 0;

        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a  = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d  = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c  = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b  = (b << 23 | b >>> 9) + c | 0;

        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b  = (b << 21 |b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a  = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d  = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c  = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b  = (b << 21 | b >>> 11) + c | 0;

        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function SparkMD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash.slice()
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */
    SparkMD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    SparkMD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    SparkMD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} [raw] True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return SparkMD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} [raw]     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    SparkMD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    SparkMD5.ArrayBuffer.prototype.getState = function () {
        var state = SparkMD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */
    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     [raw] True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
}));


/***/ }),

/***/ 4403:
/*!******************************!*\
  !*** ./src/browser/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnalyticsBrowser": function() { return /* binding */ AnalyticsBrowser; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_parse_cdn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lib/parse-cdn */ 7566);
/* harmony import */ var _core_analytics__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/analytics */ 1555);
/* harmony import */ var _lib_merged_options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/merged-options */ 5944);
/* harmony import */ var _lib_create_deferred__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../lib/create-deferred */ 6022);
/* harmony import */ var _plugins_page_enrichment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../plugins/page-enrichment */ 9603);
/* harmony import */ var _plugins_remote_loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../plugins/remote-loader */ 3208);
/* harmony import */ var _plugins_validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../plugins/validation */ 1067);
/* harmony import */ var _core_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/buffer */ 1444);
/* harmony import */ var _core_buffer_snippet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/buffer/snippet */ 8461);
/* harmony import */ var _core_inspector__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../core/inspector */ 9778);
/* harmony import */ var _core_stats__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/stats */ 6218);

// import { getProcessEnv } from '../lib/get-process-env'

// import { fetch } from '../lib/fetch'





// import { segmentio, SegmentioSettings } from '../plugins/segmentio'



// import { ClassicIntegrationSource } from '../plugins/ajs-destination/types'


// export function loadLegacySettings(
//   writeKey: string,
//   cdnURL?: string
// ): Promise<LegacySettings> {
//   const baseUrl = cdnURL ?? getCDN()
//   return fetch(`${baseUrl}/v1/projects/${writeKey}/settings`)
//     .then((res) => {
//       if (!res.ok) {
//         return res.text().then((errorResponseMessage) => {
//           throw new Error(errorResponseMessage)
//         })
//       }
//       return res.json()
//     })
//     .catch((err) => {
//       console.error(err.message)
//       throw err
//     })
// }
// function hasLegacyDestinations(settings: LegacySettings): boolean {
//   return (
//     getProcessEnv().NODE_ENV !== 'test' &&
//     // just one integration means segmentio
//     Object.keys(settings.integrations).length > 1
//   )
// }
// function hasTsubMiddleware(settings: LegacySettings): boolean {
//   return (
//     getProcessEnv().NODE_ENV !== 'test' &&
//     (settings.middlewareSettings?.routingRules?.length ?? 0) > 0
//   )
// }
/**
 * With AJS classic, we allow users to call setAnonymousId before the library initialization.
 * This is important because some of the destinations will use the anonymousId during the initialization,
 * and if we set anonId afterwards, that wouldn’t impact the destination.
 *
 * Also Ensures events can be registered before library initialization.
 * This is important so users can register to 'initialize' and any events that may fire early during setup.
 */
function flushPreBuffer(analytics, buffer) {
    buffer.push.apply(buffer, (0,_core_buffer_snippet__WEBPACK_IMPORTED_MODULE_0__.popSnippetWindowBuffer)());
    (0,_core_buffer__WEBPACK_IMPORTED_MODULE_1__.flushSetAnonymousID)(analytics, buffer);
    (0,_core_buffer__WEBPACK_IMPORTED_MODULE_1__.flushOn)(analytics, buffer);
}
/**
 * Finish flushing buffer and cleanup.
 */
function flushFinalBuffer(analytics, buffer) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, Promise, function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Call popSnippetWindowBuffer before each flush task since there may be
                    // analytics calls during async function calls.
                    buffer.push.apply(buffer, (0,_core_buffer_snippet__WEBPACK_IMPORTED_MODULE_0__.popSnippetWindowBuffer)());
                    return [4 /*yield*/, (0,_core_buffer__WEBPACK_IMPORTED_MODULE_1__.flushAddSourceMiddleware)(analytics, buffer)];
                case 1:
                    _a.sent();
                    buffer.push.apply(buffer, (0,_core_buffer_snippet__WEBPACK_IMPORTED_MODULE_0__.popSnippetWindowBuffer)());
                    (0,_core_buffer__WEBPACK_IMPORTED_MODULE_1__.flushAnalyticsCallsInNewTask)(analytics, buffer);
                    // Clear buffer, just in case analytics is loaded twice; we don't want to fire events off again.
                    buffer.clear();
                    return [2 /*return*/];
            }
        });
    });
}
function registerPlugins(legacySettings, analytics, options, plugins) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, Promise, function () {
        var mergedSettings, remotePlugins, toRegister, ctx;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mergedSettings = (0,_lib_merged_options__WEBPACK_IMPORTED_MODULE_3__.mergedOptions)(legacySettings, options);
                    return [4 /*yield*/, (0,_plugins_remote_loader__WEBPACK_IMPORTED_MODULE_4__.remoteLoader)(analytics, legacySettings, 
                        // analytics.integrations,
                        mergedSettings).catch(function () { return []; })];
                case 1:
                    remotePlugins = _a.sent();
                    toRegister = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([
                        _plugins_validation__WEBPACK_IMPORTED_MODULE_5__.validation,
                        _plugins_page_enrichment__WEBPACK_IMPORTED_MODULE_6__.pageEnrichment
                    ], plugins, true), remotePlugins, true);
                    return [4 /*yield*/, analytics.register.apply(analytics, toRegister)];
                case 2:
                    ctx = _a.sent();
                    // if (
                    //   Object.entries(legacySettings.enabledMiddleware ?? {}).some(
                    //     ([, enabled]) => enabled
                    //   )
                    // ) {
                    //   await import(
                    //     /* webpackChunkName: "remoteMiddleware" */ '../plugins/remote-middleware'
                    //   ).then(async ({ remoteMiddlewares }) => {
                    //     const middleware = await remoteMiddlewares(
                    //       ctx,
                    //       legacySettings,
                    //       options.obfuscate
                    //     )
                    //     const promises = middleware.map((mdw) =>
                    //       analytics.addSourceMiddleware(mdw)
                    //     )
                    //     return Promise.all(promises)
                    //   })
                    // }
                    return [2 /*return*/, ctx];
            }
        });
    });
}
function loadAnalytics(settings, options, preInitBuffer) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(this, void 0, Promise, function () {
        var legacySettings, retryQueue, opts, analytics, plugins, ctx;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0:
                    // this is an ugly side-effect, but it's for the benefits of the plugins that get their cdn via getCDN()
                    if (settings.cdnURL)
                        (0,_lib_parse_cdn__WEBPACK_IMPORTED_MODULE_7__.setGlobalCDNUrl)(settings.cdnURL);
                    legacySettings = settings.cdnSettings;
                    retryQueue = (_b = (_a = legacySettings.integrations['Segment.io']) === null || _a === void 0 ? void 0 : _a.retryQueue) !== null && _b !== void 0 ? _b : true;
                    opts = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({ retryQueue: retryQueue }, options);
                    analytics = new _core_analytics__WEBPACK_IMPORTED_MODULE_8__.Analytics(settings, opts);
                    (0,_core_inspector__WEBPACK_IMPORTED_MODULE_9__.attachInspector)(analytics);
                    plugins = (_c = settings.plugins) !== null && _c !== void 0 ? _c : [];
                    // const classicIntegrations = settings.classicIntegrations ?? []
                    _core_stats__WEBPACK_IMPORTED_MODULE_10__.Stats.initRemoteMetrics(legacySettings.metrics);
                    // needs to be flushed before plugins are registered
                    flushPreBuffer(analytics, preInitBuffer);
                    return [4 /*yield*/, registerPlugins(legacySettings, analytics, options, plugins)
                        // const search = window.location.search ?? ''
                        // const hash = window.location.hash ?? ''
                        // const term = search.length ? search : hash.replace(/(?=#).*(?=\?)/, '')
                        // if (term.includes('ajs_')) {
                        //   await analytics.queryString(term).catch(console.error)
                        // }
                    ];
                case 1:
                    ctx = _d.sent();
                    // const search = window.location.search ?? ''
                    // const hash = window.location.hash ?? ''
                    // const term = search.length ? search : hash.replace(/(?=#).*(?=\?)/, '')
                    // if (term.includes('ajs_')) {
                    //   await analytics.queryString(term).catch(console.error)
                    // }
                    analytics.initialized = true;
                    analytics.emit('initialize', settings, options);
                    if (options.initialPageview) {
                        analytics.page().catch(console.error);
                    }
                    return [4 /*yield*/, flushFinalBuffer(analytics, preInitBuffer)];
                case 2:
                    _d.sent();
                    return [2 /*return*/, [analytics, ctx]];
            }
        });
    });
}
/**
 * The public browser interface for Segment Analytics
 *
 * @example
 * ```ts
 *  export const analytics = new AnalyticsBrowser()
 *  analytics.load({ writeKey: 'foo' })
 * ```
 * @link https://github.com/segmentio/analytics-next/#readme
 */
var AnalyticsBrowser = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__extends)(AnalyticsBrowser, _super);
    function AnalyticsBrowser() {
        var _this = this;
        var _a = (0,_lib_create_deferred__WEBPACK_IMPORTED_MODULE_11__.createDeferred)(), loadStart = _a.promise, resolveLoadStart = _a.resolve;
        _this = _super.call(this, function (buffer) {
            return loadStart.then(function (_a) {
                var settings = _a[0], options = _a[1];
                return loadAnalytics(settings, options, buffer);
            });
        }) || this;
        _this._resolveLoadStart = function (settings, options) {
            return resolveLoadStart([settings, options]);
        };
        return _this;
    }
    /**
     * Fully initialize an analytics instance, including:
     *
     * * Fetching settings from the segment CDN (by default).
     * * Fetching all remote destinations configured by the user (if applicable).
     * * Flushing buffered analytics events.
     * * Loading all middleware.
     *
     * Note:️  This method should only be called *once* in your application.
     *
     * @example
     * ```ts
     * export const analytics = new AnalyticsBrowser()
     * analytics.load({ writeKey: 'foo' })
     * ```
     */
    AnalyticsBrowser.prototype.load = function (settings, options) {
        if (options === void 0) { options = {}; }
        this._resolveLoadStart(settings, options);
        return this;
    };
    /**
     * Instantiates an object exposing Analytics methods.
     *
     * @example
     * ```ts
     * const ajs = AnalyticsBrowser.load({ writeKey: '<YOUR_WRITE_KEY>' })
     *
     * ajs.track("foo")
     * ...
     * ```
     */
    AnalyticsBrowser.load = function (settings, options) {
        if (options === void 0) { options = {}; }
        return new AnalyticsBrowser().load(settings, options);
    };
    AnalyticsBrowser.standalone = function (settings, options) {
        return AnalyticsBrowser.load(settings, options).then(function (res) { return res[0]; });
    };
    return AnalyticsBrowser;
}(_core_buffer__WEBPACK_IMPORTED_MODULE_1__.AnalyticsBuffered));



/***/ }),

/***/ 2703:
/*!*********************************************!*\
  !*** ./src/browser/standalone-analytics.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "install": function() { return /* binding */ install; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! . */ 4403);


// function getWriteKey(): string | undefined {
//   if (embeddedWriteKey()) {
//     return embeddedWriteKey()
//   }
//   if (window.analytics._writeKey) {
//     return window.analytics._writeKey
//   }
//   const regex = /http.*\/analytics\.js\/v1\/([^/]*)(\/platform)?\/analytics.*/
//   const scripts = Array.prototype.slice.call(
//     document.querySelectorAll('script')
//   )
//   let writeKey: string | undefined = undefined
//   for (const s of scripts) {
//     const src = s.getAttribute('src') ?? ''
//     const result = regex.exec(src)
//     if (result && result[1]) {
//       writeKey = result[1]
//       break
//     }
//   }
//   if (!writeKey && document.currentScript) {
//     const script = document.currentScript as HTMLScriptElement
//     const src = script.src
//     const result = regex.exec(src)
//     if (result && result[1]) {
//       writeKey = result[1]
//     }
//   }
//   return writeKey
// }
function install() {
    var _a, _b, _c, _d;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
        var settings, options, _e;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_f) {
            switch (_f.label) {
                case 0:
                    settings = (_b = (_a = window.analytics) === null || _a === void 0 ? void 0 : _a._loadSettings) !== null && _b !== void 0 ? _b : { writeKey: 'REQUIRED' };
                    options = (_d = (_c = window.analytics) === null || _c === void 0 ? void 0 : _c._loadOptions) !== null && _d !== void 0 ? _d : {};
                    // if (!writeKey) {
                    //   console.error(
                    //     'Failed to load Write Key. Make sure to use the latest version of the Segment snippet, which can be found in your source settings.'
                    //   )
                    //   return
                    // }
                    _e = window;
                    return [4 /*yield*/, ___WEBPACK_IMPORTED_MODULE_1__.AnalyticsBrowser.standalone(settings, options)];
                case 1:
                    // if (!writeKey) {
                    //   console.error(
                    //     'Failed to load Write Key. Make sure to use the latest version of the Segment snippet, which can be found in your source settings.'
                    //   )
                    //   return
                    // }
                    _e.analytics = (_f.sent());
                    return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ 1555:
/*!*************************************!*\
  !*** ./src/core/analytics/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Analytics": function() { return /* binding */ Analytics; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _arguments_resolver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../arguments-resolver */ 6333);
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../connection */ 94);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../context */ 8404);
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @segment/analytics-core */ 9433);
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @segment/analytics-core */ 7127);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../events */ 6513);
/* harmony import */ var _queue_event_queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../queue/event-queue */ 7112);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user */ 8166);
/* harmony import */ var _lib_bind_all__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lib/bind-all */ 8232);
/* harmony import */ var _lib_priority_queue_persisted__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/priority-queue/persisted */ 3061);
/* harmony import */ var _lib_priority_queue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/priority-queue */ 3874);


// import type { FormArgs, LinkArgs } from '../auto-track'








// import { version } from '../../generated/version'

var deprecationWarning = 'This is being deprecated and will be not be available in future releases of Analytics JS';
// // reference any pre-existing "analytics" object so a user can restore the reference
// const global: any = getGlobal()
// const _analytics = global?.analytics
function createDefaultQueue(retryQueue, disablePersistance) {
    if (retryQueue === void 0) { retryQueue = false; }
    if (disablePersistance === void 0) { disablePersistance = false; }
    var maxAttempts = retryQueue ? 4 : 1;
    var priorityQueue = disablePersistance
        ? new _lib_priority_queue__WEBPACK_IMPORTED_MODULE_0__.PriorityQueue(maxAttempts, [])
        : new _lib_priority_queue_persisted__WEBPACK_IMPORTED_MODULE_1__.PersistedPriorityQueue(maxAttempts, 'event-queue');
    return new _queue_event_queue__WEBPACK_IMPORTED_MODULE_2__.EventQueue(priorityQueue);
}
// /* analytics-classic stubs */
// function _stub(this: never) {
//   console.warn(deprecationWarning)
// }
var Analytics = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__extends)(Analytics, _super);
    function Analytics(settings, options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this) || this;
        _this._debug = false;
        _this.initialized = false;
        _this.user = function () {
            return _this._user;
        };
        var cookieOptions = options === null || options === void 0 ? void 0 : options.cookie;
        var disablePersistance = (_a = options === null || options === void 0 ? void 0 : options.disableClientPersistence) !== null && _a !== void 0 ? _a : false;
        _this.settings = settings;
        _this.settings.timeout = (_b = _this.settings.timeout) !== null && _b !== void 0 ? _b : 300;
        _this.queue =
            // queue ??
            createDefaultQueue(options === null || options === void 0 ? void 0 : options.retryQueue, disablePersistance);
        _this._universalStorage = new _user__WEBPACK_IMPORTED_MODULE_4__.UniversalStorage(disablePersistance ? ['memory'] : ['localStorage', 'cookie', 'memory'], (0,_user__WEBPACK_IMPORTED_MODULE_4__.getAvailableStorageOptions)(cookieOptions));
        _this._user =
            // user ??
            new _user__WEBPACK_IMPORTED_MODULE_4__.User(disablePersistance
                ? (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, options === null || options === void 0 ? void 0 : options.user), { persist: false }) : options === null || options === void 0 ? void 0 : options.user, cookieOptions).load();
        // this._group =
        //   group ??
        //   new Group(
        //     disablePersistance
        //       ? { ...options?.group, persist: false }
        //       : options?.group,
        //     cookieOptions
        //   ).load()
        _this.eventFactory = new _events__WEBPACK_IMPORTED_MODULE_5__.EventFactory(_this._user);
        _this.integrations = (_c = options === null || options === void 0 ? void 0 : options.integrations) !== null && _c !== void 0 ? _c : {};
        _this.options = options !== null && options !== void 0 ? options : {};
        (0,_lib_bind_all__WEBPACK_IMPORTED_MODULE_6__["default"])(_this);
        return _this;
    }
    Object.defineProperty(Analytics.prototype, "storage", {
        get: function () {
            return this._universalStorage;
        },
        enumerable: false,
        configurable: true
    });
    Analytics.prototype.track = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            var _a, name, data, opts, cb, segmentEvent;
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_b) {
                _a = _arguments_resolver__WEBPACK_IMPORTED_MODULE_7__.resolveArguments.apply(void 0, args), name = _a[0], data = _a[1], opts = _a[2], cb = _a[3];
                segmentEvent = this.eventFactory.track(name, data, opts, this.integrations);
                return [2 /*return*/, this._dispatch(segmentEvent, cb).then(function (ctx) {
                        _this.emit('track', name, ctx.event.properties, ctx.event.options);
                        return ctx;
                    })];
            });
        });
    };
    Analytics.prototype.page = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            var _a, category, page, properties, options, callback, segmentEvent;
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_b) {
                _a = _arguments_resolver__WEBPACK_IMPORTED_MODULE_7__.resolvePageArguments.apply(void 0, args), category = _a[0], page = _a[1], properties = _a[2], options = _a[3], callback = _a[4];
                segmentEvent = this.eventFactory.page(category, page, properties, options, this.integrations);
                return [2 /*return*/, this._dispatch(segmentEvent, callback).then(function (ctx) {
                        _this.emit('page', category, page, ctx.event.properties, ctx.event.options);
                        return ctx;
                    })];
            });
        });
    };
    // async identify(...args: IdentifyParams): Promise<DispatchedEvent> {
    //   const [id, _traits, options, callback] = resolveUserArguments(this._user)(
    //     ...args
    //   )
    //   this._user.identify(id, _traits)
    //   const segmentEvent = this.eventFactory.identify(
    //     this._user.id(),
    //     this._user.traits(),
    //     options,
    //     this.integrations
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit(
    //       'identify',
    //       ctx.event.userId,
    //       ctx.event.traits,
    //       ctx.event.options
    //     )
    //     return ctx
    //   })
    // }
    // group(): Group
    // group(...args: GroupParams): Promise<DispatchedEvent>
    // group(...args: GroupParams): Promise<DispatchedEvent> | Group {
    //   if (args.length === 0) {
    //     return this._group
    //   }
    //   const [id, _traits, options, callback] = resolveUserArguments(this._group)(
    //     ...args
    //   )
    //   this._group.identify(id, _traits)
    //   const groupId = this._group.id()
    //   const groupTraits = this._group.traits()
    //   const segmentEvent = this.eventFactory.group(
    //     groupId,
    //     groupTraits,
    //     options,
    //     this.integrations
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit('group', ctx.event.groupId, ctx.event.traits, ctx.event.options)
    //     return ctx
    //   })
    // }
    // async alias(...args: AliasParams): Promise<DispatchedEvent> {
    //   const [to, from, options, callback] = resolveAliasArguments(...args)
    //   const segmentEvent = this.eventFactory.alias(
    //     to,
    //     from,
    //     options,
    //     this.integrations
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit('alias', to, from, ctx.event.options)
    //     return ctx
    //   })
    // }
    // async screen(...args: PageParams): Promise<DispatchedEvent> {
    //   const [category, page, properties, options, callback] =
    //     resolvePageArguments(...args)
    //   const segmentEvent = this.eventFactory.screen(
    //     category,
    //     page,
    //     properties,
    //     options,
    //     this.integrations
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit(
    //       'screen',
    //       category,
    //       page,
    //       ctx.event.properties,
    //       ctx.event.options
    //     )
    //     return ctx
    //   })
    // }
    // async trackClick(...args: LinkArgs): Promise<Analytics> {
    //   const autotrack = await import(
    //     /* webpackChunkName: "auto-track" */ '../auto-track'
    //   )
    //   return autotrack.link.call(this, ...args)
    // }
    // async trackLink(...args: LinkArgs): Promise<Analytics> {
    //   const autotrack = await import(
    //     /* webpackChunkName: "auto-track" */ '../auto-track'
    //   )
    //   return autotrack.link.call(this, ...args)
    // }
    // async trackSubmit(...args: FormArgs): Promise<Analytics> {
    //   const autotrack = await import(
    //     /* webpackChunkName: "auto-track" */ '../auto-track'
    //   )
    //   return autotrack.form.call(this, ...args)
    // }
    // async trackForm(...args: FormArgs): Promise<Analytics> {
    //   const autotrack = await import(
    //     /* webpackChunkName: "auto-track" */ '../auto-track'
    //   )
    //   return autotrack.form.call(this, ...args)
    // }
    Analytics.prototype.register = function () {
        var plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plugins[_i] = arguments[_i];
        }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            var ctx, registrations;
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx = _context__WEBPACK_IMPORTED_MODULE_8__.Context.system();
                        registrations = plugins.map(function (xt) {
                            return _this.queue.register(ctx, xt, _this);
                        });
                        return [4 /*yield*/, Promise.all(registrations)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, ctx];
                }
            });
        });
    };
    // async deregister(...plugins: string[]): Promise<Context> {
    //   const ctx = Context.system()
    //   const deregistrations = plugins.map((pl) => {
    //     const plugin = this.queue.plugins.find((p) => p.name === pl)
    //     if (plugin) {
    //       return this.queue.deregister(ctx, plugin, this)
    //     } else {
    //       ctx.log('warn', `plugin ${pl} not found`)
    //     }
    //   })
    //   await Promise.all(deregistrations)
    //   return ctx
    // }
    Analytics.prototype.debug = function (toggle) {
        // Make sure legacy ajs debug gets turned off if it was enabled before upgrading.
        if (toggle === false && localStorage.getItem('debug')) {
            localStorage.removeItem('debug');
        }
        this._debug = toggle;
        return this;
    };
    // reset(): void {
    //   this._user.reset()
    //   this._group.reset()
    //   this.emit('reset')
    // }
    Analytics.prototype.timeout = function (timeout) {
        this.settings.timeout = timeout;
    };
    Analytics.prototype._dispatch = function (event, callback) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            var ctx;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_a) {
                ctx = new _context__WEBPACK_IMPORTED_MODULE_8__.Context(event);
                if ((0,_connection__WEBPACK_IMPORTED_MODULE_9__.isOffline)() && !this.options.retryQueue) {
                    return [2 /*return*/, ctx];
                }
                return [2 /*return*/, (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_10__.dispatch)(ctx, this.queue, this, {
                        callback: callback,
                        debug: this._debug,
                        timeout: this.settings.timeout,
                    })];
            });
        });
    };
    Analytics.prototype.addSourceMiddleware = function (fn) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_a) {
                console.debug(fn);
                // await this.queue.criticalTasks.run(async () => {
                //   const { sourceMiddlewarePlugin } = await import(
                //     /* webpackChunkName: "middleware" */ '../../plugins/middleware'
                //   )
                //   const integrations: Record<string, boolean> = {}
                //   this.queue.plugins.forEach((plugin) => {
                //     if (plugin.type === 'destination') {
                //       return (integrations[plugin.name] = true)
                //     }
                //   })
                //   const plugin = sourceMiddlewarePlugin(fn, integrations)
                //   await this.register(plugin)
                // })
                return [2 /*return*/, this];
            });
        });
    };
    //   /* TODO: This does not have to return a promise? */
    //   addDestinationMiddleware(
    //     integrationName: string,
    //     ...middlewares: DestinationMiddlewareFunction[]
    //   ): Promise<Analytics> {
    //     const legacyDestinations = this.queue.plugins.filter(
    //       (xt) => xt.name.toLowerCase() === integrationName.toLowerCase()
    //     ) as LegacyDestination[]
    //
    //     legacyDestinations.forEach((destination) => {
    //       destination.addMiddleware(...middlewares)
    //     })
    //     return Promise.resolve(this)
    //   }
    Analytics.prototype.setAnonymousId = function (id) {
        return this._user.anonymousId(id);
    };
    //   async queryString(query: string): Promise<Context[]> {
    //     if (this.options.useQueryString === false) {
    //       return []
    //     }
    // 
    //     const { queryString } = await import(
    //       /* webpackChunkName: "queryString" */ '../query-string'
    //     )
    //     return queryString(this, query)
    //   }
    //   /**
    //    * @deprecated This function does not register a destination plugin.
    //    *
    //    * Instantiates a legacy Analytics.js destination.
    //    *
    //    * This function does not register the destination as an Analytics.JS plugin,
    //    * all the it does it to invoke the factory function back.
    //    */
    //   use(legacyPluginFactory: (analytics: Analytics) => void): Analytics {
    //     legacyPluginFactory(this)
    //     return this
    //   }
    Analytics.prototype.ready = function (callback) {
        if (callback === void 0) { callback = function (res) { return res; }; }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_a) {
                return [2 /*return*/, Promise.all(this.queue.plugins.map(function (i) { return (i.ready ? i.ready() : Promise.resolve()); })).then(function (res) {
                        callback(res);
                        return res;
                    })];
            });
        });
    };
    //   // analytics-classic api
    //   noConflict(): Analytics {
    //     console.warn(deprecationWarning)
    //     window.analytics = _analytics ?? this
    //     return this
    //   }
    //   normalize(msg: SegmentEvent): SegmentEvent {
    //     console.warn(deprecationWarning)
    //     return this.eventFactory.normalize(msg)
    //   }
    //   get failedInitializations(): string[] {
    //     console.warn(deprecationWarning)
    //     return this.queue.failedInitializations
    //   }
    //   get VERSION(): string {
    //     return version
    //   }
    /* @deprecated - noop */
    Analytics.prototype.initialize = function (_settings, _options) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, Promise, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__generator)(this, function (_a) {
                console.warn(deprecationWarning);
                return [2 /*return*/, Promise.resolve(this)];
            });
        });
    };
    return Analytics;
}(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_11__.Emitter));



/***/ }),

/***/ 6333:
/*!**********************************************!*\
  !*** ./src/core/arguments-resolver/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resolveAliasArguments": function() { return /* binding */ resolveAliasArguments; },
/* harmony export */   "resolveArguments": function() { return /* binding */ resolveArguments; },
/* harmony export */   "resolvePageArguments": function() { return /* binding */ resolvePageArguments; },
/* harmony export */   "resolveUserArguments": function() { return /* binding */ resolveUserArguments; }
/* harmony export */ });
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @segment/analytics-core */ 7595);

/**
 * Helper for the track method
 */
function resolveArguments(eventName, properties, options, callback) {
    var _a;
    var args = [eventName, properties, options, callback];
    var name = (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(eventName) ? eventName.event : eventName;
    if (!name || !(0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isString)(name)) {
        throw new Error('Event missing');
    }
    var data = (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(eventName)
        ? (_a = eventName.properties) !== null && _a !== void 0 ? _a : {}
        : (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(properties)
            ? properties
            : {};
    var opts = {};
    if (!(0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction)(options)) {
        opts = options !== null && options !== void 0 ? options : {};
    }
    if ((0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(eventName) && !(0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction)(properties)) {
        opts = properties !== null && properties !== void 0 ? properties : {};
    }
    var cb = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction);
    return [name, data, opts, cb];
}
/**
 * Helper for page, screen methods
 */
function resolvePageArguments(category, name, properties, options, callback) {
    var _a, _b;
    var resolvedCategory = null;
    var resolvedName = null;
    var args = [category, name, properties, options, callback];
    var strings = args.filter(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isString);
    if (strings[0] !== undefined && strings[1] !== undefined) {
        resolvedCategory = strings[0];
        resolvedName = strings[1];
    }
    if (strings.length === 1) {
        resolvedCategory = null;
        resolvedName = strings[0];
    }
    var resolvedCallback = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction);
    var objects = args.filter(function (obj) {
        if (resolvedName === null) {
            return (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj);
        }
        return (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj) || obj === null;
    });
    var resolvedProperties = ((_a = objects[0]) !== null && _a !== void 0 ? _a : {});
    var resolvedOptions = ((_b = objects[1]) !== null && _b !== void 0 ? _b : {});
    return [
        resolvedCategory,
        resolvedName,
        resolvedProperties,
        resolvedOptions,
        resolvedCallback,
    ];
}
/**
 * Helper for group, identify methods
 */
var resolveUserArguments = function (user) {
    return function () {
        var _a, _b, _c, _d, _e;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = null;
        id = (_c = (_a = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isString)) !== null && _a !== void 0 ? _a : (_b = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isNumber)) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : user.id();
        var objects = args.filter(function (obj) {
            if (id === null) {
                return (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj);
            }
            return (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(obj) || obj === null;
        });
        var traits = ((_d = objects[0]) !== null && _d !== void 0 ? _d : {});
        var opts = ((_e = objects[1]) !== null && _e !== void 0 ? _e : {});
        var resolvedCallback = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction);
        return [id, traits, opts, resolvedCallback];
    };
};
/**
 * Helper for alias method
 */
function resolveAliasArguments(to, from, options, callback) {
    if ((0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isNumber)(to))
        to = to.toString(); // Legacy behaviour - allow integers for alias calls
    if ((0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isNumber)(from))
        from = from.toString();
    var args = [to, from, options, callback];
    var _a = args.filter(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isString), _b = _a[0], aliasTo = _b === void 0 ? to : _b, _c = _a[1], aliasFrom = _c === void 0 ? null : _c;
    var _d = args.filter(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)[0], opts = _d === void 0 ? {} : _d;
    var resolvedCallback = args.find(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.isFunction);
    return [aliasTo, aliasFrom, opts, resolvedCallback];
}


/***/ }),

/***/ 1444:
/*!**********************************!*\
  !*** ./src/core/buffer/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnalyticsBuffered": function() { return /* binding */ AnalyticsBuffered; },
/* harmony export */   "PreInitMethodCallBuffer": function() { return /* binding */ PreInitMethodCallBuffer; },
/* harmony export */   "callAnalyticsMethod": function() { return /* binding */ callAnalyticsMethod; },
/* harmony export */   "flushAddSourceMiddleware": function() { return /* binding */ flushAddSourceMiddleware; },
/* harmony export */   "flushAnalyticsCallsInNewTask": function() { return /* binding */ flushAnalyticsCallsInNewTask; },
/* harmony export */   "flushOn": function() { return /* binding */ flushOn; },
/* harmony export */   "flushSetAnonymousID": function() { return /* binding */ flushSetAnonymousID; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_is_thenable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/is-thenable */ 8580);
/* harmony import */ var _generated_version__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../generated/version */ 4278);



var flushSyncAnalyticsCalls = function (name, analytics, buffer) {
    buffer.getCalls(name).forEach(function (c) {
        // While the underlying methods are synchronous, the callAnalyticsMethod returns a promise,
        // which normalizes success and error states between async and non-async methods, with no perf penalty.
        callAnalyticsMethod(analytics, c).catch(console.error);
    });
};
var flushAddSourceMiddleware = function (analytics, buffer) { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(void 0, void 0, void 0, function () {
    var _i, _a, c;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, _a = buffer.getCalls('addSourceMiddleware');
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                c = _a[_i];
                return [4 /*yield*/, callAnalyticsMethod(analytics, c).catch(console.error)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var flushOn = flushSyncAnalyticsCalls.bind(undefined, 'on');
var flushSetAnonymousID = flushSyncAnalyticsCalls.bind(undefined, 'setAnonymousId');
var flushAnalyticsCallsInNewTask = function (analytics, buffer) {
    buffer.toArray().forEach(function (m) {
        setTimeout(function () {
            callAnalyticsMethod(analytics, m).catch(console.error);
        }, 0);
    });
};
/**
 *  Represents any and all the buffered method calls that occurred before initialization.
 */
var PreInitMethodCallBuffer = /** @class */ (function () {
    function PreInitMethodCallBuffer() {
        this._value = {};
    }
    PreInitMethodCallBuffer.prototype.toArray = function () {
        var _a;
        return (_a = []).concat.apply(_a, Object.values(this._value));
    };
    PreInitMethodCallBuffer.prototype.getCalls = function (methodName) {
        var _a;
        return ((_a = this._value[methodName]) !== null && _a !== void 0 ? _a : []);
    };
    PreInitMethodCallBuffer.prototype.push = function () {
        var _this = this;
        var calls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            calls[_i] = arguments[_i];
        }
        calls.forEach(function (call) {
            if (_this._value[call.method]) {
                _this._value[call.method].push(call);
            }
            else {
                _this._value[call.method] = [call];
            }
        });
        return this;
    };
    PreInitMethodCallBuffer.prototype.clear = function () {
        this._value = {};
        return this;
    };
    return PreInitMethodCallBuffer;
}());

/**
 *  Call method and mark as "called"
 *  This function should never throw an error
 */
function callAnalyticsMethod(analytics, call) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
        var result, err_1;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (call.called) {
                        return [2 /*return*/, undefined];
                    }
                    call.called = true;
                    result = analytics[call.method].apply(analytics, call.args);
                    if (!(0,_lib_is_thenable__WEBPACK_IMPORTED_MODULE_1__.isThenable)(result)) return [3 /*break*/, 2];
                    // do not defer for non-async methods
                    return [4 /*yield*/, result];
                case 1:
                    // do not defer for non-async methods
                    _a.sent();
                    _a.label = 2;
                case 2:
                    call.resolve(result);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    call.reject(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var AnalyticsBuffered = /** @class */ (function () {
    function AnalyticsBuffered(loader) {
        var _this = this;
        this._preInitBuffer = new PreInitMethodCallBuffer();
        //   trackSubmit = this._createMethod('trackSubmit')
        //   trackClick = this._createMethod('trackClick')
        //   trackLink = this._createMethod('trackLink')
        //   pageView = this._createMethod('pageview')
        //   identify = this._createMethod('identify')
        //   reset = this._createMethod('reset')
        //   group = this._createMethod('group') as AnalyticsBrowserCore['group']
        //   track = this._createMethod('track')
        this.track = function () { console.log('core.buffer.not.implemented.track'); };
        //   ready = this._createMethod('ready')
        //   alias = this._createMethod('alias')
        //   debug = this._createChainableMethod('debug')
        //   page = this._createMethod('page')
        this.page = function () { console.log('core.buffer.not.implemented.page'); };
        //   once = this._createChainableMethod('once')
        //   off = this._createChainableMethod('off')
        //   on = this._createChainableMethod('on')
        //   addSourceMiddleware = this._createMethod('addSourceMiddleware')
        //   setAnonymousId = this._createMethod('setAnonymousId')
        //   addDestinationMiddleware = this._createMethod('addDestinationMiddleware')
        //   screen = this._createMethod('screen')
        //   register = this._createMethod('register')
        this.register = function () { console.log('core.buffer.not.implemented.register'); return Promise.resolve(); };
        //   deregister = this._createMethod('deregister')
        //   user = this._createMethod('user')
        this.VERSION = _generated_version__WEBPACK_IMPORTED_MODULE_2__.version;
        this._promise = loader(this._preInitBuffer);
        this._promise
            .then(function (_a) {
            var ajs = _a[0], ctx = _a[1];
            _this.instance = ajs;
            _this.ctx = ctx;
        })
            .catch(function () {
            // intentionally do nothing...
            // this result of this promise will be caught by the 'catch' block on this class.
        });
    }
    AnalyticsBuffered.prototype.then = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this._promise).then.apply(_a, args);
    };
    AnalyticsBuffered.prototype.catch = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this._promise).catch.apply(_a, args);
    };
    AnalyticsBuffered.prototype.finally = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this._promise).finally.apply(_a, args);
    };
    return AnalyticsBuffered;
}());



/***/ }),

/***/ 8461:
/*!************************************!*\
  !*** ./src/core/buffer/snippet.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "popSnippetWindowBuffer": function() { return /* binding */ popSnippetWindowBuffer; },
/* harmony export */   "transformSnippetCall": function() { return /* binding */ transformSnippetCall; }
/* harmony export */ });
function transformSnippetCall(_a) {
    var methodName = _a[0], args = _a.slice(1);
    return {
        method: methodName,
        resolve: function () { },
        reject: console.error,
        args: args,
        called: false,
    };
}
var normalizeSnippetBuffer = function (buffer) {
    return buffer.map(transformSnippetCall);
};
/**
 * Fetch the buffered method calls from the window object and normalize them.
 * This removes existing buffered calls from the window object.
 */
var popSnippetWindowBuffer = function () {
    // @ts-ignore
    var wa = window.analytics;
    if (!Array.isArray(wa))
        return [];
    var buffered = wa.splice(0, wa.length);
    // @ts-ignore
    return normalizeSnippetBuffer(buffered);
};


/***/ }),

/***/ 94:
/*!**************************************!*\
  !*** ./src/core/connection/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isOffline": function() { return /* binding */ isOffline; },
/* harmony export */   "isOnline": function() { return /* binding */ isOnline; }
/* harmony export */ });
// import { isBrowser } from '../environment'
function isOnline() {
    // if (isBrowser()) {
    return window.navigator.onLine;
    // }
    // return true
}
function isOffline() {
    return !isOnline();
}


/***/ }),

/***/ 4328:
/*!*************************************!*\
  !*** ./src/core/constants/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SEGMENT_API_HOST": function() { return /* binding */ SEGMENT_API_HOST; }
/* harmony export */ });
var SEGMENT_API_HOST = 'api.segment.io/v1';


/***/ }),

/***/ 8404:
/*!***********************************!*\
  !*** ./src/core/context/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Context": function() { return /* binding */ Context; },
/* harmony export */   "ContextCancelation": function() { return /* reexport safe */ _segment_analytics_core__WEBPACK_IMPORTED_MODULE_2__.ContextCancelation; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @segment/analytics-core */ 7920);
/* harmony import */ var _stats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../stats */ 6218);



var Context = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Context, _super);
    function Context(event, id) {
        return _super.call(this, event, id, new _stats__WEBPACK_IMPORTED_MODULE_1__.Stats()) || this;
    }
    Context.system = function () {
        return new this({ type: 'track', event: 'system' });
    };
    return Context;
}(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_2__.CoreContext));




/***/ }),

/***/ 6513:
/*!**********************************!*\
  !*** ./src/core/events/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventFactory": function() { return /* binding */ EventFactory; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lukeed/uuid */ 7831);
/* harmony import */ var dset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dset */ 380);
/* harmony import */ var spark_md5__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! spark-md5 */ 4791);
/* harmony import */ var spark_md5__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(spark_md5__WEBPACK_IMPORTED_MODULE_2__);





var EventFactory = /** @class */ (function () {
    function EventFactory(user) {
        this.user = user;
    }
    EventFactory.prototype.track = function (event, properties, options, globalIntegrations) {
        return this.normalize((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, this.baseEvent()), { event: event, type: 'track', properties: properties, options: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, options), integrations: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, globalIntegrations) }));
    };
    EventFactory.prototype.page = function (category, page, properties, options, globalIntegrations) {
        var event = {
            type: 'page',
            properties: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, properties),
            options: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, options),
            integrations: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, globalIntegrations),
        };
        if (category !== null) {
            event.category = category;
            event.properties.category = category;
        }
        if (page !== null) {
            event.name = page;
        }
        return this.normalize((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, this.baseEvent()), event));
    };
    // screen(
    //   category: string | null,
    //   screen: string | null,
    //   properties?: EventProperties,
    //   options?: Options,
    //   globalIntegrations?: Integrations
    // ): SegmentEvent {
    //   const event: Partial<SegmentEvent> = {
    //     type: 'screen' as const,
    //     properties: { ...properties },
    //     options: { ...options },
    //     integrations: { ...globalIntegrations },
    //   }
    //   if (category !== null) {
    //     event.category = category
    //   }
    //   if (screen !== null) {
    //     event.name = screen
    //   }
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     ...event,
    //   } as SegmentEvent)
    // }
    // identify(
    //   userId: ID,
    //   traits?: Traits,
    //   options?: Options,
    //   globalIntegrations?: Integrations
    // ): SegmentEvent {
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     type: 'identify' as const,
    //     userId,
    //     traits,
    //     options: { ...options },
    //     integrations: { ...globalIntegrations },
    //   })
    // }
    // group(
    //   groupId: ID,
    //   traits?: Traits,
    //   options?: Options,
    //   globalIntegrations?: Integrations
    // ): SegmentEvent {
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     type: 'group' as const,
    //     traits,
    //     options: { ...options },
    //     integrations: { ...globalIntegrations },
    //     groupId,
    //   })
    // }
    // alias(
    //   to: string,
    //   from: string | null,
    //   options?: Options,
    //   globalIntegrations?: Integrations
    // ): SegmentEvent {
    //   const base: Partial<SegmentEvent> = {
    //     userId: to,
    //     type: 'alias' as const,
    //     options: { ...options },
    //     integrations: { ...globalIntegrations },
    //   }
    //   if (from !== null) {
    //     base.previousId = from
    //   }
    //   if (to === undefined) {
    //     return this.normalize({
    //       ...base,
    //       ...this.baseEvent(),
    //     } as SegmentEvent)
    //   }
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     ...base,
    //   } as SegmentEvent)
    // }
    EventFactory.prototype.baseEvent = function () {
        var base = {
            integrations: {},
            options: {},
        };
        var user = this.user;
        if (user.id()) {
            base.userId = user.id();
        }
        if (user.anonymousId()) {
            base.anonymousId = user.anonymousId();
        }
        return base;
    };
    /**
     * Builds the context part of an event based on "foreign" keys that
     * are provided in the `Options` parameter for an Event
     */
    EventFactory.prototype.context = function (event) {
        var _a, _b, _c;
        var optionsKeys = ['integrations', 'anonymousId', 'timestamp', 'userId'];
        var options = (_a = event.options) !== null && _a !== void 0 ? _a : {};
        delete options['integrations'];
        var providedOptionsKeys = Object.keys(options);
        var context = (_c = (_b = event.options) === null || _b === void 0 ? void 0 : _b.context) !== null && _c !== void 0 ? _c : {};
        var overrides = {};
        providedOptionsKeys.forEach(function (key) {
            if (key === 'context') {
                return;
            }
            if (optionsKeys.includes(key)) {
                (0,dset__WEBPACK_IMPORTED_MODULE_1__.dset)(overrides, key, options[key]);
            }
            else {
                (0,dset__WEBPACK_IMPORTED_MODULE_1__.dset)(context, key, options[key]);
            }
        });
        return [context, overrides];
    };
    EventFactory.prototype.normalize = function (event) {
        var _a, _b, _c;
        // set anonymousId globally if we encounter an override
        //segment.com/docs/connections/sources/catalog/libraries/website/javascript/identity/#override-the-anonymous-id-using-the-options-object
        ((_a = event.options) === null || _a === void 0 ? void 0 : _a.anonymousId) &&
            this.user.anonymousId(event.options.anonymousId);
        var integrationBooleans = Object.keys((_b = event.integrations) !== null && _b !== void 0 ? _b : {}).reduce(function (integrationNames, name) {
            var _a;
            var _b;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, integrationNames), (_a = {}, _a[name] = Boolean((_b = event.integrations) === null || _b === void 0 ? void 0 : _b[name]), _a));
        }, {});
        // This is pretty trippy, but here's what's going on:
        // - a) We don't pass initial integration options as part of the event, only if they're true or false
        // - b) We do accept per integration overrides (like integrations.Amplitude.sessionId) at the event level
        // Hence the need to convert base integration options to booleans, but maintain per event integration overrides
        var allIntegrations = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, integrationBooleans), (_c = event.options) === null || _c === void 0 ? void 0 : _c.integrations);
        var _d = this.context(event), context = _d[0], overrides = _d[1];
        var options = event.options, rest = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__rest)(event, ["options"]);
        var body = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({ timestamp: new Date() }, rest), { context: context, integrations: allIntegrations }), overrides);
        var messageId = 'ajs-next-' + spark_md5__WEBPACK_IMPORTED_MODULE_2___default().hash(JSON.stringify(body) + (0,_lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__.v4)());
        var evt = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__assign)({}, body), { messageId: messageId });
        return evt;
    };
    return EventFactory;
}());



/***/ }),

/***/ 9778:
/*!*************************************!*\
  !*** ./src/core/inspector/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attachInspector": function() { return /* binding */ attachInspector; }
/* harmony export */ });
/* harmony import */ var _lib_get_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/get-global */ 3744);
var _a;
var _b;

var env = (0,_lib_get_global__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
// The code below assumes the inspector extension will use Object.assign
// to add the inspect interface on to this object reference (unless the
// extension code ran first and has already set up the variable)
var inspectorHost = ((_a = (_b = env)['__SEGMENT_INSPECTOR__']) !== null && _a !== void 0 ? _a : (_b['__SEGMENT_INSPECTOR__'] = {}));
var attachInspector = function (analytics) { var _a; return (_a = inspectorHost.attach) === null || _a === void 0 ? void 0 : _a.call(inspectorHost, analytics); };


/***/ }),

/***/ 6863:
/*!*************************************************************!*\
  !*** ./src/core/query-string/gracefulDecodeURIComponent.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gracefulDecodeURIComponent": function() { return /* binding */ gracefulDecodeURIComponent; }
/* harmony export */ });
/**
 * Tries to gets the unencoded version of an encoded component of a
 * Uniform Resource Identifier (URI). If input string is malformed,
 * returns it back as-is.
 *
 * Note: All occurences of the `+` character become ` ` (spaces).
 **/
function gracefulDecodeURIComponent(encodedURIComponent) {
    try {
        return decodeURIComponent(encodedURIComponent.replace(/\+/g, ' '));
    }
    catch (_a) {
        return encodedURIComponent;
    }
}


/***/ }),

/***/ 7112:
/*!***************************************!*\
  !*** ./src/core/queue/event-queue.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventQueue": function() { return /* binding */ EventQueue; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_priority_queue_persisted__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/priority-queue/persisted */ 3061);
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @segment/analytics-core */ 51);
/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../connection */ 94);




var EventQueue = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(EventQueue, _super);
    function EventQueue(priorityQueue) {
        return _super.call(this, priorityQueue !== null && priorityQueue !== void 0 ? priorityQueue : new _lib_priority_queue_persisted__WEBPACK_IMPORTED_MODULE_1__.PersistedPriorityQueue(4, 'event-queue')) || this;
    }
    EventQueue.prototype.flush = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                if ((0,_connection__WEBPACK_IMPORTED_MODULE_2__.isOffline)())
                    return [2 /*return*/, []];
                return [2 /*return*/, _super.prototype.flush.call(this)];
            });
        });
    };
    return EventQueue;
}(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_3__.CoreEventQueue));



/***/ }),

/***/ 6218:
/*!*********************************!*\
  !*** ./src/core/stats/index.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stats": function() { return /* binding */ Stats; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @segment/analytics-core */ 417);
/* harmony import */ var _remote_metrics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./remote-metrics */ 449);



var remoteMetrics;
var Stats = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Stats, _super);
    function Stats() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stats.initRemoteMetrics = function (options) {
        remoteMetrics = new _remote_metrics__WEBPACK_IMPORTED_MODULE_1__.RemoteMetrics(options);
    };
    Stats.prototype.increment = function (metric, by, tags) {
        _super.prototype.increment.call(this, metric, by, tags);
        remoteMetrics === null || remoteMetrics === void 0 ? void 0 : remoteMetrics.increment(metric, tags !== null && tags !== void 0 ? tags : []);
    };
    return Stats;
}(_segment_analytics_core__WEBPACK_IMPORTED_MODULE_2__.CoreStats));



/***/ }),

/***/ 449:
/*!******************************************!*\
  !*** ./src/core/stats/remote-metrics.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoteMetrics": function() { return /* binding */ RemoteMetrics; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../lib/fetch */ 7959);
/* harmony import */ var _generated_version__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../generated/version */ 4278);
/* harmony import */ var _plugins_segmentio_normalize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../plugins/segmentio/normalize */ 719);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ 4328);





var createRemoteMetric = function (metric, tags, versionType) {
    var formattedTags = tags.reduce(function (acc, t) {
        var _a = t.split(':'), k = _a[0], v = _a[1];
        acc[k] = v;
        return acc;
    }, {});
    return {
        type: 'Counter',
        metric: metric,
        value: 1,
        tags: (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, formattedTags), { library: 'analytics.js', library_version: versionType === 'web' ? "next-".concat(_generated_version__WEBPACK_IMPORTED_MODULE_1__.version) : "npm:next-".concat(_generated_version__WEBPACK_IMPORTED_MODULE_1__.version) }),
    };
};
function logError(err) {
    console.error('Error sending segment performance metrics', err);
}
var RemoteMetrics = /** @class */ (function () {
    function RemoteMetrics(options) {
        var _this = this;
        var _a, _b, _c, _d;
        this.host = (_a = options === null || options === void 0 ? void 0 : options.host) !== null && _a !== void 0 ? _a : _constants__WEBPACK_IMPORTED_MODULE_2__.SEGMENT_API_HOST;
        this.sampleRate = (_b = options === null || options === void 0 ? void 0 : options.sampleRate) !== null && _b !== void 0 ? _b : 1;
        this.flushTimer = (_c = options === null || options === void 0 ? void 0 : options.flushTimer) !== null && _c !== void 0 ? _c : 30 * 1000; /* 30s */
        this.maxQueueSize = (_d = options === null || options === void 0 ? void 0 : options.maxQueueSize) !== null && _d !== void 0 ? _d : 20;
        this.queue = [];
        if (this.sampleRate > 0) {
            var flushing_1 = false;
            var run_1 = function () {
                if (flushing_1) {
                    return;
                }
                flushing_1 = true;
                _this.flush().catch(logError);
                flushing_1 = false;
                setTimeout(run_1, _this.flushTimer);
            };
            run_1();
        }
    }
    RemoteMetrics.prototype.increment = function (metric, tags) {
        // All metrics are part of an allow list in Tracking API
        if (!metric.includes('analytics_js.')) {
            return;
        }
        // /m doesn't like empty tags
        if (tags.length === 0) {
            return;
        }
        if (Math.random() > this.sampleRate) {
            return;
        }
        if (this.queue.length >= this.maxQueueSize) {
            return;
        }
        var remoteMetric = createRemoteMetric(metric, tags, (0,_plugins_segmentio_normalize__WEBPACK_IMPORTED_MODULE_3__.getVersionType)());
        this.queue.push(remoteMetric);
        if (metric.includes('error')) {
            this.flush().catch(logError);
        }
    };
    RemoteMetrics.prototype.flush = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queue.length <= 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.send().catch(function (error) {
                                logError(error);
                                _this.sampleRate = 0;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RemoteMetrics.prototype.send = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
            var payload, headers, url;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                payload = { series: this.queue };
                this.queue = [];
                headers = { 'Content-Type': 'text/plain' };
                url = "https://".concat(this.host, "/m");
                return [2 /*return*/, (0,_lib_fetch__WEBPACK_IMPORTED_MODULE_4__.fetch)(url, {
                        headers: headers,
                        body: JSON.stringify(payload),
                        method: 'POST',
                    })];
            });
        });
    };
    return RemoteMetrics;
}());



/***/ }),

/***/ 8166:
/*!********************************!*\
  !*** ./src/core/user/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cookie": function() { return /* binding */ Cookie; },
/* harmony export */   "Group": function() { return /* binding */ Group; },
/* harmony export */   "LocalStorage": function() { return /* binding */ LocalStorage; },
/* harmony export */   "UniversalStorage": function() { return /* binding */ UniversalStorage; },
/* harmony export */   "User": function() { return /* binding */ User; },
/* harmony export */   "getAvailableStorageOptions": function() { return /* binding */ getAvailableStorageOptions; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lukeed/uuid */ 7831);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-cookie */ 1805);
/* harmony import */ var _tld__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tld */ 1268);
/* harmony import */ var _lib_bind_all__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../lib/bind-all */ 8232);





var defaults = {
    persist: true,
    cookie: {
        key: 'ajs_user_id',
        oldKey: 'ajs_user',
    },
    localStorage: {
        key: 'ajs_user_traits',
    },
};
var Store = /** @class */ (function () {
    function Store() {
        this.cache = {};
    }
    Store.prototype.get = function (key) {
        return this.cache[key];
    };
    Store.prototype.set = function (key, value) {
        this.cache[key] = value;
    };
    Store.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Object.defineProperty(Store.prototype, "type", {
        get: function () {
            return 'memory';
        },
        enumerable: false,
        configurable: true
    });
    return Store;
}());
var ONE_YEAR = 365;
var Cookie = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__extends)(Cookie, _super);
    function Cookie(options) {
        if (options === void 0) { options = Cookie.defaults; }
        var _this = _super.call(this) || this;
        _this.options = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, Cookie.defaults), options);
        return _this;
    }
    Cookie.available = function () {
        var cookieEnabled = window.navigator.cookieEnabled;
        if (!cookieEnabled) {
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set('ajs:cookies', 'test');
            cookieEnabled = document.cookie.includes('ajs:cookies');
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove('ajs:cookies');
        }
        return cookieEnabled;
    };
    Object.defineProperty(Cookie, "defaults", {
        get: function () {
            return {
                maxage: ONE_YEAR,
                domain: (0,_tld__WEBPACK_IMPORTED_MODULE_3__.tld)(window.location.href),
                path: '/',
                sameSite: 'Lax',
            };
        },
        enumerable: false,
        configurable: true
    });
    Cookie.prototype.opts = function () {
        return {
            sameSite: this.options.sameSite,
            expires: this.options.maxage,
            domain: this.options.domain,
            path: this.options.path,
            secure: this.options.secure,
        };
    };
    Cookie.prototype.get = function (key) {
        try {
            var value = js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].get(key);
            if (!value) {
                return null;
            }
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        }
        catch (e) {
            return null;
        }
    };
    Cookie.prototype.set = function (key, value) {
        if (typeof value === 'string') {
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set(key, value, this.opts());
        }
        else if (value === null) {
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove(key, this.opts());
        }
        else {
            js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].set(key, JSON.stringify(value), this.opts());
        }
    };
    Cookie.prototype.remove = function (key) {
        return js_cookie__WEBPACK_IMPORTED_MODULE_1__["default"].remove(key, this.opts());
    };
    Object.defineProperty(Cookie.prototype, "type", {
        get: function () {
            return 'cookie';
        },
        enumerable: false,
        configurable: true
    });
    return Cookie;
}(Store));

var localStorageWarning = function (key, state) {
    console.warn("Unable to access ".concat(key, ", localStorage may be ").concat(state));
};
var LocalStorage = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__extends)(LocalStorage, _super);
    function LocalStorage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalStorage.available = function () {
        var test = 'test';
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    LocalStorage.prototype.get = function (key) {
        try {
            var val = localStorage.getItem(key);
            if (val === null) {
                return null;
            }
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        }
        catch (err) {
            localStorageWarning(key, 'unavailable');
            return null;
        }
    };
    LocalStorage.prototype.set = function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (_a) {
            localStorageWarning(key, 'full');
        }
    };
    LocalStorage.prototype.remove = function (key) {
        try {
            return localStorage.removeItem(key);
        }
        catch (err) {
            localStorageWarning(key, 'unavailable');
        }
    };
    Object.defineProperty(LocalStorage.prototype, "type", {
        get: function () {
            return 'localStorage';
        },
        enumerable: false,
        configurable: true
    });
    return LocalStorage;
}(Store));

var UniversalStorage = /** @class */ (function () {
    function UniversalStorage(stores, storageOptions) {
        this.storageOptions = storageOptions;
        this.enabledStores = stores;
    }
    UniversalStorage.prototype.getStores = function (storeTypes) {
        var _this = this;
        var stores = [];
        this.enabledStores
            .filter(function (i) { return !storeTypes || (storeTypes === null || storeTypes === void 0 ? void 0 : storeTypes.includes(i)); })
            .forEach(function (storeType) {
            var storage = _this.storageOptions[storeType];
            if (storage !== undefined) {
                stores.push(storage);
            }
        });
        return stores;
    };
    /*
      This is to support few scenarios where:
      - value exist in one of the stores ( as a result of other stores being cleared from browser ) and we want to resync them
      - read values in AJS 1.0 format ( for customers after 1.0 --> 2.0 migration ) and then re-write them in AJS 2.0 format
    */
    /**
     * get value for the key from the stores. it will pick the first value found in the stores, and then sync the value to all the stores
     * if the found value is a number, it will be converted to a string. this is to support legacy behavior that existed in AJS 1.0
     * @param key key for the value to be retrieved
     * @param storeTypes optional array of store types to be used for performing get and sync
     * @returns value for the key or null if not found
     */
    UniversalStorage.prototype.getAndSync = function (key, storeTypes) {
        var val = this.get(key, storeTypes);
        // legacy behavior, getAndSync can change the type of a value from number to string (AJS 1.0 stores numerical values as a number)
        var coercedValue = (typeof val === 'number' ? val.toString() : val);
        this.set(key, coercedValue, storeTypes);
        return coercedValue;
    };
    /**
     * get value for the key from the stores. it will return the first value found in the stores
     * @param key key for the value to be retrieved
     * @param storeTypes optional array of store types to be used for retrieving the value
     * @returns value for the key or null if not found
     */
    UniversalStorage.prototype.get = function (key, storeTypes) {
        var val = null;
        for (var _i = 0, _a = this.getStores(storeTypes); _i < _a.length; _i++) {
            var store = _a[_i];
            val = store.get(key);
            if (val) {
                return val;
            }
        }
        return null;
    };
    /**
     * it will set the value for the key in all the stores
     * @param key key for the value to be stored
     * @param value value to be stored
     * @param storeTypes optional array of store types to be used for storing the value
     * @returns value that was stored
     */
    UniversalStorage.prototype.set = function (key, value, storeTypes) {
        for (var _i = 0, _a = this.getStores(storeTypes); _i < _a.length; _i++) {
            var store = _a[_i];
            store.set(key, value);
        }
    };
    /**
     * remove the value for the key from all the stores
     * @param key key for the value to be removed
     * @param storeTypes optional array of store types to be used for removing the value
     */
    UniversalStorage.prototype.clear = function (key, storeTypes) {
        for (var _i = 0, _a = this.getStores(storeTypes); _i < _a.length; _i++) {
            var store = _a[_i];
            store.remove(key);
        }
    };
    return UniversalStorage;
}());

function getAvailableStorageOptions(cookieOptions) {
    return {
        cookie: Cookie.available() ? new Cookie(cookieOptions) : undefined,
        localStorage: LocalStorage.available() ? new LocalStorage() : undefined,
        memory: new Store(),
    };
}
var User = /** @class */ (function () {
    function User(options, cookieOptions) {
        if (options === void 0) { options = defaults; }
        var _this = this;
        var _a, _b, _c, _d;
        this.options = {};
        this.id = function (id) {
            if (_this.options.disable) {
                return null;
            }
            var prevId = _this.identityStore.getAndSync(_this.idKey);
            if (id !== undefined) {
                _this.identityStore.set(_this.idKey, id);
                var changingIdentity = id !== prevId && prevId !== null && id !== null;
                if (changingIdentity) {
                    _this.anonymousId(null);
                }
            }
            var retId = _this.identityStore.getAndSync(_this.idKey);
            if (retId)
                return retId;
            var retLeg = _this.legacyUserStore.get(defaults.cookie.oldKey);
            return retLeg ? (typeof retLeg === 'object' ? retLeg.id : retLeg) : null;
        };
        // private legacySIO(): [string, string] | null {
        //   const val = this.legacyUserStore.get('_sio') as string
        //   if (!val) {
        //     return null
        //   }
        //   const [anon, user] = val.split('----')
        //   return [anon, user]
        // }
        this.anonymousId = function (id) {
            if (_this.options.disable) {
                return null;
            }
            if (id === undefined) {
                // const val =
                //   this.identityStore.getAndSync(this.anonKey) ?? this.legacySIO()?.[0]
                var val = _this.identityStore.getAndSync(_this.anonKey);
                if (val) {
                    return val;
                }
            }
            if (id === null) {
                _this.identityStore.set(_this.anonKey, null);
                return _this.identityStore.getAndSync(_this.anonKey);
            }
            _this.identityStore.set(_this.anonKey, id !== null && id !== void 0 ? id : (0,_lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__.v4)());
            return _this.identityStore.getAndSync(_this.anonKey);
        };
        this.traits = function (traits) {
            var _a;
            if (_this.options.disable) {
                return;
            }
            if (traits === null) {
                traits = {};
            }
            if (traits) {
                _this.traitsStore.set(_this.traitsKey, traits !== null && traits !== void 0 ? traits : {});
            }
            return (_a = _this.traitsStore.get(_this.traitsKey)) !== null && _a !== void 0 ? _a : {};
        };
        this.options = options;
        this.cookieOptions = cookieOptions;
        this.idKey = (_b = (_a = options.cookie) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : defaults.cookie.key;
        this.traitsKey = (_d = (_c = options.localStorage) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : defaults.localStorage.key;
        this.anonKey = 'ajs_anonymous_id';
        var isDisabled = options.disable === true;
        var shouldPersist = options.persist !== false;
        var defaultStorageTargets = isDisabled
            ? []
            : shouldPersist
                ? ['localStorage', 'cookie', 'memory']
                : ['memory'];
        var storageOptions = getAvailableStorageOptions(cookieOptions);
        if (options.localStorageFallbackDisabled) {
            defaultStorageTargets = defaultStorageTargets.filter(function (t) { return t !== 'localStorage'; });
        }
        this.identityStore = new UniversalStorage(defaultStorageTargets, storageOptions);
        // using only cookies for legacy user store
        this.legacyUserStore = new UniversalStorage(defaultStorageTargets.filter(function (t) { return t !== 'localStorage' && t !== 'memory'; }), storageOptions);
        // using only localStorage / memory for traits store
        this.traitsStore = new UniversalStorage(defaultStorageTargets.filter(function (t) { return t !== 'cookie'; }), storageOptions);
        var legacyUser = this.legacyUserStore.get(defaults.cookie.oldKey);
        if (legacyUser && typeof legacyUser === 'object') {
            legacyUser.id && this.id(legacyUser.id);
            legacyUser.traits && this.traits(legacyUser.traits);
        }
        (0,_lib_bind_all__WEBPACK_IMPORTED_MODULE_4__["default"])(this);
    }
    User.prototype.identify = function (id, traits) {
        if (this.options.disable) {
            return;
        }
        traits = traits !== null && traits !== void 0 ? traits : {};
        var currentId = this.id();
        if (currentId === null || currentId === id) {
            traits = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, this.traits()), traits);
        }
        if (id) {
            this.id(id);
        }
        this.traits(traits);
    };
    User.prototype.logout = function () {
        this.anonymousId(null);
        this.id(null);
        this.traits({});
    };
    User.prototype.reset = function () {
        this.logout();
        this.identityStore.clear(this.idKey);
        this.identityStore.clear(this.anonKey);
        this.traitsStore.clear(this.traitsKey);
    };
    User.prototype.load = function () {
        return new User(this.options, this.cookieOptions);
    };
    User.prototype.save = function () {
        return true;
    };
    User.defaults = defaults;
    return User;
}());

var groupDefaults = {
    persist: true,
    cookie: {
        key: 'ajs_group_id',
    },
    localStorage: {
        key: 'ajs_group_properties',
    },
};
var Group = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__extends)(Group, _super);
    function Group(options, cookie) {
        if (options === void 0) { options = groupDefaults; }
        var _this = _super.call(this, options, cookie) || this;
        _this.anonymousId = function (_id) {
            return undefined;
        };
        (0,_lib_bind_all__WEBPACK_IMPORTED_MODULE_4__["default"])(_this);
        return _this;
    }
    return Group;
}(User));



/***/ }),

/***/ 1268:
/*!******************************!*\
  !*** ./src/core/user/tld.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tld": function() { return /* binding */ tld; }
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ 1805);

/**
 * Levels returns all levels of the given url.
 *
 * @param {string} url
 * @return {Array}
 * @api public
 */
function levels(url) {
    var host = url.hostname;
    var parts = host.split('.');
    var last = parts[parts.length - 1];
    var levels = [];
    // Ip address.
    if (parts.length === 4 && parseInt(last, 10) > 0) {
        return levels;
    }
    // Localhost.
    if (parts.length <= 1) {
        return levels;
    }
    // Create levels.
    for (var i = parts.length - 2; i >= 0; --i) {
        levels.push(parts.slice(i).join('.'));
    }
    return levels;
}
function parseUrl(url) {
    try {
        return new URL(url);
    }
    catch (_a) {
        return;
    }
}
function tld(url) {
    var parsedUrl = parseUrl(url);
    if (!parsedUrl)
        return;
    var lvls = levels(parsedUrl);
    // Lookup the real top level one.
    for (var i = 0; i < lvls.length; ++i) {
        var cname = '__tld__';
        var domain = lvls[i];
        var opts = { domain: '.' + domain };
        try {
            // cookie access throw an error if the library is ran inside a sandboxed environment (e.g. sandboxed iframe)
            js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set(cname, '1', opts);
            if (js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get(cname)) {
                js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].remove(cname, opts);
                return domain;
            }
        }
        catch (_) {
            return;
        }
    }
}


/***/ }),

/***/ 4278:
/*!**********************************!*\
  !*** ./src/generated/version.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": function() { return /* binding */ version; }
/* harmony export */ });
// This file is generated.
var version = '1.51.7';


/***/ }),

/***/ 8232:
/*!*****************************!*\
  !*** ./src/lib/bind-all.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ bindAll; }
/* harmony export */ });
function bindAll(obj) {
    var proto = obj.constructor.prototype;
    for (var _i = 0, _a = Object.getOwnPropertyNames(proto); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key !== 'constructor') {
            var desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key);
            if (!!desc && typeof desc.value === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    }
    return obj;
}


/***/ }),

/***/ 6022:
/*!************************************!*\
  !*** ./src/lib/create-deferred.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createDeferred": function() { return /* binding */ createDeferred; }
/* harmony export */ });
/**
 * Return a promise that can be externally resolved
 */
var createDeferred = function () {
    var resolve;
    var reject;
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise,
    };
};


/***/ }),

/***/ 7959:
/*!**************************!*\
  !*** ./src/lib/fetch.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetch": function() { return /* binding */ fetch; }
/* harmony export */ });
/* harmony import */ var unfetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! unfetch */ 3721);
/* harmony import */ var _get_global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-global */ 3744);


/**
 * Wrapper around native `fetch` containing `unfetch` fallback.
 */
var fetch = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var global = (0,_get_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    return ((global && global.fetch) || unfetch__WEBPACK_IMPORTED_MODULE_0__["default"]).apply(void 0, args);
};


/***/ }),

/***/ 3744:
/*!*******************************!*\
  !*** ./src/lib/get-global.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobal": function() { return /* binding */ getGlobal; }
/* harmony export */ });
// This an imperfect polyfill for globalThis
var getGlobal = function () {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    return null;
};


/***/ }),

/***/ 8580:
/*!********************************!*\
  !*** ./src/lib/is-thenable.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isThenable": function() { return /* binding */ isThenable; }
/* harmony export */ });
/**
 *  Check if  thenable
 *  (instanceof Promise doesn't respect realms)
 */
var isThenable = function (value) {
    return typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof value.then === 'function';
};


/***/ }),

/***/ 7070:
/*!********************************!*\
  !*** ./src/lib/load-script.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadScript": function() { return /* binding */ loadScript; },
/* harmony export */   "unloadScript": function() { return /* binding */ unloadScript; }
/* harmony export */ });
function findScript(src) {
    var scripts = Array.prototype.slice.call(window.document.querySelectorAll('script'));
    return scripts.find(function (s) { return s.src === src; });
}
function loadScript(src, attributes) {
    var found = findScript(src);
    if (found !== undefined) {
        var status = found === null || found === void 0 ? void 0 : found.getAttribute('status');
        if (status === 'loaded') {
            return Promise.resolve(found);
        }
        if (status === 'loading') {
            return new Promise(function (resolve, reject) {
                found.addEventListener('load', function () { return resolve(found); });
                found.addEventListener('error', function (err) { return reject(err); });
            });
        }
    }
    return new Promise(function (resolve, reject) {
        var _a;
        var script = window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.setAttribute('status', 'loading');
        for (var _i = 0, _b = Object.entries(attributes !== null && attributes !== void 0 ? attributes : {}); _i < _b.length; _i++) {
            var _c = _b[_i], k = _c[0], v = _c[1];
            script.setAttribute(k, v);
        }
        script.onload = function () {
            script.onerror = script.onload = null;
            script.setAttribute('status', 'loaded');
            resolve(script);
        };
        script.onerror = function () {
            script.onerror = script.onload = null;
            script.setAttribute('status', 'error');
            reject(new Error("Failed to load ".concat(src)));
        };
        var tag = window.document.getElementsByTagName('script')[0];
        (_a = tag.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(script, tag);
    });
}
function unloadScript(src) {
    var found = findScript(src);
    if (found !== undefined) {
        found.remove();
    }
    return Promise.resolve();
}


/***/ }),

/***/ 5944:
/*!***********************************!*\
  !*** ./src/lib/merged-options.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mergedOptions": function() { return /* binding */ mergedOptions; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

/**
 * Merge legacy settings and initialized Integration option overrides.
 *
 * This will merge any options that were passed from initialization into
 * overrides for settings that are returned by the Segment CDN.
 *
 * i.e. this allows for passing options directly into destinations from
 * the Analytics constructor.
 */
function mergedOptions(settings, options) {
    var _a;
    var optionOverrides = Object.entries((_a = options.integrations) !== null && _a !== void 0 ? _a : {}).reduce(function (overrides, _a) {
        var _b, _c;
        var integration = _a[0], options = _a[1];
        if (typeof options === 'object') {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, overrides), (_b = {}, _b[integration] = options, _b));
        }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, overrides), (_c = {}, _c[integration] = {}, _c));
    }, {});
    return Object.entries(settings.integrations).reduce(function (integrationSettings, _a) {
        var _b;
        var integration = _a[0], settings = _a[1];
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, integrationSettings), (_b = {}, _b[integration] = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, settings), optionOverrides[integration]), _b));
    }, {});
}


/***/ }),

/***/ 7566:
/*!******************************!*\
  !*** ./src/lib/parse-cdn.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCDN": function() { return /* binding */ getCDN; },
/* harmony export */   "setGlobalCDNUrl": function() { return /* binding */ setGlobalCDNUrl; }
/* harmony export */ });
// import { embeddedWriteKey } from './embedded-write-key'
// const analyticsScriptRegex =
//   /(https:\/\/.*)\/analytics\.js\/v1\/(?:.*?)\/(?:platform|analytics.*)?/
// const getCDNUrlFromScriptTag = (): string | undefined => {
//   let cdn: string | undefined
//   const scripts = Array.prototype.slice.call(
//     document.querySelectorAll('script')
//   )
//   scripts.forEach((s) => {
//     const src = s.getAttribute('src') ?? ''
//     const result = analyticsScriptRegex.exec(src)
//     if (result && result[1]) {
//       cdn = result[1]
//     }
//   })
//   return cdn
// }
var _globalCDN; // set globalCDN as in-memory singleton
var getGlobalCDNUrl = function () {
    var _a;
    var result = _globalCDN !== null && _globalCDN !== void 0 ? _globalCDN : (_a = window.analytics) === null || _a === void 0 ? void 0 : _a._cdn;
    return result;
};
var setGlobalCDNUrl = function (cdn) {
    if (window.analytics) {
        window.analytics._cdn = cdn;
    }
    _globalCDN = cdn;
};
var getCDN = function () {
    var globalCdnUrl = getGlobalCDNUrl();
    if (globalCdnUrl)
        return globalCdnUrl;
    // const cdnFromScriptTag = getCDNUrlFromScriptTag()
    // if (cdnFromScriptTag) {
    //   return cdnFromScriptTag
    // } else {
    // it's possible that the CDN is not found in the page because:
    // - the script is loaded through a proxy
    // - the script is removed after execution
    // in this case, we fall back to the default Segment CDN
    return "https://cdn.segment.com";
    // }
};
// export const getNextIntegrationsURL = () => {
//   const cdn = getCDN()
//   return `${cdn}/next-integrations`
// }
// /**
//  * Replaces the CDN URL in the script tag with the one from Analytics.js 1.0
//  *
//  * @returns the path to Analytics JS 1.0
//  **/
// export function getLegacyAJSPath(): string {
//   const writeKey = embeddedWriteKey() ?? window.analytics._writeKey
//   const scripts = Array.prototype.slice.call(
//     document.querySelectorAll('script')
//   )
//   let path: string | undefined = undefined
//   for (const s of scripts) {
//     const src = s.getAttribute('src') ?? ''
//     const result = analyticsScriptRegex.exec(src)
//     if (result && result[1]) {
//       path = src
//       break
//     }
//   }
//   if (path) {
//     return path.replace('analytics.min.js', 'analytics.classic.js')
//   }
//   return `https://cdn.segment.com/analytics.js/v1/${writeKey}/analytics.classic.js`
// }


/***/ }),

/***/ 2748:
/*!*************************!*\
  !*** ./src/lib/pick.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pick": function() { return /* binding */ pick; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

/**
 * @example
 * pick({ 'a': 1, 'b': '2', 'c': 3 }, ['a', 'c'])
 * => { 'a': 1, 'c': 3 }
 */
var pick = function (object, keys) {
    return Object.assign.apply(Object, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([{}], keys.map(function (key) {
        var _a;
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            return _a = {}, _a[key] = object[key], _a;
        }
    }), false));
};


/***/ }),

/***/ 3061:
/*!*********************************************!*\
  !*** ./src/lib/priority-queue/persisted.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PersistedPriorityQueue": function() { return /* binding */ PersistedPriorityQueue; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! . */ 3874);
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/context */ 8404);



// import { isBrowser } from '../../core/environment'
var loc = {
    getItem: function () { },
    setItem: function () { },
    removeItem: function () { },
};
try {
    loc = /* isBrowser() && */ window.localStorage ? window.localStorage : loc;
}
catch (err) {
    console.warn('Unable to access localStorage', err);
}
function persisted(key) {
    var items = loc.getItem(key);
    return (items ? JSON.parse(items) : []).map(function (p) { return new _core_context__WEBPACK_IMPORTED_MODULE_0__.Context(p.event, p.id); });
}
function persistItems(key, items) {
    var existing = persisted(key);
    var all = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], items, true), existing, true);
    var merged = all.reduce(function (acc, item) {
        var _a;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, acc), (_a = {}, _a[item.id] = item, _a));
    }, {});
    loc.setItem(key, JSON.stringify(Object.values(merged)));
}
function seen(key) {
    var stored = loc.getItem(key);
    return stored ? JSON.parse(stored) : {};
}
function persistSeen(key, memory) {
    var stored = seen(key);
    loc.setItem(key, JSON.stringify((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, stored), memory)));
}
function remove(key) {
    loc.removeItem(key);
}
var now = function () { return new Date().getTime(); };
function mutex(key, onUnlock, attempt) {
    if (attempt === void 0) { attempt = 0; }
    var lockTimeout = 50;
    var lockKey = "persisted-queue:v1:".concat(key, ":lock");
    var expired = function (lock) { return new Date().getTime() > lock; };
    var rawLock = loc.getItem(lockKey);
    var lock = rawLock ? JSON.parse(rawLock) : null;
    var allowed = lock === null || expired(lock);
    if (allowed) {
        loc.setItem(lockKey, JSON.stringify(now() + lockTimeout));
        onUnlock();
        loc.removeItem(lockKey);
        return;
    }
    if (!allowed && attempt < 3) {
        setTimeout(function () {
            mutex(key, onUnlock, attempt + 1);
        }, lockTimeout);
    }
    else {
        console.error('Unable to retrieve lock');
    }
}
var PersistedPriorityQueue = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__extends)(PersistedPriorityQueue, _super);
    function PersistedPriorityQueue(maxAttempts, key) {
        var _this = _super.call(this, maxAttempts, []) || this;
        var itemsKey = "persisted-queue:v1:".concat(key, ":items");
        var seenKey = "persisted-queue:v1:".concat(key, ":seen");
        var saved = [];
        var lastSeen = {};
        mutex(key, function () {
            try {
                saved = persisted(itemsKey);
                lastSeen = seen(seenKey);
                remove(itemsKey);
                remove(seenKey);
                _this.queue = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], saved, true), _this.queue, true);
                _this.seen = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, lastSeen), _this.seen);
            }
            catch (err) {
                console.error(err);
            }
        });
        window.addEventListener('pagehide', function () {
            // we deliberately want to use the less powerful 'pagehide' API to only persist on events where the analytics instance gets destroyed, and not on tab away.
            if (_this.todo > 0) {
                var items_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], _this.queue, true), _this.future, true);
                try {
                    mutex(key, function () {
                        persistItems(itemsKey, items_1);
                        persistSeen(seenKey, _this.seen);
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
        return _this;
    }
    return PersistedPriorityQueue;
}(___WEBPACK_IMPORTED_MODULE_2__.PriorityQueue));



/***/ }),

/***/ 9950:
/*!******************************!*\
  !*** ./src/lib/to-facade.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toFacade": function() { return /* binding */ toFacade; }
/* harmony export */ });
/* harmony import */ var _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @head.js/analytics.js-facade */ 6445);
/* harmony import */ var _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__);

function toFacade(evt, options) {
    var fcd = new _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__.Facade(evt, options);
    if (evt.type === 'track') {
        fcd = new _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__.Track(evt, options);
    }
    if (evt.type === 'identify') {
        fcd = new _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__.Identify(evt, options);
    }
    if (evt.type === 'page') {
        fcd = new _head_js_analytics_js_facade__WEBPACK_IMPORTED_MODULE_0__.Page(evt, options);
    }
    // if (evt.type === 'alias') {
    //   fcd = new Alias(evt, options)
    // }
    // if (evt.type === 'group') {
    //   fcd = new Group(evt, options)
    // }
    // if (evt.type === 'screen') {
    //   fcd = new Screen(evt, options)
    // }
    Object.defineProperty(fcd, 'obj', {
        value: evt,
        writable: true,
    });
    return fcd;
}


/***/ }),

/***/ 6338:
/*!*****************************************!*\
  !*** ./src/plugins/middleware/index.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyDestinationMiddleware": function() { return /* binding */ applyDestinationMiddleware; },
/* harmony export */   "sourceMiddlewarePlugin": function() { return /* binding */ sourceMiddlewarePlugin; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/context */ 7920);
/* harmony import */ var _lib_to_facade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/to-facade */ 9950);



function applyDestinationMiddleware(destination, evt, middleware) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
        function applyMiddleware(event, fn) {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
                var nextCalled, returnedEvent;
                var _a;
                return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            nextCalled = false;
                            returnedEvent = null;
                            return [4 /*yield*/, fn({
                                    payload: (0,_lib_to_facade__WEBPACK_IMPORTED_MODULE_1__.toFacade)(event, {
                                        clone: true,
                                        traverse: false,
                                    }),
                                    integration: destination,
                                    next: function (evt) {
                                        nextCalled = true;
                                        if (evt === null) {
                                            returnedEvent = null;
                                        }
                                        if (evt) {
                                            returnedEvent = evt.obj;
                                        }
                                    },
                                })];
                        case 1:
                            _b.sent();
                            if (!nextCalled && returnedEvent !== null) {
                                returnedEvent = returnedEvent;
                                returnedEvent.integrations = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, event.integrations), (_a = {}, _a[destination] = false, _a));
                            }
                            return [2 /*return*/, returnedEvent];
                    }
                });
            });
        }
        var modifiedEvent, _i, middleware_1, md, result;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    modifiedEvent = (0,_lib_to_facade__WEBPACK_IMPORTED_MODULE_1__.toFacade)(evt, {
                        clone: true,
                        traverse: false,
                    }).rawEvent();
                    _i = 0, middleware_1 = middleware;
                    _a.label = 1;
                case 1:
                    if (!(_i < middleware_1.length)) return [3 /*break*/, 4];
                    md = middleware_1[_i];
                    return [4 /*yield*/, applyMiddleware(modifiedEvent, md)];
                case 2:
                    result = _a.sent();
                    if (result === null) {
                        return [2 /*return*/, null];
                    }
                    modifiedEvent = result;
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, modifiedEvent];
            }
        });
    });
}
function sourceMiddlewarePlugin(fn, integrations) {
    function apply(ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
            var nextCalled;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextCalled = false;
                        return [4 /*yield*/, fn({
                                payload: (0,_lib_to_facade__WEBPACK_IMPORTED_MODULE_1__.toFacade)(ctx.event, {
                                    clone: true,
                                    traverse: false,
                                }),
                                integrations: integrations !== null && integrations !== void 0 ? integrations : {},
                                next: function (evt) {
                                    nextCalled = true;
                                    if (evt) {
                                        ctx.event = evt.obj;
                                    }
                                },
                            })];
                    case 1:
                        _a.sent();
                        if (!nextCalled) {
                            throw new _core_context__WEBPACK_IMPORTED_MODULE_2__.ContextCancelation({
                                retry: false,
                                type: 'middleware_cancellation',
                                reason: 'Middleware `next` function skipped',
                            });
                        }
                        return [2 /*return*/, ctx];
                }
            });
        });
    }
    return {
        name: "Source Middleware ".concat(fn.name),
        type: 'before',
        version: '0.1.0',
        isLoaded: function () { return true; },
        load: function (ctx) { return Promise.resolve(ctx); },
        track: apply,
        page: apply,
        identify: apply,
        // alias: apply,
        // group: apply,
    };
}


/***/ }),

/***/ 9603:
/*!**********************************************!*\
  !*** ./src/plugins/page-enrichment/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canonicalUrl": function() { return /* binding */ canonicalUrl; },
/* harmony export */   "pageDefaults": function() { return /* binding */ pageDefaults; },
/* harmony export */   "pageEnrichment": function() { return /* binding */ pageEnrichment; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/pick */ 2748);


/**
 * Get the current page's canonical URL.
 */
function canonical() {
    var canon = document.querySelector("link[rel='canonical']");
    if (canon) {
        return canon.getAttribute('href') || undefined;
    }
}
/**
 * Return the canonical path for the page.
 */
function canonicalPath() {
    var canon = canonical();
    if (!canon) {
        return window.location.pathname;
    }
    var a = document.createElement('a');
    a.href = canon;
    var pathname = !a.pathname.startsWith('/') ? '/' + a.pathname : a.pathname;
    return pathname;
}
/**
 * Return the canonical URL for the page concat the given `search`
 * and strip the hash.
 */
function canonicalUrl(search) {
    if (search === void 0) { search = ''; }
    var canon = canonical();
    if (canon) {
        return canon.includes('?') ? canon : "".concat(canon).concat(search);
    }
    var url = window.location.href;
    var i = url.indexOf('#');
    return i === -1 ? url : url.slice(0, i);
}
/**
 * Return a default `options.context.page` object.
 *
 * https://segment.com/docs/spec/page/#properties
 */
function pageDefaults() {
    return {
        path: canonicalPath(),
        referrer: document.referrer,
        search: location.search,
        title: document.title,
        url: canonicalUrl(location.search),
    };
}
function enrichPageContext(ctx) {
    var event = ctx.event;
    event.context = event.context || {};
    var defaultPageContext = pageDefaults();
    var pageContextFromEventProps = event.properties && (0,_lib_pick__WEBPACK_IMPORTED_MODULE_0__.pick)(event.properties, Object.keys(defaultPageContext));
    event.context.page = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, defaultPageContext), pageContextFromEventProps), event.context.page);
    if (event.type === 'page') {
        event.properties = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, defaultPageContext), event.properties), (event.name ? { name: event.name } : {}));
    }
    return ctx;
}
var pageEnrichment = {
    name: 'Page Enrichment',
    version: '0.1.0',
    isLoaded: function () { return true; },
    load: function () { return Promise.resolve(); },
    type: 'before',
    page: enrichPageContext,
    // alias: enrichPageContext,
    track: enrichPageContext,
    identify: enrichPageContext,
    // group: enrichPageContext,
};


/***/ }),

/***/ 3208:
/*!********************************************!*\
  !*** ./src/plugins/remote-loader/index.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionDestination": function() { return /* binding */ ActionDestination; },
/* harmony export */   "remoteLoader": function() { return /* binding */ remoteLoader; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _lib_load_script__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../lib/load-script */ 7070);
/* harmony import */ var _lib_parse_cdn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../lib/parse-cdn */ 7566);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../middleware */ 6338);
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/context */ 7920);
/* harmony import */ var _core_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/context */ 8404);





var ActionDestination = /** @class */ (function () {
    function ActionDestination(name, action) {
        this.version = '1.0.0';
        this.alternativeNames = [];
        this.middleware = [];
        // alias = this._createMethod('alias')
        // group = this._createMethod('group')
        this.identify = this._createMethod('identify');
        this.page = this._createMethod('page');
        // screen = this._createMethod('screen')
        this.track = this._createMethod('track');
        this.action = action;
        this.name = name;
        this.type = action.type;
        this.alternativeNames.push(action.name);
    }
    ActionDestination.prototype.addMiddleware = function () {
        var _a;
        var fn = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fn[_i] = arguments[_i];
        }
        if (this.type === 'destination') {
            (_a = this.middleware).push.apply(_a, fn);
        }
    };
    ActionDestination.prototype.transform = function (ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
            var modifiedEvent;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0,_middleware__WEBPACK_IMPORTED_MODULE_1__.applyDestinationMiddleware)(this.name, ctx.event, this.middleware)];
                    case 1:
                        modifiedEvent = _a.sent();
                        if (modifiedEvent === null) {
                            ctx.cancel(new _core_context__WEBPACK_IMPORTED_MODULE_2__.ContextCancelation({
                                retry: false,
                                reason: 'dropped by destination middleware',
                            }));
                        }
                        return [2 /*return*/, new _core_context__WEBPACK_IMPORTED_MODULE_3__.Context(modifiedEvent)];
                }
            });
        });
    };
    ActionDestination.prototype._createMethod = function (methodName) {
        var _this = this;
        return function (ctx) { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(_this, void 0, Promise, function () {
            var transformedContext;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.action[methodName])
                            return [2 /*return*/, ctx];
                        transformedContext = ctx;
                        if (!(this.type === 'destination')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.transform(ctx)];
                    case 1:
                        transformedContext = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.action[methodName](transformedContext)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, ctx];
                }
            });
        }); };
    };
    /* --- PASSTHROUGH METHODS --- */
    ActionDestination.prototype.isLoaded = function () {
        return this.action.isLoaded();
    };
    ActionDestination.prototype.ready = function () {
        return this.action.ready ? this.action.ready() : Promise.resolve();
    };
    ActionDestination.prototype.load = function (ctx, analytics) {
        return this.action.load(ctx, analytics);
    };
    ActionDestination.prototype.unload = function (ctx, analytics) {
        var _a, _b;
        return (_b = (_a = this.action).unload) === null || _b === void 0 ? void 0 : _b.call(_a, ctx, analytics);
    };
    return ActionDestination;
}());

function validate(pluginLike) {
    if (!Array.isArray(pluginLike)) {
        throw new Error('Not a valid list of plugins');
    }
    var required = ['load', 'isLoaded', 'name', 'version', 'type'];
    pluginLike.forEach(function (plugin) {
        required.forEach(function (method) {
            var _a;
            if (plugin[method] === undefined) {
                throw new Error("Plugin: ".concat((_a = plugin.name) !== null && _a !== void 0 ? _a : 'unknown', " missing required function ").concat(method));
            }
        });
    });
    return true;
}
// function isPluginDisabled(
//   userIntegrations: Integrations,
//   remotePlugin: RemotePlugin
// ) {
//   const creationNameEnabled = userIntegrations[remotePlugin.creationName]
//   const currentNameEnabled = userIntegrations[remotePlugin.name]
//   // Check that the plugin isn't explicitly enabled when All: false
//   if (
//     userIntegrations.All === false &&
//     !creationNameEnabled &&
//     !currentNameEnabled
//   ) {
//     return true
//   }
//   // Check that the plugin isn't explicitly disabled
//   if (creationNameEnabled === false || currentNameEnabled === false) {
//     return true
//   }
//   return false
// }
function remoteLoader(analytics, settings, 
// userIntegrations: Integrations,
mergedIntegrations, 
// obfuscate?: boolean,
routingMiddleware) {
    var _a, _b, _c;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, Promise, function () {
        var allPlugins, cdn, routingRules, pluginPromises;
        var _this = this;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_d) {
            switch (_d.label) {
                case 0:
                    allPlugins = [];
                    cdn = (0,_lib_parse_cdn__WEBPACK_IMPORTED_MODULE_4__.getCDN)();
                    routingRules = (_b = (_a = settings.middlewareSettings) === null || _a === void 0 ? void 0 : _a.routingRules) !== null && _b !== void 0 ? _b : [];
                    pluginPromises = ((_c = settings.remotePlugins) !== null && _c !== void 0 ? _c : []).map(function (remotePlugin) { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(_this, void 0, void 0, function () {
                        var defaultCdn, libraryName, pluginFactory, plugin, plugins, routing_1, error_1;
                        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // if (isPluginDisabled(userIntegrations, remotePlugin)) return
                                    if (!remotePlugin.creationName) {
                                        remotePlugin.creationName = "AnalyticsPlugin".concat(remotePlugin.name);
                                    }
                                    if (!remotePlugin.libraryName) {
                                        remotePlugin.libraryName = "AnalyticsPlugin".concat(remotePlugin.name);
                                    }
                                    if (!remotePlugin.url) {
                                        remotePlugin.url = "".concat(cdn, "analytics-plugin-").concat(remotePlugin.name.toLocaleLowerCase(), ".js");
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    defaultCdn = new RegExp('https://cdn.segment.(com|build)');
                                    // if (obfuscate) {
                                    //   const urlSplit = remotePlugin.url.split('/')
                                    //   const name = urlSplit[urlSplit.length - 2]
                                    //   const obfuscatedURL = remotePlugin.url.replace(
                                    //     name,
                                    //     btoa(name).replace(/=/g, '')
                                    //   )
                                    //   try {
                                    //     await loadScript(obfuscatedURL.replace(defaultCdn, cdn))
                                    //   } catch (error) {
                                    //     // Due to syncing concerns it is possible that the obfuscated action destination (or requested version) might not exist.
                                    //     // We should use the unobfuscated version as a fallback.
                                    //     await loadScript(remotePlugin.url.replace(defaultCdn, cdn))
                                    //   }
                                    // } else {
                                    return [4 /*yield*/, (0,_lib_load_script__WEBPACK_IMPORTED_MODULE_5__.loadScript)(remotePlugin.url.replace(defaultCdn, cdn))
                                        // }
                                    ];
                                case 2:
                                    // if (obfuscate) {
                                    //   const urlSplit = remotePlugin.url.split('/')
                                    //   const name = urlSplit[urlSplit.length - 2]
                                    //   const obfuscatedURL = remotePlugin.url.replace(
                                    //     name,
                                    //     btoa(name).replace(/=/g, '')
                                    //   )
                                    //   try {
                                    //     await loadScript(obfuscatedURL.replace(defaultCdn, cdn))
                                    //   } catch (error) {
                                    //     // Due to syncing concerns it is possible that the obfuscated action destination (or requested version) might not exist.
                                    //     // We should use the unobfuscated version as a fallback.
                                    //     await loadScript(remotePlugin.url.replace(defaultCdn, cdn))
                                    //   }
                                    // } else {
                                    _a.sent();
                                    libraryName = remotePlugin.libraryName;
                                    if (!(typeof window[libraryName] === 'function')) return [3 /*break*/, 4];
                                    pluginFactory = window[libraryName];
                                    return [4 /*yield*/, pluginFactory(analytics, remotePlugin.settings, mergedIntegrations[remotePlugin.name])];
                                case 3:
                                    plugin = _a.sent();
                                    plugins = Array.isArray(plugin) ? plugin : [plugin];
                                    validate(plugins);
                                    routing_1 = routingRules.filter(function (rule) { return rule.destinationName === remotePlugin.creationName; });
                                    plugins.forEach(function (plugin) {
                                        var wrapper = new ActionDestination(remotePlugin.creationName, plugin);
                                        /** Make sure we only apply destination filters to actions of the "destination" type to avoid causing issues for hybrid destinations */
                                        if (routing_1.length &&
                                            routingMiddleware &&
                                            plugin.type === 'destination') {
                                            wrapper.addMiddleware(routingMiddleware);
                                        }
                                        allPlugins.push(wrapper);
                                    });
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    error_1 = _a.sent();
                                    console.warn('Failed to load Remote Plugin', error_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(pluginPromises)];
                case 1:
                    _d.sent();
                    return [2 /*return*/, allPlugins.filter(Boolean)];
            }
        });
    });
}


/***/ }),

/***/ 719:
/*!********************************************!*\
  !*** ./src/plugins/segmentio/normalize.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getVersionType": function() { return /* binding */ getVersionType; },
/* harmony export */   "normalize": function() { return /* binding */ normalize; },
/* harmony export */   "setVersionType": function() { return /* binding */ setVersionType; },
/* harmony export */   "utm": function() { return /* binding */ utm; }
/* harmony export */ });
/* harmony import */ var _core_query_string_gracefulDecodeURIComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/query-string/gracefulDecodeURIComponent */ 6863);
/* harmony import */ var _generated_version__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../generated/version */ 4278);
// import { SegmentEvent } from '../../core/events'


// import { getAvailableStorageOptions, UniversalStorage } from '../../core/user'
// let cookieOptions: jar.CookieAttributes | undefined
// function getCookieOptions(): jar.CookieAttributes {
//   if (cookieOptions) {
//     return cookieOptions
//   }
//   const domain = tld(window.location.href)
//   cookieOptions = {
//     expires: 31536000000, // 1 year
//     secure: false,
//     path: '/',
//   }
//   if (domain) {
//     cookieOptions.domain = domain
//   }
//   return cookieOptions
// }
// Default value will be updated to 'web' in `bundle-umd.ts` for web build.
var _version = 'npm';
function setVersionType(version) {
    _version = version;
}
function getVersionType() {
    return _version;
}
// type Ad = { id: string; type: string }
// export function ampId(): string | undefined {
//   const ampId = jar.get('_ga')
//   if (ampId && ampId.startsWith('amp')) {
//     return ampId
//   }
// }
function utm(query) {
    if (query.startsWith('?')) {
        query = query.substring(1);
    }
    query = query.replace(/\?/g, '&');
    return query.split('&').reduce(function (acc, str) {
        var _a = str.split('='), k = _a[0], _b = _a[1], v = _b === void 0 ? '' : _b;
        if (k.includes('utm_') && k.length > 4) {
            var utmParam = k.substr(4);
            if (utmParam === 'campaign') {
                utmParam = 'name';
            }
            acc[utmParam] = (0,_core_query_string_gracefulDecodeURIComponent__WEBPACK_IMPORTED_MODULE_0__.gracefulDecodeURIComponent)(v);
        }
        return acc;
    }, {});
}
// function ads(query: string): Ad | undefined {
//   const queryIds: Record<string, string> = {
//     btid: 'dataxu',
//     urid: 'millennial-media',
//   }
//   if (query.startsWith('?')) {
//     query = query.substring(1)
//   }
//   query = query.replace(/\?/g, '&')
//   const parts = query.split('&')
//   for (const part of parts) {
//     const [k, v] = part.split('=')
//     if (queryIds[k]) {
//       return {
//         id: v,
//         type: queryIds[k],
//       }
//     }
//   }
// }
// function referrerId(
//   query: string,
//   ctx: SegmentEvent['context'],
//   disablePersistance: boolean
// ): void {
//   const storage = new UniversalStorage<{
//     's:context.referrer': Ad
//   }>(
//     disablePersistance ? [] : ['cookie'],
//     getAvailableStorageOptions(getCookieOptions())
//   )
//   const stored = storage.get('s:context.referrer')
//   let ad: Ad | undefined | null = ads(query)
//   ad = ad ?? stored
//   if (!ad) {
//     return
//   }
//   if (ctx) {
//     ctx.referrer = { ...ctx.referrer, ...ad }
//   }
//   storage.set('s:context.referrer', ad)
// }
function normalize(analytics, json, settings, integrations) {
    var _a, _b, _c;
    var user = analytics.user();
    // context should always exist here (see page enrichment)? ... and why would we default to json.options? todo: delete this
    json.context = (_b = (_a = json.context) !== null && _a !== void 0 ? _a : json.options) !== null && _b !== void 0 ? _b : {};
    var ctx = json.context;
    // This guard against missing ctx.page should not be neccessary, since context.page is always defined
    var query = ((_c = ctx.page) === null || _c === void 0 ? void 0 : _c.search) || '';
    delete json.options;
    json.writeKey = settings === null || settings === void 0 ? void 0 : settings.apiKey;
    ctx.userAgent = window.navigator.userAgent;
    // @ts-ignore
    var locale = navigator.userLanguage || navigator.language;
    if (typeof ctx.locale === 'undefined' && typeof locale !== 'undefined') {
        ctx.locale = locale;
    }
    if (!ctx.library) {
        var type = getVersionType();
        if (type === 'web') {
            ctx.library = {
                name: 'analytics.js',
                version: "next-".concat(_generated_version__WEBPACK_IMPORTED_MODULE_1__.version),
            };
        }
        else {
            ctx.library = {
                name: 'analytics.js',
                version: "npm:next-".concat(_generated_version__WEBPACK_IMPORTED_MODULE_1__.version),
            };
        }
    }
    if (query && !ctx.campaign) {
        ctx.campaign = utm(query);
    }
    // referrerId(query, ctx, analytics.options.disableClientPersistence ?? false)
    json.userId = json.userId || user.id();
    json.anonymousId = json.anonymousId || user.anonymousId();
    json.sentAt = new Date();
    // const failed = analytics.queue.failedInitializations || []
    // if (failed.length > 0) {
    //   json._metadata = { failedInitializations: failed }
    // }
    var bundled = [];
    // const unbundled: string[] = []
    for (var key in integrations) {
        var integration = integrations[key];
        //   if (key === 'Segment.io') {
        //     bundled.push(key)
        //   }
        if (integration.bundlingStatus === 'bundled') {
            bundled.push(key);
        }
        //   if (integration.bundlingStatus === 'unbundled') {
        //     unbundled.push(key)
        //   }
    }
    // // This will make sure that the disabled cloud mode destinations will be
    // // included in the unbundled list.
    // for (const settingsUnbundled of settings?.unbundledIntegrations || []) {
    //   if (!unbundled.includes(settingsUnbundled)) {
    //     unbundled.push(settingsUnbundled)
    //   }
    // }
    // const configIds = settings?.maybeBundledConfigIds ?? {}
    // const bundledConfigIds: string[] = []
    // bundled.sort().forEach((name) => {
    //   ;(configIds[name] ?? []).forEach((id) => {
    //     bundledConfigIds.push(id)
    //   })
    // })
    // if (settings?.addBundledMetadata !== false) {
    //   json._metadata = {
    //     ...json._metadata,
    //     bundled: bundled.sort(),
    //     unbundled: unbundled.sort(),
    //     bundledIds: bundledConfigIds,
    //   }
    // }
    // const amp = ampId()
    // if (amp) {
    //   ctx.amp = { id: amp }
    // }
    return json;
}


/***/ }),

/***/ 1067:
/*!*****************************************!*\
  !*** ./src/plugins/validation/index.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "validation": function() { return /* binding */ validation; }
/* harmony export */ });
/* harmony import */ var _segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @segment/analytics-core */ 4262);

function validate(ctx) {
    var event = ctx.event;
    (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.assertEventExists)(event);
    (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.assertEventType)(event);
    if (event.type === 'track') {
        (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.assertTrackEventName)(event);
    }
    // const props = event.properties ?? event.traits
    // if (event.type !== 'alias' && !isPlainObject(props)) {
    //   throw new ValidationError('.properties', 'is not an object')
    // }
    (0,_segment_analytics_core__WEBPACK_IMPORTED_MODULE_0__.assertUserIdentity)(event);
    return ctx;
}
var validation = {
    name: 'Event Validation',
    type: 'before',
    version: '1.0.0',
    isLoaded: function () { return true; },
    load: function () { return Promise.resolve(); },
    track: validate,
    identify: validate,
    page: validate,
    // alias: validate,
    // group: validate,
    // screen: validate,
};


/***/ }),

/***/ 5163:
/*!*********************************************!*\
  !*** ../../node_modules/tslib/tslib.es6.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__assign": function() { return /* binding */ __assign; },
/* harmony export */   "__asyncDelegator": function() { return /* binding */ __asyncDelegator; },
/* harmony export */   "__asyncGenerator": function() { return /* binding */ __asyncGenerator; },
/* harmony export */   "__asyncValues": function() { return /* binding */ __asyncValues; },
/* harmony export */   "__await": function() { return /* binding */ __await; },
/* harmony export */   "__awaiter": function() { return /* binding */ __awaiter; },
/* harmony export */   "__classPrivateFieldGet": function() { return /* binding */ __classPrivateFieldGet; },
/* harmony export */   "__classPrivateFieldIn": function() { return /* binding */ __classPrivateFieldIn; },
/* harmony export */   "__classPrivateFieldSet": function() { return /* binding */ __classPrivateFieldSet; },
/* harmony export */   "__createBinding": function() { return /* binding */ __createBinding; },
/* harmony export */   "__decorate": function() { return /* binding */ __decorate; },
/* harmony export */   "__exportStar": function() { return /* binding */ __exportStar; },
/* harmony export */   "__extends": function() { return /* binding */ __extends; },
/* harmony export */   "__generator": function() { return /* binding */ __generator; },
/* harmony export */   "__importDefault": function() { return /* binding */ __importDefault; },
/* harmony export */   "__importStar": function() { return /* binding */ __importStar; },
/* harmony export */   "__makeTemplateObject": function() { return /* binding */ __makeTemplateObject; },
/* harmony export */   "__metadata": function() { return /* binding */ __metadata; },
/* harmony export */   "__param": function() { return /* binding */ __param; },
/* harmony export */   "__read": function() { return /* binding */ __read; },
/* harmony export */   "__rest": function() { return /* binding */ __rest; },
/* harmony export */   "__spread": function() { return /* binding */ __spread; },
/* harmony export */   "__spreadArray": function() { return /* binding */ __spreadArray; },
/* harmony export */   "__spreadArrays": function() { return /* binding */ __spreadArrays; },
/* harmony export */   "__values": function() { return /* binding */ __values; }
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}


/***/ }),

/***/ 9433:
/*!**********************************************!*\
  !*** ../core/dist/esm/analytics/dispatch.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dispatch": function() { return /* binding */ dispatch; },
/* harmony export */   "getDelay": function() { return /* binding */ getDelay; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _callback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../callback */ 888);


/* The amount of time in ms to wait before invoking the callback. */
var getDelay = function (startTimeInEpochMS, timeoutInMS) {
    var elapsedTime = Date.now() - startTimeInEpochMS;
    // increasing the timeout increases the delay by almost the same amount -- this is weird legacy behavior.
    return Math.max((timeoutInMS !== null && timeoutInMS !== void 0 ? timeoutInMS : 300) - elapsedTime, 0);
};
/**
 * Push an event into the dispatch queue and invoke any callbacks.
 *
 * @param event - Segment event to enqueue.
 * @param queue - Queue to dispatch against.
 * @param emitter - This is typically an instance of "Analytics" -- used for metrics / progress information.
 * @param options
 */
function dispatch(ctx, queue, emitter, options) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
        var startTime, dispatched;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emitter.emit('dispatch_start', ctx);
                    startTime = Date.now();
                    if (!queue.isEmpty()) return [3 /*break*/, 2];
                    return [4 /*yield*/, queue.dispatchSingle(ctx)];
                case 1:
                    dispatched = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, queue.dispatch(ctx)];
                case 3:
                    dispatched = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(options === null || options === void 0 ? void 0 : options.callback)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0,_callback__WEBPACK_IMPORTED_MODULE_1__.invokeCallback)(dispatched, options.callback, getDelay(startTime, options.timeout))];
                case 5:
                    dispatched = _a.sent();
                    _a.label = 6;
                case 6:
                    if (options === null || options === void 0 ? void 0 : options.debug) {
                        dispatched.flush();
                    }
                    return [2 /*return*/, dispatched];
            }
        });
    });
}
//# sourceMappingURL=dispatch.js.map

/***/ }),

/***/ 888:
/*!******************************************!*\
  !*** ../core/dist/esm/callback/index.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "invokeCallback": function() { return /* binding */ invokeCallback; },
/* harmony export */   "pTimeout": function() { return /* binding */ pTimeout; },
/* harmony export */   "sleep": function() { return /* binding */ sleep; }
/* harmony export */ });
function pTimeout(promise, timeout) {
    return new Promise(function (resolve, reject) {
        var timeoutId = setTimeout(function () {
            reject(Error('Promise timed out'));
        }, timeout);
        promise
            .then(function (val) {
            clearTimeout(timeoutId);
            return resolve(val);
        })
            .catch(reject);
    });
}
function sleep(timeoutInMs) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeoutInMs); });
}
/**
 * @param ctx
 * @param callback - the function to invoke
 * @param delay - aka "timeout". The amount of time in ms to wait before invoking the callback.
 */
function invokeCallback(ctx, callback, delay) {
    var cb = function () {
        try {
            return Promise.resolve(callback(ctx));
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    return (sleep(delay)
        // pTimeout ensures that the callback can't cause the context to hang
        .then(function () { return pTimeout(cb(), 1000); })
        .catch(function (err) {
        ctx === null || ctx === void 0 ? void 0 : ctx.log('warn', 'Callback Error', { error: err });
        ctx === null || ctx === void 0 ? void 0 : ctx.stats.increment('callback_error');
    })
        .then(function () { return ctx; }));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7920:
/*!*****************************************!*\
  !*** ../core/dist/esm/context/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContextCancelation": function() { return /* binding */ ContextCancelation; },
/* harmony export */   "CoreContext": function() { return /* binding */ CoreContext; }
/* harmony export */ });
/* harmony import */ var _lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lukeed/uuid */ 7831);
/* harmony import */ var dset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dset */ 380);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../logger */ 8804);
/* harmony import */ var _stats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../stats */ 417);




var ContextCancelation = /** @class */ (function () {
    function ContextCancelation(options) {
        var _a, _b, _c;
        this.retry = (_a = options.retry) !== null && _a !== void 0 ? _a : true;
        this.type = (_b = options.type) !== null && _b !== void 0 ? _b : 'plugin Error';
        this.reason = (_c = options.reason) !== null && _c !== void 0 ? _c : '';
    }
    return ContextCancelation;
}());

var CoreContext = /** @class */ (function () {
    function CoreContext(event, id, stats, logger) {
        if (id === void 0) { id = (0,_lukeed_uuid__WEBPACK_IMPORTED_MODULE_0__.v4)(); }
        if (stats === void 0) { stats = new _stats__WEBPACK_IMPORTED_MODULE_2__.NullStats(); }
        if (logger === void 0) { logger = new _logger__WEBPACK_IMPORTED_MODULE_3__.CoreLogger(); }
        this.attempts = 0;
        this.event = event;
        this._id = id;
        this.logger = logger;
        this.stats = stats;
    }
    CoreContext.system = function () {
        // This should be overridden by the subclass to return an instance of the subclass.
    };
    CoreContext.prototype.isSame = function (other) {
        return other.id === this.id;
    };
    CoreContext.prototype.cancel = function (error) {
        if (error) {
            throw error;
        }
        throw new ContextCancelation({ reason: 'Context Cancel' });
    };
    CoreContext.prototype.log = function (level, message, extras) {
        this.logger.log(level, message, extras);
    };
    Object.defineProperty(CoreContext.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    CoreContext.prototype.updateEvent = function (path, val) {
        var _a;
        // Don't allow integrations that are set to false to be overwritten with integration settings.
        if (path.split('.')[0] === 'integrations') {
            var integrationName = path.split('.')[1];
            if (((_a = this.event.integrations) === null || _a === void 0 ? void 0 : _a[integrationName]) === false) {
                return this.event;
            }
        }
        (0,dset__WEBPACK_IMPORTED_MODULE_1__.dset)(this.event, path, val);
        return this.event;
    };
    CoreContext.prototype.failedDelivery = function () {
        return this._failedDelivery;
    };
    CoreContext.prototype.setFailedDelivery = function (options) {
        this._failedDelivery = options;
    };
    CoreContext.prototype.logs = function () {
        return this.logger.logs;
    };
    CoreContext.prototype.flush = function () {
        this.logger.flush();
        this.stats.flush();
    };
    CoreContext.prototype.toJSON = function () {
        return {
            id: this._id,
            event: this.event,
            logs: this.logger.logs,
            metrics: this.stats.metrics,
        };
    };
    return CoreContext;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7127:
/*!*****************************************!*\
  !*** ../core/dist/esm/emitter/index.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Emitter": function() { return /* binding */ Emitter; }
/* harmony export */ });
/**
 * Event Emitter that takes the expected contract as a generic
 * @example
 * ```ts
 *  type Contract = {
 *    delivery_success: [DeliverySuccessResponse, Metrics],
 *    delivery_failure: [DeliveryError]
 * }
 *  new Emitter<Contract>()
 *  .on('delivery_success', (res, metrics) => ...)
 *  .on('delivery_failure', (err) => ...)
 * ```
 */
var Emitter = /** @class */ (function () {
    function Emitter() {
        this.callbacks = {};
    }
    Emitter.prototype.on = function (event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [callback];
        }
        else {
            this.callbacks[event].push(callback);
        }
        return this;
    };
    Emitter.prototype.once = function (event, callback) {
        var _this = this;
        var on = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.off(event, on);
            callback.apply(_this, args);
        };
        this.on(event, on);
        return this;
    };
    Emitter.prototype.off = function (event, callback) {
        var _a;
        var fns = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        var without = fns.filter(function (fn) { return fn !== callback; });
        this.callbacks[event] = without;
        return this;
    };
    Emitter.prototype.emit = function (event) {
        var _this = this;
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callbacks = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        callbacks.forEach(function (callback) {
            callback.apply(_this, args);
        });
        return this;
    };
    return Emitter;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8804:
/*!****************************************!*\
  !*** ../core/dist/esm/logger/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoreLogger": function() { return /* binding */ CoreLogger; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

var CoreLogger = /** @class */ (function () {
    function CoreLogger() {
        this._logs = [];
    }
    CoreLogger.prototype.log = function (level, message, extras) {
        var time = new Date();
        this._logs.push({
            level: level,
            message: message,
            time: time,
            extras: extras,
        });
    };
    Object.defineProperty(CoreLogger.prototype, "logs", {
        get: function () {
            return this._logs;
        },
        enumerable: false,
        configurable: true
    });
    CoreLogger.prototype.flush = function () {
        if (this.logs.length > 1) {
            var formatted = this._logs.reduce(function (logs, log) {
                var _a;
                var _b, _c;
                var line = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, log), { json: JSON.stringify(log.extras, null, ' '), extras: log.extras });
                delete line['time'];
                var key = (_c = (_b = log.time) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : '';
                if (logs[key]) {
                    key = "".concat(key, "-").concat(Math.random());
                }
                return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, logs), (_a = {}, _a[key] = line, _a));
            }, {});
            // ie doesn't like console.table
            if (console.table) {
                console.table(formatted);
            }
            else {
                console.log(formatted);
            }
        }
        else {
            this.logs.forEach(function (logEntry) {
                var level = logEntry.level, message = logEntry.message, extras = logEntry.extras;
                if (level === 'info' || level === 'debug') {
                    console.log(message, extras !== null && extras !== void 0 ? extras : '');
                }
                else {
                    console[level](message, extras !== null && extras !== void 0 ? extras : '');
                }
            });
        }
        this._logs = [];
    };
    return CoreLogger;
}());

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3797:
/*!**************************************************!*\
  !*** ../core/dist/esm/priority-queue/backoff.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "backoff": function() { return /* binding */ backoff; }
/* harmony export */ });
function backoff(params) {
    var random = Math.random() + 1;
    var _a = params.minTimeout, minTimeout = _a === void 0 ? 500 : _a, _b = params.factor, factor = _b === void 0 ? 2 : _b, attempt = params.attempt, _c = params.maxTimeout, maxTimeout = _c === void 0 ? Infinity : _c;
    return Math.min(random * minTimeout * Math.pow(factor, attempt), maxTimeout);
}
//# sourceMappingURL=backoff.js.map

/***/ }),

/***/ 3874:
/*!************************************************!*\
  !*** ../core/dist/esm/priority-queue/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ON_REMOVE_FROM_FUTURE": function() { return /* binding */ ON_REMOVE_FROM_FUTURE; },
/* harmony export */   "PriorityQueue": function() { return /* binding */ PriorityQueue; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../emitter */ 7127);
/* harmony import */ var _backoff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./backoff */ 3797);



/**
 * @internal
 */
var ON_REMOVE_FROM_FUTURE = 'onRemoveFromFuture';
var PriorityQueue = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(PriorityQueue, _super);
    function PriorityQueue(maxAttempts, queue, seen) {
        var _this = _super.call(this) || this;
        _this.future = [];
        _this.maxAttempts = maxAttempts;
        _this.queue = queue;
        _this.seen = seen !== null && seen !== void 0 ? seen : {};
        return _this;
    }
    PriorityQueue.prototype.push = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var accepted = items.map(function (operation) {
            var attempts = _this.updateAttempts(operation);
            if (attempts > _this.maxAttempts || _this.includes(operation)) {
                return false;
            }
            _this.queue.push(operation);
            return true;
        });
        this.queue = this.queue.sort(function (a, b) { return _this.getAttempts(a) - _this.getAttempts(b); });
        return accepted;
    };
    PriorityQueue.prototype.pushWithBackoff = function (item) {
        var _this = this;
        if (this.getAttempts(item) === 0) {
            return this.push(item)[0];
        }
        var attempt = this.updateAttempts(item);
        if (attempt > this.maxAttempts || this.includes(item)) {
            return false;
        }
        var timeout = (0,_backoff__WEBPACK_IMPORTED_MODULE_1__.backoff)({ attempt: attempt - 1 });
        setTimeout(function () {
            _this.queue.push(item);
            // remove from future list
            _this.future = _this.future.filter(function (f) { return f.id !== item.id; });
            // Lets listeners know that a 'future' message is now available in the queue
            _this.emit(ON_REMOVE_FROM_FUTURE);
        }, timeout);
        this.future.push(item);
        return true;
    };
    PriorityQueue.prototype.getAttempts = function (item) {
        var _a;
        return (_a = this.seen[item.id]) !== null && _a !== void 0 ? _a : 0;
    };
    PriorityQueue.prototype.updateAttempts = function (item) {
        this.seen[item.id] = this.getAttempts(item) + 1;
        return this.getAttempts(item);
    };
    PriorityQueue.prototype.includes = function (item) {
        return (this.queue.includes(item) ||
            this.future.includes(item) ||
            Boolean(this.queue.find(function (i) { return i.id === item.id; })) ||
            Boolean(this.future.find(function (i) { return i.id === item.id; })));
    };
    PriorityQueue.prototype.pop = function () {
        return this.queue.shift();
    };
    Object.defineProperty(PriorityQueue.prototype, "length", {
        get: function () {
            return this.queue.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PriorityQueue.prototype, "todo", {
        get: function () {
            return this.queue.length + this.future.length;
        },
        enumerable: false,
        configurable: true
    });
    return PriorityQueue;
}(_emitter__WEBPACK_IMPORTED_MODULE_2__.Emitter));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6096:
/*!******************************************!*\
  !*** ../core/dist/esm/queue/delivery.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attempt": function() { return /* binding */ attempt; },
/* harmony export */   "ensure": function() { return /* binding */ ensure; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../context */ 7920);


function tryAsync(fn) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
        var err_1;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fn()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(err_1)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function attempt(ctx, plugin) {
    ctx.log('debug', 'plugin', { plugin: plugin.name });
    var start = new Date().getTime();
    var hook = plugin[ctx.event.type];
    if (hook === undefined) {
        return Promise.resolve(ctx);
    }
    var newCtx = tryAsync(function () { return hook.apply(plugin, [ctx]); })
        .then(function (ctx) {
        var done = new Date().getTime() - start;
        ctx.stats.gauge('plugin_time', done, ["plugin:".concat(plugin.name)]);
        return ctx;
    })
        .catch(function (err) {
        if (err instanceof _context__WEBPACK_IMPORTED_MODULE_1__.ContextCancelation &&
            err.type === 'middleware_cancellation') {
            throw err;
        }
        if (err instanceof _context__WEBPACK_IMPORTED_MODULE_1__.ContextCancelation) {
            ctx.log('warn', err.type, {
                plugin: plugin.name,
                error: err,
            });
            return err;
        }
        ctx.log('error', 'plugin Error', {
            plugin: plugin.name,
            error: err,
        });
        ctx.stats.increment('plugin_error', 1, ["plugin:".concat(plugin.name)]);
        return err;
    });
    return newCtx;
}
function ensure(ctx, plugin) {
    return attempt(ctx, plugin).then(function (newContext) {
        if (newContext instanceof _context__WEBPACK_IMPORTED_MODULE_1__.CoreContext) {
            return newContext;
        }
        ctx.log('debug', 'Context canceled');
        ctx.stats.increment('context_canceled');
        ctx.cancel(newContext);
    });
}
//# sourceMappingURL=delivery.js.map

/***/ }),

/***/ 51:
/*!*********************************************!*\
  !*** ../core/dist/esm/queue/event-queue.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoreEventQueue": function() { return /* binding */ CoreEventQueue; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);
/* harmony import */ var _utils_group_by__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/group-by */ 7489);
/* harmony import */ var _priority_queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../priority-queue */ 3874);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context */ 7920);
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../emitter */ 7127);
/* harmony import */ var _task_task_group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../task/task-group */ 7271);
/* harmony import */ var _delivery__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./delivery */ 6096);







var CoreEventQueue = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(CoreEventQueue, _super);
    function CoreEventQueue(priorityQueue) {
        var _this = _super.call(this) || this;
        /**
         * All event deliveries get suspended until all the tasks in this task group are complete.
         * For example: a middleware that augments the event object should be loaded safely as a
         * critical task, this way, event queue will wait for it to be ready before sending events.
         *
         * This applies to all the events already in the queue, and the upcoming ones
         */
        _this.criticalTasks = (0,_task_task_group__WEBPACK_IMPORTED_MODULE_1__.createTaskGroup)();
        _this.plugins = [];
        _this.failedInitializations = [];
        _this.flushing = false;
        _this.queue = priorityQueue;
        _this.queue.on(_priority_queue__WEBPACK_IMPORTED_MODULE_2__.ON_REMOVE_FROM_FUTURE, function () {
            _this.scheduleFlush(0);
        });
        return _this;
    }
    CoreEventQueue.prototype.register = function (ctx, plugin, instance) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve(plugin.load(ctx, instance))
                            .then(function () {
                            _this.plugins.push(plugin);
                        })
                            .catch(function (err) {
                            if (plugin.type === 'destination') {
                                _this.failedInitializations.push(plugin.name);
                                console.warn(plugin.name, err);
                                ctx.log('warn', 'Failed to load destination', {
                                    plugin: plugin.name,
                                    error: err,
                                });
                                return;
                            }
                            throw err;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoreEventQueue.prototype.deregister = function (ctx, plugin, instance) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var e_1;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!plugin.unload) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve(plugin.unload(ctx, instance))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.plugins = this.plugins.filter(function (p) { return p.name !== plugin.name; });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        ctx.log('warn', 'Failed to unload destination', {
                            plugin: plugin.name,
                            error: e_1,
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CoreEventQueue.prototype.dispatch = function (ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var willDeliver;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                ctx.log('debug', 'Dispatching');
                ctx.stats.increment('message_dispatched');
                this.queue.push(ctx);
                willDeliver = this.subscribeToDelivery(ctx);
                this.scheduleFlush(0);
                return [2 /*return*/, willDeliver];
            });
        });
    };
    CoreEventQueue.prototype.subscribeToDelivery = function (ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var onDeliver = function (flushed, delivered) {
                            if (flushed.isSame(ctx)) {
                                _this.off('flush', onDeliver);
                                if (delivered) {
                                    resolve(flushed);
                                }
                                else {
                                    resolve(flushed);
                                }
                            }
                        };
                        _this.on('flush', onDeliver);
                    })];
            });
        });
    };
    CoreEventQueue.prototype.dispatchSingle = function (ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                ctx.log('debug', 'Dispatching');
                ctx.stats.increment('message_dispatched');
                this.queue.updateAttempts(ctx);
                ctx.attempts = 1;
                return [2 /*return*/, this.deliver(ctx).catch(function (err) {
                        var accepted = _this.enqueuRetry(err, ctx);
                        if (!accepted) {
                            ctx.setFailedDelivery({ reason: err });
                            return ctx;
                        }
                        return _this.subscribeToDelivery(ctx);
                    })];
            });
        });
    };
    CoreEventQueue.prototype.isEmpty = function () {
        return this.queue.length === 0;
    };
    CoreEventQueue.prototype.scheduleFlush = function (timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 500; }
        if (this.flushing) {
            return;
        }
        this.flushing = true;
        setTimeout(function () {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            _this.flush().then(function () {
                setTimeout(function () {
                    _this.flushing = false;
                    if (_this.queue.length) {
                        _this.scheduleFlush(0);
                    }
                }, 0);
            });
        }, timeout);
    };
    CoreEventQueue.prototype.deliver = function (ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var start, done, err_1, error;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.criticalTasks.done()];
                    case 1:
                        _a.sent();
                        start = Date.now();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.flushOne(ctx)];
                    case 3:
                        ctx = _a.sent();
                        done = Date.now() - start;
                        this.emit('delivery_success', ctx);
                        ctx.stats.gauge('delivered', done);
                        ctx.log('debug', 'Delivered', ctx.event);
                        return [2 /*return*/, ctx];
                    case 4:
                        err_1 = _a.sent();
                        error = err_1;
                        ctx.log('error', 'Failed to deliver', error);
                        this.emit('delivery_failure', ctx, error);
                        ctx.stats.increment('delivery_failed');
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CoreEventQueue.prototype.enqueuRetry = function (err, ctx) {
        var retriable = !(err instanceof _context__WEBPACK_IMPORTED_MODULE_3__.ContextCancelation) || err.retry;
        if (!retriable) {
            return false;
        }
        return this.queue.pushWithBackoff(ctx);
    };
    CoreEventQueue.prototype.flush = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var ctx, err_2, accepted;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queue.length === 0) {
                            return [2 /*return*/, []];
                        }
                        ctx = this.queue.pop();
                        if (!ctx) {
                            return [2 /*return*/, []];
                        }
                        ctx.attempts = this.queue.getAttempts(ctx);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.deliver(ctx)];
                    case 2:
                        ctx = _a.sent();
                        this.emit('flush', ctx, true);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        accepted = this.enqueuRetry(err_2, ctx);
                        if (!accepted) {
                            ctx.setFailedDelivery({ reason: err_2 });
                            this.emit('flush', ctx, false);
                        }
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/, [ctx]];
                }
            });
        });
    };
    CoreEventQueue.prototype.isReady = function () {
        // return this.plugins.every((p) => p.isLoaded())
        // should we wait for every plugin to load?
        return true;
    };
    CoreEventQueue.prototype.availableExtensions = function (denyList) {
        var available = this.plugins.filter(function (p) {
            var _a, _b, _c;
            // Only filter out destination plugins or the Segment.io plugin
            if (p.type !== 'destination' && p.name !== 'Segment.io') {
                return true;
            }
            var alternativeNameMatch = undefined;
            (_a = p.alternativeNames) === null || _a === void 0 ? void 0 : _a.forEach(function (name) {
                if (denyList[name] !== undefined) {
                    alternativeNameMatch = denyList[name];
                }
            });
            // Explicit integration option takes precedence, `All: false` does not apply to Segment.io
            return ((_c = (_b = denyList[p.name]) !== null && _b !== void 0 ? _b : alternativeNameMatch) !== null && _c !== void 0 ? _c : (p.name === 'Segment.io' ? true : denyList.All) !== false);
        });
        var _a = (0,_utils_group_by__WEBPACK_IMPORTED_MODULE_4__.groupBy)(available, 'type'), _b = _a.before, before = _b === void 0 ? [] : _b, _c = _a.enrichment, enrichment = _c === void 0 ? [] : _c, _d = _a.destination, destination = _d === void 0 ? [] : _d, _e = _a.after, after = _e === void 0 ? [] : _e;
        return {
            before: before,
            enrichment: enrichment,
            destinations: destination,
            after: after,
        };
    };
    CoreEventQueue.prototype.flushOne = function (ctx) {
        var _a, _b;
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {
            var _c, before, enrichment, _i, before_1, beforeWare, temp, _d, enrichment_1, enrichmentWare, temp, _e, destinations, after, afterCalls;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.isReady()) {
                            throw new Error('Not ready');
                        }
                        if (ctx.attempts > 1) {
                            this.emit('delivery_retry', ctx);
                        }
                        _c = this.availableExtensions((_a = ctx.event.integrations) !== null && _a !== void 0 ? _a : {}), before = _c.before, enrichment = _c.enrichment;
                        _i = 0, before_1 = before;
                        _f.label = 1;
                    case 1:
                        if (!(_i < before_1.length)) return [3 /*break*/, 4];
                        beforeWare = before_1[_i];
                        return [4 /*yield*/, (0,_delivery__WEBPACK_IMPORTED_MODULE_5__.ensure)(ctx, beforeWare)];
                    case 2:
                        temp = _f.sent();
                        if (temp instanceof _context__WEBPACK_IMPORTED_MODULE_3__.CoreContext) {
                            ctx = temp;
                        }
                        this.emit('message_enriched', ctx, beforeWare);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _d = 0, enrichment_1 = enrichment;
                        _f.label = 5;
                    case 5:
                        if (!(_d < enrichment_1.length)) return [3 /*break*/, 8];
                        enrichmentWare = enrichment_1[_d];
                        return [4 /*yield*/, (0,_delivery__WEBPACK_IMPORTED_MODULE_5__.attempt)(ctx, enrichmentWare)];
                    case 6:
                        temp = _f.sent();
                        if (temp instanceof _context__WEBPACK_IMPORTED_MODULE_3__.CoreContext) {
                            ctx = temp;
                        }
                        this.emit('message_enriched', ctx, enrichmentWare);
                        _f.label = 7;
                    case 7:
                        _d++;
                        return [3 /*break*/, 5];
                    case 8:
                        _e = this.availableExtensions((_b = ctx.event.integrations) !== null && _b !== void 0 ? _b : {}), destinations = _e.destinations, after = _e.after;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    var attempts = destinations.map(function (destination) {
                                        return (0,_delivery__WEBPACK_IMPORTED_MODULE_5__.attempt)(ctx, destination);
                                    });
                                    Promise.all(attempts).then(resolve).catch(reject);
                                }, 0);
                            })];
                    case 9:
                        _f.sent();
                        ctx.stats.increment('message_delivered');
                        this.emit('message_delivered', ctx);
                        afterCalls = after.map(function (after) { return (0,_delivery__WEBPACK_IMPORTED_MODULE_5__.attempt)(ctx, after); });
                        return [4 /*yield*/, Promise.all(afterCalls)];
                    case 10:
                        _f.sent();
                        return [2 /*return*/, ctx];
                }
            });
        });
    };
    return CoreEventQueue;
}(_emitter__WEBPACK_IMPORTED_MODULE_6__.Emitter));

//# sourceMappingURL=event-queue.js.map

/***/ }),

/***/ 417:
/*!***************************************!*\
  !*** ../core/dist/esm/stats/index.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CoreStats": function() { return /* binding */ CoreStats; },
/* harmony export */   "NullStats": function() { return /* binding */ NullStats; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

var compactMetricType = function (type) {
    var enums = {
        gauge: 'g',
        counter: 'c',
    };
    return enums[type];
};
var CoreStats = /** @class */ (function () {
    function CoreStats() {
        this.metrics = [];
    }
    CoreStats.prototype.increment = function (metric, by, tags) {
        if (by === void 0) { by = 1; }
        this.metrics.push({
            metric: metric,
            value: by,
            tags: tags !== null && tags !== void 0 ? tags : [],
            type: 'counter',
            timestamp: Date.now(),
        });
    };
    CoreStats.prototype.gauge = function (metric, value, tags) {
        this.metrics.push({
            metric: metric,
            value: value,
            tags: tags !== null && tags !== void 0 ? tags : [],
            type: 'gauge',
            timestamp: Date.now(),
        });
    };
    CoreStats.prototype.flush = function () {
        var formatted = this.metrics.map(function (m) { return ((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, m), { tags: m.tags.join(',') })); });
        // ie doesn't like console.table
        if (console.table) {
            console.table(formatted);
        }
        else {
            console.log(formatted);
        }
        this.metrics = [];
    };
    /**
     * compact keys for smaller payload
     */
    CoreStats.prototype.serialize = function () {
        return this.metrics.map(function (m) {
            return {
                m: m.metric,
                v: m.value,
                t: m.tags,
                k: compactMetricType(m.type),
                e: m.timestamp,
            };
        });
    };
    return CoreStats;
}());

var NullStats = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(NullStats, _super);
    function NullStats() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullStats.prototype.gauge = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.increment = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.flush = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
    };
    NullStats.prototype.serialize = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        return [];
    };
    return NullStats;
}(CoreStats));

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7271:
/*!*******************************************!*\
  !*** ../core/dist/esm/task/task-group.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTaskGroup": function() { return /* binding */ createTaskGroup; }
/* harmony export */ });
/* harmony import */ var _utils_is_thenable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/is-thenable */ 3846);

var createTaskGroup = function () {
    var taskCompletionPromise;
    var resolvePromise;
    var count = 0;
    return {
        done: function () { return taskCompletionPromise; },
        run: function (op) {
            var returnValue = op();
            if ((0,_utils_is_thenable__WEBPACK_IMPORTED_MODULE_0__.isThenable)(returnValue)) {
                if (++count === 1) {
                    taskCompletionPromise = new Promise(function (res) { return (resolvePromise = res); });
                }
                returnValue.finally(function () { return --count === 0 && resolvePromise(); });
            }
            return returnValue;
        },
    };
};
//# sourceMappingURL=task-group.js.map

/***/ }),

/***/ 7489:
/*!******************************************!*\
  !*** ../core/dist/esm/utils/group-by.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "groupBy": function() { return /* binding */ groupBy; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

function groupBy(collection, grouper) {
    var results = {};
    collection.forEach(function (item) {
        var _a;
        var key = undefined;
        if (typeof grouper === 'string') {
            var suggestedKey = item[grouper];
            key =
                typeof suggestedKey !== 'string'
                    ? JSON.stringify(suggestedKey)
                    : suggestedKey;
        }
        else if (grouper instanceof Function) {
            key = grouper(item);
        }
        if (key === undefined) {
            return;
        }
        results[key] = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], ((_a = results[key]) !== null && _a !== void 0 ? _a : []), true), [item], false);
    });
    return results;
}
//# sourceMappingURL=group-by.js.map

/***/ }),

/***/ 3846:
/*!*********************************************!*\
  !*** ../core/dist/esm/utils/is-thenable.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isThenable": function() { return /* binding */ isThenable; }
/* harmony export */ });
/**
 *  Check if  thenable
 *  (instanceof Promise doesn't respect realms)
 */
var isThenable = function (value) {
    return typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof value.then === 'function';
};
//# sourceMappingURL=is-thenable.js.map

/***/ }),

/***/ 4262:
/*!*************************************************!*\
  !*** ../core/dist/esm/validation/assertions.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assertEventExists": function() { return /* binding */ assertEventExists; },
/* harmony export */   "assertEventType": function() { return /* binding */ assertEventType; },
/* harmony export */   "assertTrackEventName": function() { return /* binding */ assertTrackEventName; },
/* harmony export */   "assertTrackEventProperties": function() { return /* binding */ assertTrackEventProperties; },
/* harmony export */   "assertTraits": function() { return /* binding */ assertTraits; },
/* harmony export */   "assertUserIdentity": function() { return /* binding */ assertUserIdentity; },
/* harmony export */   "validateEvent": function() { return /* binding */ validateEvent; }
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ 2370);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ 7595);


var stringError = 'is not a string';
var objError = 'is not an object';
var nilError = 'is nil';
function assertUserIdentity(event) {
    var USER_FIELD_NAME = '.userId/anonymousId/previousId/groupId';
    var getAnyUserId = function (event) { var _a, _b, _c; return (_c = (_b = (_a = event.userId) !== null && _a !== void 0 ? _a : event.anonymousId) !== null && _b !== void 0 ? _b : event.groupId) !== null && _c !== void 0 ? _c : event.previousId; };
    var id = getAnyUserId(event);
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.exists)(id)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError(USER_FIELD_NAME, nilError);
    }
    else if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isString)(id)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError(USER_FIELD_NAME, stringError);
    }
}
function assertEventExists(event) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.exists)(event)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('Event', nilError);
    }
    if (typeof event !== 'object') {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('Event', objError);
    }
}
function assertEventType(event) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isString)(event.type)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('.type', stringError);
    }
}
function assertTrackEventName(event) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isString)(event.event)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('.event', stringError);
    }
}
function assertTrackEventProperties(event) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(event.properties)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('.properties', objError);
    }
}
function assertTraits(event) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(event.traits)) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ValidationError('.traits', objError);
    }
}
function validateEvent(event) {
    assertEventExists(event);
    assertEventType(event);
    if (event.type === 'track') {
        assertTrackEventName(event);
        assertTrackEventProperties(event);
    }
    if (['group', 'identify'].includes(event.type)) {
        assertTraits(event);
    }
    assertUserIdentity(event);
}
//# sourceMappingURL=assertions.js.map

/***/ }),

/***/ 2370:
/*!*********************************************!*\
  !*** ../core/dist/esm/validation/errors.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ValidationError": function() { return /* binding */ ValidationError; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 5163);

var ValidationError = /** @class */ (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(ValidationError, _super);
    function ValidationError(field, message) {
        var _this = _super.call(this, "".concat(field, " ").concat(message)) || this;
        _this.field = field;
        return _this;
    }
    return ValidationError;
}(Error));

//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 7595:
/*!**********************************************!*\
  !*** ../core/dist/esm/validation/helpers.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "exists": function() { return /* binding */ exists; },
/* harmony export */   "isFunction": function() { return /* binding */ isFunction; },
/* harmony export */   "isNumber": function() { return /* binding */ isNumber; },
/* harmony export */   "isPlainObject": function() { return /* binding */ isPlainObject; },
/* harmony export */   "isString": function() { return /* binding */ isString; }
/* harmony export */ });
function isString(obj) {
    return typeof obj === 'string';
}
function isNumber(obj) {
    return typeof obj === 'number';
}
function isFunction(obj) {
    return typeof obj === 'function';
}
function exists(val) {
    return val !== undefined && val !== null;
}
function isPlainObject(obj) {
    return (Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === 'object');
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ 7831:
/*!******************************************************!*\
  !*** ../../node_modules/@lukeed/uuid/dist/index.mjs ***!
  \******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v4": function() { return /* binding */ v4; }
/* harmony export */ });
var IDX=256, HEX=[], BUFFER;
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

function v4() {
	var i=0, num, out='';

	if (!BUFFER || ((IDX + 16) > 256)) {
		BUFFER = Array(i=256);
		while (i--) BUFFER[i] = 256 * Math.random() | 0;
		i = IDX = 0;
	}

	for (; i < 16; i++) {
		num = BUFFER[IDX + i];
		if (i==6) out += HEX[num & 15 | 64];
		else if (i==8) out += HEX[num & 63 | 128];
		else out += HEX[num];

		if (i & 1 && i > 1 && i < 11) out += '-';
	}

	IDX++;
	return out;
}


/***/ }),

/***/ 380:
/*!**********************************************!*\
  !*** ../../node_modules/dset/dist/index.mjs ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dset": function() { return /* binding */ dset; }
/* harmony export */ });
function dset(obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	while (i < l) {
		k = keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
		t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
	}
}


/***/ }),

/***/ 1805:
/*!*******************************************************!*\
  !*** ../../node_modules/js-cookie/dist/js.cookie.mjs ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ __webpack_exports__["default"] = (api);


/***/ }),

/***/ 3721:
/*!***************************************************!*\
  !*** ../../node_modules/unfetch/dist/unfetch.mjs ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* export default binding */ __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(e,n){return n=n||{},new Promise(function(t,r){var s=new XMLHttpRequest,o=[],u=[],i={},a=function(){return{ok:2==(s.status/100|0),statusText:s.statusText,status:s.status,url:s.responseURL,text:function(){return Promise.resolve(s.responseText)},json:function(){return Promise.resolve(JSON.parse(s.responseText))},blob:function(){return Promise.resolve(new Blob([s.response]))},clone:a,headers:{keys:function(){return o},entries:function(){return u},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}};for(var l in s.open(n.method||"get",e,!0),s.onload=function(){s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm,function(e,n,t){o.push(n=n.toLowerCase()),u.push([n,t]),i[n]=i[n]?i[n]+","+t:t}),t(a())},s.onerror=r,s.withCredentials="include"==n.credentials,n.headers)s.setRequestHeader(l,n.headers[l]);s.send(n.body||null)})}
//# sourceMappingURL=unfetch.mjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!***********************************!*\
  !*** ./src/browser/standalone.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugins_segmentio_normalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../plugins/segmentio/normalize */ 719);
/* harmony import */ var _standalone_analytics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./standalone-analytics */ 2703);
/* eslint-disable @typescript-eslint/no-floating-promises */
// import { getCDN, setGlobalCDNUrl } from '../lib/parse-cdn'

// if (process.env.ASSET_PATH) {
//   if (process.env.ASSET_PATH === '/dist/umd/') {
//     // @ts-ignore
//     __webpack_public_path__ = '/dist/umd/'
//   } else {
//     const cdn = getCDN()
//     setGlobalCDNUrl(cdn)
//     // @ts-ignore
//     __webpack_public_path__ = cdn
//       ? cdn + '/analytics-next/bundles/'
//       : 'https://cdn.segment.com/analytics-next/bundles/'
//   }
// }
(0,_plugins_segmentio_normalize__WEBPACK_IMPORTED_MODULE_0__.setVersionType)('web');

// import '../lib/csp-detection'
// import { RemoteMetrics } from '../core/stats/remote-metrics'
// import { embeddedWriteKey } from '../lib/embedded-write-key'
// import {
//   loadAjsClassicFallback,
//   isAnalyticsCSPError,
// } from '../lib/csp-detection'
// let ajsIdentifiedCSP = false
// const sendErrorMetrics = (tags: string[]) => {
//   // this should not be instantied at the root, or it will break ie11.
//   const metrics = new RemoteMetrics()
//   metrics.increment('analytics_js.invoke.error', [
//     ...tags,
//     `wk:${embeddedWriteKey()}`,
//   ])
// }
// function onError(err?: unknown) {
//   console.error('[analytics.js]', 'Failed to load Analytics.js', err)
//   sendErrorMetrics([
//     'type:initialization',
//     ...(err instanceof Error
//       ? [`message:${err?.message}`, `name:${err?.name}`]
//       : []),
//   ])
// }
// document.addEventListener('securitypolicyviolation', (e) => {
//   if (ajsIdentifiedCSP || !isAnalyticsCSPError(e)) {
//     return
//   }
//   ajsIdentifiedCSP = true
//   sendErrorMetrics(['type:csp'])
//   loadAjsClassicFallback().catch(console.error)
// })
// /**
//  * Attempts to run a promise and catch both sync and async errors.
//  **/
// async function attempt<T>(promise: () => Promise<T>) {
//   try {
//     const result = await promise()
//     return result
//   } catch (err) {
//     onError(err)
//   }
// }
// attempt(install)
(0,_standalone_analytics__WEBPACK_IMPORTED_MODULE_1__.install)();

}();
window.AnalyticsNext = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=standalone.js.map