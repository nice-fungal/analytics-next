/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 564:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isodate = __webpack_require__(264);

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

/***/ 174:
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

/***/ 264:
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

/***/ 285:
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

/***/ 870:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isodate = __webpack_require__(264);
var milliseconds = __webpack_require__(228);
var seconds = __webpack_require__(76);

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

/***/ 228:
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

/***/ 76:
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/lib/version-type.ts
// Default value will be updated to 'web' in `bundle-umd.ts` for web build.
let _version = 'npm';
function setVersionType(version) {
    _version = version;
}
function getVersionType() {
    return _version;
}

;// CONCATENATED MODULE: ./src/lib/global-analytics-helper.ts
/**
 * Stores the global window analytics key
 */
let _globalAnalyticsKey = 'analytics';
/**
 * Gets the global analytics/buffer
 * @param key name of the window property where the buffer is stored (default: analytics)
 * @returns AnalyticsSnippet
 */
function getGlobalAnalytics() {
    return window[_globalAnalyticsKey];
}
/**
 * Replaces the global window key for the analytics/buffer object
 * @param key key name
 */
function setGlobalAnalyticsKey(key) {
    _globalAnalyticsKey = key;
}
/**
 * Sets the global analytics object
 * @param analytics analytics snippet
 */
function setGlobalAnalytics(analytics) {
    ;
    window[_globalAnalyticsKey] = analytics;
}

;// CONCATENATED MODULE: ./src/lib/parse-cdn.ts

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
let _globalCDN; // set globalCDN as in-memory singleton
const getGlobalCDNUrl = () => {
    var _a;
    const result = _globalCDN !== null && _globalCDN !== void 0 ? _globalCDN : (_a = getGlobalAnalytics()) === null || _a === void 0 ? void 0 : _a._cdn;
    return result;
};
const setGlobalCDNUrl = (cdn) => {
    const globalAnalytics = getGlobalAnalytics();
    if (globalAnalytics) {
        globalAnalytics._cdn = cdn;
    }
    _globalCDN = cdn;
};
const getCDN = () => {
    const globalCdnUrl = getGlobalCDNUrl();
    if (globalCdnUrl)
        return globalCdnUrl;
    // const cdnFromScriptTag = getCDNUrlFromScriptTag()
    // if (cdnFromScriptTag) {
    //   return cdnFromScriptTag
    // } else {
    //   // it's possible that the CDN is not found in the page because:
    //   // - the script is loaded through a proxy
    //   // - the script is removed after execution
    //   // in this case, we fall back to the default Segment CDN
    return `https://cdn.segment.com`;
    // }
};
// export const getNextIntegrationsURL = () => {
//   const cdn = getCDN()
//   return `${cdn}/next-integrations`
// }
/**
 * Replaces the CDN URL in the script tag with the one from Analytics.js 1.0
 *
 * @returns the path to Analytics JS 1.0
 **/
// export function getLegacyAJSPath(): string {
//   const writeKey = embeddedWriteKey() ?? getGlobalAnalytics()?._writeKey
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

;// CONCATENATED MODULE: ../core/dist/esm/validation/helpers.js
function helpers_isString(obj) {
    return typeof obj === 'string';
}
function helpers_isNumber(obj) {
    return typeof obj === 'number';
}
function helpers_isFunction(obj) {
    return typeof obj === 'function';
}
function helpers_exists(val) {
    return val !== undefined && val !== null;
}
function helpers_isPlainObject(obj) {
    return (Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === 'object');
}
//# sourceMappingURL=helpers.js.map
;// CONCATENATED MODULE: ./src/core/arguments-resolver/index.ts

/**
 * Helper for the track method
 */
function resolveArguments(eventName, properties, options, callback) {
    var _a;
    const args = [eventName, properties, options, callback];
    const name = helpers_isPlainObject(eventName) ? eventName.event : eventName;
    if (!name || !helpers_isString(name)) {
        throw new Error('Event missing');
    }
    const data = helpers_isPlainObject(eventName)
        ? (_a = eventName.properties) !== null && _a !== void 0 ? _a : {}
        : helpers_isPlainObject(properties)
            ? properties
            : {};
    let opts = {};
    if (!helpers_isFunction(options)) {
        opts = options !== null && options !== void 0 ? options : {};
    }
    if (helpers_isPlainObject(eventName) && !helpers_isFunction(properties)) {
        opts = properties !== null && properties !== void 0 ? properties : {};
    }
    const cb = args.find(helpers_isFunction);
    return [name, data, opts, cb];
}
/**
 * Helper for page, screen methods
 */
function resolvePageArguments(category, name, properties, options, callback) {
    var _a, _b;
    let resolvedCategory = null;
    let resolvedName = null;
    const args = [category, name, properties, options, callback];
    const strings = args.filter(helpers_isString);
    if (strings[0] !== undefined && strings[1] !== undefined) {
        resolvedCategory = strings[0];
        resolvedName = strings[1];
    }
    if (strings.length === 1) {
        resolvedCategory = null;
        resolvedName = strings[0];
    }
    const resolvedCallback = args.find(helpers_isFunction);
    const objects = args.filter((obj) => {
        if (resolvedName === null) {
            return helpers_isPlainObject(obj);
        }
        return helpers_isPlainObject(obj) || obj === null;
    });
    const resolvedProperties = ((_a = objects[0]) !== null && _a !== void 0 ? _a : {});
    const resolvedOptions = ((_b = objects[1]) !== null && _b !== void 0 ? _b : {});
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
const resolveUserArguments = (user) => {
    return (...args) => {
        var _a, _b, _c;
        const values = {};
        // It's a stack so it's reversed so that we go through each of the expected arguments
        const orderStack = [
            'callback',
            'options',
            'traits',
            'id',
        ];
        // Read each argument and eval the possible values here
        for (const arg of args) {
            let current = orderStack.pop();
            if (current === 'id') {
                if (isString(arg) || isNumber(arg)) {
                    values.id = arg.toString();
                    continue;
                }
                if (arg === null || arg === undefined) {
                    continue;
                }
                // First argument should always be the id, if it is not a valid value we can skip it
                current = orderStack.pop();
            }
            // Traits and Options
            if ((current === 'traits' || current === 'options') &&
                (arg === null || arg === undefined || isPlainObject(arg))) {
                values[current] = arg;
            }
            // Callback
            if (isFunction(arg)) {
                values.callback = arg;
                break; // This is always the last argument
            }
        }
        return [
            (_a = values.id) !== null && _a !== void 0 ? _a : user.id(),
            ((_b = values.traits) !== null && _b !== void 0 ? _b : {}),
            (_c = values.options) !== null && _c !== void 0 ? _c : {},
            values.callback,
        ];
    };
};

;// CONCATENATED MODULE: ./src/core/connection/index.ts
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

;// CONCATENATED MODULE: ../../node_modules/@lukeed/uuid/dist/index.mjs
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

;// CONCATENATED MODULE: ../../node_modules/dset/dist/index.mjs
function dset(obj, keys, val) {
	keys.split && (keys=keys.split('.'));
	var i=0, l=keys.length, t=obj, x, k;
	while (i < l) {
		k = ''+keys[i++];
		if (k === '__proto__' || k === 'constructor' || k === 'prototype') break;
		t = t[k] = (i === l) ? val : (typeof(x=t[k])===typeof(keys)) ? x : (keys[i]*0 !== 0 || !!~(''+keys[i]).indexOf('.')) ? {} : [];
	}
}

;// CONCATENATED MODULE: ../core/dist/esm/context/index.js


class context_ContextCancelation {
    constructor(options) {
        var _a, _b, _c;
        this.retry = (_a = options.retry) !== null && _a !== void 0 ? _a : true;
        this.type = (_b = options.type) !== null && _b !== void 0 ? _b : 'plugin Error';
        this.reason = (_c = options.reason) !== null && _c !== void 0 ? _c : '';
    }
}
class CoreContext {
    constructor(event, id = v4(), 
    // @ts-ignore
    stats = 'new NullStats()', logger = 'new CoreLogger()') {
        this.attempts = 0;
        this.event = event;
        this._id = id;
        // @ts-ignore
        this.logger = logger;
        this.stats = stats;
    }
    static system() {
        // This should be overridden by the subclass to return an instance of the subclass.
    }
    isSame(other) {
        return other.id === this.id;
    }
    cancel(error) {
        if (error) {
            throw error;
        }
        throw new context_ContextCancelation({ reason: 'Context Cancel' });
    }
    log(level, message, extras) {
        this.logger.log(level, message, extras);
    }
    get id() {
        return this._id;
    }
    updateEvent(path, val) {
        var _a;
        // Don't allow integrations that are set to false to be overwritten with integration settings.
        if (path.split('.')[0] === 'integrations') {
            const integrationName = path.split('.')[1];
            if (((_a = this.event.integrations) === null || _a === void 0 ? void 0 : _a[integrationName]) === false) {
                return this.event;
            }
        }
        dset(this.event, path, val);
        return this.event;
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
        this.logger.flush();
        this.stats.flush();
    }
    toJSON() {
        return {
            id: this._id,
            event: this.event,
            logs: this.logger.logs,
            metrics: this.stats.metrics,
        };
    }
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./src/core/context/index.ts

// import { Stats } from '../stats'
class Context extends CoreContext {
    static system() {
        return new this({ type: 'track', event: 'system' });
    }
    constructor(event, id) {
        // @ts-ignore
        super(event, id, 'new Stats()');
    }
}


;// CONCATENATED MODULE: ../core/dist/esm/callback/index.js
function pTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(Error('Promise timed out'));
        }, timeout);
        promise
            .then((val) => {
            clearTimeout(timeoutId);
            return resolve(val);
        })
            .catch(reject);
    });
}
function sleep(timeoutInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeoutInMs));
}
/**
 * @param ctx
 * @param callback - the function to invoke
 * @param delay - aka "timeout". The amount of time in ms to wait before invoking the callback.
 */
function invokeCallback(ctx, callback, delay) {
    const cb = () => {
        try {
            return Promise.resolve(callback(ctx));
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    return (sleep(delay)
        // pTimeout ensures that the callback can't cause the context to hang
        .then(() => pTimeout(cb(), 1000))
        .catch((err) => {
        ctx === null || ctx === void 0 ? void 0 : ctx.log('warn', 'Callback Error', { error: err });
        ctx === null || ctx === void 0 ? void 0 : ctx.stats.increment('callback_error');
    })
        .then(() => ctx));
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ../core/dist/esm/analytics/dispatch.js

/* The amount of time in ms to wait before invoking the callback. */
const getDelay = (startTimeInEpochMS, timeoutInMS) => {
    const elapsedTime = Date.now() - startTimeInEpochMS;
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
async function dispatch(ctx, queue, emitter, options) {
    emitter.emit('dispatch_start', ctx);
    const startTime = Date.now();
    let dispatched;
    if (queue.isEmpty()) {
        dispatched = await queue.dispatchSingle(ctx);
    }
    else {
        dispatched = await queue.dispatch(ctx);
    }
    if (options === null || options === void 0 ? void 0 : options.callback) {
        dispatched = await invokeCallback(dispatched, options.callback, getDelay(startTime, options.timeout));
    }
    if (options === null || options === void 0 ? void 0 : options.debug) {
        dispatched.flush();
    }
    return dispatched;
}
//# sourceMappingURL=dispatch.js.map
;// CONCATENATED MODULE: ../generic-utils/dist/esm/emitter/emitter.js
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
class Emitter {
    constructor(options) {
        var _a;
        this.callbacks = {};
        this.warned = false;
        this.maxListeners = (_a = options === null || options === void 0 ? void 0 : options.maxListeners) !== null && _a !== void 0 ? _a : 10;
    }
    warnIfPossibleMemoryLeak(event) {
        if (this.warned) {
            return;
        }
        if (this.maxListeners &&
            this.callbacks[event].length > this.maxListeners) {
            console.warn(`Event Emitter: Possible memory leak detected; ${String(event)} has exceeded ${this.maxListeners} listeners.`);
            this.warned = true;
        }
    }
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [callback];
        }
        else {
            this.callbacks[event].push(callback);
            this.warnIfPossibleMemoryLeak(event);
        }
        return this;
    }
    once(event, callback) {
        const on = (...args) => {
            this.off(event, on);
            callback.apply(this, args);
        };
        this.on(event, on);
        return this;
    }
    off(event, callback) {
        var _a;
        const fns = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        const without = fns.filter((fn) => fn !== callback);
        this.callbacks[event] = without;
        return this;
    }
    emit(event, ...args) {
        var _a;
        const callbacks = (_a = this.callbacks[event]) !== null && _a !== void 0 ? _a : [];
        callbacks.forEach((callback) => {
            callback.apply(this, args);
        });
        return this;
    }
}
//# sourceMappingURL=emitter.js.map
;// CONCATENATED MODULE: ./src/lib/pick.ts
/**
 * @example
 * pick({ 'a': 1, 'b': '2', 'c': 3 }, ['a', 'c'])
 * => { 'a': 1, 'c': 3 }
 */
function pick(object, keys) {
    return Object.assign({}, ...keys.map((key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            return { [key]: object[key] };
        }
    }));
}

;// CONCATENATED MODULE: ./src/core/page/get-page-context.ts

const BufferedPageContextDiscriminant = 'bpc';
/**
 * `BufferedPageContext` object builder
 */
const createBufferedPageContext = (url, canonicalUrl, search, path, title, referrer) => ({
    __t: BufferedPageContextDiscriminant,
    c: canonicalUrl,
    p: path,
    u: url,
    s: search,
    t: title,
    r: referrer,
});
// my clever/dubious way of making sure this type guard does not get out sync with the type definition
const BUFFERED_PAGE_CONTEXT_KEYS = Object.keys(createBufferedPageContext('', '', '', '', '', ''));
function isBufferedPageContext(bufferedPageCtx) {
    if (!helpers_isPlainObject(bufferedPageCtx))
        return false;
    if (bufferedPageCtx.__t !== BufferedPageContextDiscriminant)
        return false;
    // ensure obj has all the keys we expect, and none we don't.
    for (const k in bufferedPageCtx) {
        if (!BUFFERED_PAGE_CONTEXT_KEYS.includes(k)) {
            return false;
        }
    }
    return true;
}
//  Legacy logic: we are we appending search parameters to the canonical URL -- I guess the canonical URL is  "not canonical enough" (lol)
const createCanonicalURL = (canonicalUrl, searchParams) => {
    return canonicalUrl.indexOf('?') > -1
        ? canonicalUrl
        : canonicalUrl + searchParams;
};
/**
 * Strips hash from URL.
 * http://www.segment.local#test -> http://www.segment.local
 */
const removeHash = (href) => {
    const hashIdx = href.indexOf('#');
    return hashIdx === -1 ? href : href.slice(0, hashIdx);
};
const parseCanonicalPath = (canonicalUrl) => {
    try {
        return new URL(canonicalUrl).pathname;
    }
    catch (_e) {
        // this is classic behavior -- we assume that if the canonical URL is invalid, it's a raw path.
        return canonicalUrl[0] === '/' ? canonicalUrl : '/' + canonicalUrl;
    }
};
/**
 * Create a `PageContext` from a `BufferedPageContext`.
 * `BufferedPageContext` keys are minified to save bytes in the snippet.
 */
const createPageContext = ({ c: canonicalUrl, p: pathname, s: search, u: url, r: referrer, t: title, }) => {
    const newPath = canonicalUrl ? parseCanonicalPath(canonicalUrl) : pathname;
    const newUrl = canonicalUrl
        ? createCanonicalURL(canonicalUrl, search)
        : removeHash(url);
    return {
        path: newPath,
        referrer,
        search,
        title,
        url: newUrl,
    };
};
/**
 * Get page properties from the browser window/document.
 */
const getDefaultBufferedPageContext = () => {
    const c = document.querySelector("link[rel='canonical']");
    return createBufferedPageContext(location.href, (c && c.getAttribute('href')) || undefined, location.search, location.pathname, document.title, document.referrer);
};
/**
 * Get page properties from the browser window/document.
 */
const getDefaultPageContext = () => createPageContext(getDefaultBufferedPageContext());

;// CONCATENATED MODULE: ./src/core/page/add-page-context.ts


/**
 * Augments a segment event with information about the current page.
 * Page information like URL changes frequently, so this is meant to be captured as close to the event call as possible.
 * Things like `userAgent` do not change, so they can be added later in the flow.
 * We prefer not to add this information to this function, as it increases the main bundle size.
 */
const addPageContext = (event, pageCtx = getDefaultPageContext()) => {
    const evtCtx = event.context; // Context should be set earlier in the flow
    let pageContextFromEventProps;
    if (event.type === 'page') {
        pageContextFromEventProps =
            event.properties && pick(event.properties, Object.keys(pageCtx));
        event.properties = Object.assign(Object.assign(Object.assign({}, pageCtx), event.properties), (event.name ? { name: event.name } : {}));
    }
    evtCtx.page = Object.assign(Object.assign(Object.assign({}, pageCtx), pageContextFromEventProps), evtCtx.page);
};

;// CONCATENATED MODULE: ../../node_modules/tslib/tslib.es6.js
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

;// CONCATENATED MODULE: ../core/dist/esm/utils/pick.js
const pickBy = (obj, fn) => {
    return Object.keys(obj)
        .filter((k) => fn(k, obj[k]))
        .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
};
//# sourceMappingURL=pick.js.map
;// CONCATENATED MODULE: ../core/dist/esm/validation/errors.js
class errors_ValidationError extends Error {
    constructor(field, message) {
        super(`${field} ${message}`);
        this.field = field;
    }
}
//# sourceMappingURL=errors.js.map
;// CONCATENATED MODULE: ../core/dist/esm/validation/assertions.js


const stringError = 'is not a string';
const objError = 'is not an object';
const nilError = 'is nil';
// user identity check could hypothetically could be used in the browser event factory, but not 100% sure -- so this is node only for now
function assertUserIdentity(event) {
    const USER_FIELD_NAME = '.userId/anonymousId/previousId/groupId';
    const getAnyUserId = (event) => { var _a, _b, _c; return (_c = (_b = (_a = event.userId) !== null && _a !== void 0 ? _a : event.anonymousId) !== null && _b !== void 0 ? _b : event.groupId) !== null && _c !== void 0 ? _c : event.previousId; };
    const id = getAnyUserId(event);
    if (!exists(id)) {
        throw new ValidationError(USER_FIELD_NAME, nilError);
    }
    else if (!isString(id)) {
        throw new ValidationError(USER_FIELD_NAME, stringError);
    }
}
function assertEventExists(event) {
    if (!helpers_exists(event)) {
        throw new errors_ValidationError('Event', nilError);
    }
    if (typeof event !== 'object') {
        throw new errors_ValidationError('Event', objError);
    }
}
function assertEventType(event) {
    if (!helpers_isString(event.type)) {
        throw new errors_ValidationError('.type', stringError);
    }
}
function assertTrackEventName(event) {
    if (!helpers_isString(event.event)) {
        throw new errors_ValidationError('.event', stringError);
    }
}
function assertTrackEventProperties(event) {
    if (!helpers_isPlainObject(event.properties)) {
        throw new errors_ValidationError('.properties', objError);
    }
}
function assertTraits(event) {
    if (!helpers_isPlainObject(event.traits)) {
        throw new errors_ValidationError('.traits', objError);
    }
}
function assertMessageId(event) {
    if (!helpers_isString(event.messageId)) {
        throw new errors_ValidationError('.messageId', stringError);
    }
}
function validateEvent(event) {
    assertEventExists(event);
    assertEventType(event);
    assertMessageId(event);
    if (event.type === 'track') {
        assertTrackEventName(event);
        assertTrackEventProperties(event);
    }
    if (['group', 'identify'].includes(event.type)) {
        assertTraits(event);
    }
}
//# sourceMappingURL=assertions.js.map
;// CONCATENATED MODULE: ../core/dist/esm/events/index.js





/**
 * Internal settings object that is used internally by the factory
 */
class InternalEventFactorySettings {
    constructor(settings) {
        var _a, _b;
        this.settings = settings;
        this.createMessageId = settings.createMessageId;
        this.onEventMethodCall = (_a = settings.onEventMethodCall) !== null && _a !== void 0 ? _a : (() => { });
        this.onFinishedEvent = (_b = settings.onFinishedEvent) !== null && _b !== void 0 ? _b : (() => { });
    }
}
class CoreEventFactory {
    constructor(settings) {
        this.settings = new InternalEventFactorySettings(settings);
    }
    track(event, properties, options, globalIntegrations) {
        this.settings.onEventMethodCall({ type: 'track', options });
        return this.normalize(Object.assign(Object.assign({}, this.baseEvent()), { event, type: 'track', properties: properties !== null && properties !== void 0 ? properties : {}, options: Object.assign({}, options), integrations: Object.assign({}, globalIntegrations) }));
    }
    page(category, page, properties, options, globalIntegrations) {
        var _a;
        this.settings.onEventMethodCall({ type: 'page', options });
        const event = {
            type: 'page',
            properties: Object.assign({}, properties),
            options: Object.assign({}, options),
            integrations: Object.assign({}, globalIntegrations),
        };
        if (category !== null) {
            event.category = category;
            event.properties = (_a = event.properties) !== null && _a !== void 0 ? _a : {};
            event.properties.category = category;
        }
        if (page !== null) {
            event.name = page;
        }
        return this.normalize(Object.assign(Object.assign({}, this.baseEvent()), event));
    }
    // screen(
    //   category: string | null,
    //   screen: string | null,
    //   properties?: EventProperties,
    //   options?: CoreOptions,
    //   globalIntegrations?: Integrations
    // ): CoreSegmentEvent {
    //   this.settings.onEventMethodCall({ type: 'screen', options })
    //   const event: CoreSegmentEvent = {
    //     type: 'screen',
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
    //   })
    // }
    // identify(
    //   userId: ID,
    //   traits?: UserTraits,
    //   options?: CoreOptions,
    //   globalIntegrations?: Integrations
    // ): CoreSegmentEvent {
    //   this.settings.onEventMethodCall({ type: 'identify', options })
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     type: 'identify',
    //     userId,
    //     traits: traits ?? {},
    //     options: { ...options },
    //     integrations: globalIntegrations,
    //   })
    // }
    // group(
    //   groupId: ID,
    //   traits?: GroupTraits,
    //   options?: CoreOptions,
    //   globalIntegrations?: Integrations
    // ): CoreSegmentEvent {
    //   this.settings.onEventMethodCall({ type: 'group', options })
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     type: 'group',
    //     traits: traits ?? {},
    //     options: { ...options }, // this spreading is intentional
    //     integrations: { ...globalIntegrations }, //
    //     groupId,
    //   })
    // }
    // alias(
    //   to: string,
    //   from: string | null, // TODO: can we make this undefined?
    //   options?: CoreOptions,
    //   globalIntegrations?: Integrations
    // ): CoreSegmentEvent {
    //   this.settings.onEventMethodCall({ type: 'alias', options })
    //   const base: CoreSegmentEvent = {
    //     userId: to,
    //     type: 'alias',
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
    //     })
    //   }
    //   return this.normalize({
    //     ...this.baseEvent(),
    //     ...base,
    //   })
    // }
    baseEvent() {
        return {
            integrations: {},
            options: {},
        };
    }
    /**
     * Builds the context part of an event based on "foreign" keys that
     * are provided in the `Options` parameter for an Event
     */
    context(options) {
        var _a;
        /**
         * If the event options are known keys from this list, we move them to the top level of the event.
         * Any other options are moved to context.
         */
        const eventOverrideKeys = [
            'userId',
            'anonymousId',
            'timestamp',
            'messageId',
        ];
        delete options['integrations'];
        const providedOptionsKeys = Object.keys(options);
        const context = (_a = options.context) !== null && _a !== void 0 ? _a : {};
        const eventOverrides = {};
        providedOptionsKeys.forEach((key) => {
            if (key === 'context') {
                return;
            }
            if (eventOverrideKeys.includes(key)) {
                dset(eventOverrides, key, options[key]);
            }
            else {
                dset(context, key, options[key]);
            }
        });
        return [context, eventOverrides];
    }
    normalize(event) {
        var _a, _b;
        const integrationBooleans = Object.keys((_a = event.integrations) !== null && _a !== void 0 ? _a : {}).reduce((integrationNames, name) => {
            var _a;
            return Object.assign(Object.assign({}, integrationNames), { [name]: Boolean((_a = event.integrations) === null || _a === void 0 ? void 0 : _a[name]) });
        }, {});
        // filter out any undefined options
        event.options = pickBy(event.options || {}, (_, value) => {
            return value !== undefined;
        });
        // This is pretty trippy, but here's what's going on:
        // - a) We don't pass initial integration options as part of the event, only if they're true or false
        // - b) We do accept per integration overrides (like integrations.Amplitude.sessionId) at the event level
        // Hence the need to convert base integration options to booleans, but maintain per event integration overrides
        const allIntegrations = Object.assign(Object.assign({}, integrationBooleans), (_b = event.options) === null || _b === void 0 ? void 0 : _b.integrations);
        const [context, overrides] = event.options
            ? this.context(event.options)
            : [];
        const { options } = event, rest = __rest(event, ["options"]);
        const evt = Object.assign(Object.assign(Object.assign(Object.assign({ timestamp: new Date() }, rest), { context, integrations: allIntegrations }), overrides), { messageId: options.messageId || this.settings.createMessageId() });
        this.settings.onFinishedEvent(evt);
        validateEvent(evt);
        return evt;
    }
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./src/core/events/index.ts




class EventFactory extends CoreEventFactory {
    constructor(user) {
        super({
            createMessageId: () => `ajs-next-${Date.now()}-${v4()}`,
            onEventMethodCall: ({ options }) => {
                this.maybeUpdateAnonId(options);
            },
            onFinishedEvent: (event) => {
                this.addIdentity(event);
                return event;
            },
        });
        this.user = user;
    }
    /**
     * Updates the anonymousId *globally* if it's provided in the options.
     * This should generally be done in the identify method, but some customers rely on this.
     */
    maybeUpdateAnonId(options) {
        (options === null || options === void 0 ? void 0 : options.anonymousId) && this.user.anonymousId(options.anonymousId);
    }
    /**
     * add user id / anonymous id to the event
     */
    addIdentity(event) {
        if (this.user.id()) {
            event.userId = this.user.id();
        }
        if (this.user.anonymousId()) {
            event.anonymousId = this.user.anonymousId();
        }
    }
    track(event, properties, options, globalIntegrations, pageCtx) {
        const ev = super.track(event, properties, options, globalIntegrations);
        addPageContext(ev, pageCtx);
        return ev;
    }
    page(category, page, properties, options, globalIntegrations, pageCtx) {
        const ev = super.page(category, page, properties, options, globalIntegrations);
        addPageContext(ev, pageCtx);
        return ev;
    }
}

;// CONCATENATED MODULE: ../core/dist/esm/priority-queue/backoff.js
function backoff(params) {
    const random = Math.random() + 1;
    const { minTimeout = 500, factor = 2, attempt, maxTimeout = Infinity, } = params;
    return Math.min(random * minTimeout * Math.pow(factor, attempt), maxTimeout);
}
//# sourceMappingURL=backoff.js.map
;// CONCATENATED MODULE: ../core/dist/esm/priority-queue/index.js


/**
 * @internal
 */
const ON_REMOVE_FROM_FUTURE = 'onRemoveFromFuture';
class PriorityQueue extends Emitter {
    constructor(maxAttempts, queue, seen) {
        super();
        this.future = [];
        this.maxAttempts = maxAttempts;
        this.queue = queue;
        this.seen = seen !== null && seen !== void 0 ? seen : {};
    }
    push(...items) {
        const accepted = items.map((operation) => {
            const attempts = this.updateAttempts(operation);
            if (attempts > this.maxAttempts || this.includes(operation)) {
                return false;
            }
            this.queue.push(operation);
            return true;
        });
        this.queue = this.queue.sort((a, b) => this.getAttempts(a) - this.getAttempts(b));
        return accepted;
    }
    pushWithBackoff(item, minTimeout = 0) {
        // One immediate retry unless we have a minimum timeout (e.g. for rate limiting)
        if (minTimeout == 0 && this.getAttempts(item) === 0) {
            return this.push(item)[0];
        }
        const attempt = this.updateAttempts(item);
        if (attempt > this.maxAttempts || this.includes(item)) {
            return false;
        }
        let timeout = backoff({ attempt: attempt - 1 });
        if (minTimeout > 0 && timeout < minTimeout) {
            timeout = minTimeout;
        }
        setTimeout(() => {
            this.queue.push(item);
            // remove from future list
            this.future = this.future.filter((f) => f.id !== item.id);
            // Lets listeners know that a 'future' message is now available in the queue
            this.emit(ON_REMOVE_FROM_FUTURE);
        }, timeout);
        this.future.push(item);
        return true;
    }
    getAttempts(item) {
        var _a;
        return (_a = this.seen[item.id]) !== null && _a !== void 0 ? _a : 0;
    }
    updateAttempts(item) {
        this.seen[item.id] = this.getAttempts(item) + 1;
        return this.getAttempts(item);
    }
    includes(item) {
        return (this.queue.includes(item) ||
            this.future.includes(item) ||
            Boolean(this.queue.find((i) => i.id === item.id)) ||
            Boolean(this.future.find((i) => i.id === item.id)));
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
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./src/lib/priority-queue/persisted.ts


// import { isBrowser } from '../../core/environment'
let loc = {
    getItem() { },
    setItem() { },
    removeItem() { },
};
try {
    loc = /* isBrowser() && */ window.localStorage ? window.localStorage : loc;
}
catch (err) {
    console.warn('Unable to access localStorage', err);
}
function persisted(key) {
    const items = loc.getItem(key);
    return (items ? JSON.parse(items) : []).map((p) => new Context(p.event, p.id));
}
function persistItems(key, items) {
    const existing = persisted(key);
    const all = [...items, ...existing];
    const merged = all.reduce((acc, item) => {
        return Object.assign(Object.assign({}, acc), { [item.id]: item });
    }, {});
    loc.setItem(key, JSON.stringify(Object.values(merged)));
}
function seen(key) {
    const stored = loc.getItem(key);
    return stored ? JSON.parse(stored) : {};
}
function persistSeen(key, memory) {
    const stored = seen(key);
    loc.setItem(key, JSON.stringify(Object.assign(Object.assign({}, stored), memory)));
}
function remove(key) {
    loc.removeItem(key);
}
const now = () => new Date().getTime();
function mutex(key, onUnlock, attempt = 0) {
    const lockTimeout = 50;
    const lockKey = `persisted-queue:v1:${key}:lock`;
    const expired = (lock) => new Date().getTime() > lock;
    const rawLock = loc.getItem(lockKey);
    const lock = rawLock ? JSON.parse(rawLock) : null;
    const allowed = lock === null || expired(lock);
    if (allowed) {
        loc.setItem(lockKey, JSON.stringify(now() + lockTimeout));
        onUnlock();
        loc.removeItem(lockKey);
        return;
    }
    if (!allowed && attempt < 3) {
        setTimeout(() => {
            mutex(key, onUnlock, attempt + 1);
        }, lockTimeout);
    }
    else {
        console.error('Unable to retrieve lock');
    }
}
class PersistedPriorityQueue extends PriorityQueue {
    constructor(maxAttempts, key) {
        super(maxAttempts, []);
        const itemsKey = `persisted-queue:v1:${key}:items`;
        const seenKey = `persisted-queue:v1:${key}:seen`;
        let saved = [];
        let lastSeen = {};
        mutex(key, () => {
            try {
                saved = persisted(itemsKey);
                lastSeen = seen(seenKey);
                remove(itemsKey);
                remove(seenKey);
                this.queue = [...saved, ...this.queue];
                this.seen = Object.assign(Object.assign({}, lastSeen), this.seen);
            }
            catch (err) {
                console.error(err);
            }
        });
        window.addEventListener('pagehide', () => {
            // we deliberately want to use the less powerful 'pagehide' API to only persist on events where the analytics instance gets destroyed, and not on tab away.
            if (this.todo > 0) {
                const items = [...this.queue, ...this.future];
                try {
                    mutex(key, () => {
                        persistItems(itemsKey, items);
                        persistSeen(seenKey, this.seen);
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
}

;// CONCATENATED MODULE: ../core/dist/esm/utils/group-by.js
function groupBy(collection, grouper) {
    const results = {};
    collection.forEach((item) => {
        var _a;
        let key = undefined;
        if (typeof grouper === 'string') {
            const suggestedKey = item[grouper];
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
        results[key] = [...((_a = results[key]) !== null && _a !== void 0 ? _a : []), item];
    });
    return results;
}
//# sourceMappingURL=group-by.js.map
;// CONCATENATED MODULE: ../core/dist/esm/utils/is-thenable.js
/**
 *  Check if  thenable
 *  (instanceof Promise doesn't respect realms)
 */
const isThenable = (value) => typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function';
//# sourceMappingURL=is-thenable.js.map
;// CONCATENATED MODULE: ../core/dist/esm/task/task-group.js

const createTaskGroup = () => {
    let taskCompletionPromise;
    let resolvePromise;
    let count = 0;
    return {
        done: () => taskCompletionPromise,
        run: (op) => {
            const returnValue = op();
            if (isThenable(returnValue)) {
                if (++count === 1) {
                    taskCompletionPromise = new Promise((res) => (resolvePromise = res));
                }
                returnValue.finally(() => --count === 0 && resolvePromise());
            }
            return returnValue;
        },
    };
};
//# sourceMappingURL=task-group.js.map
;// CONCATENATED MODULE: ../core/dist/esm/queue/delivery.js

async function tryAsync(fn) {
    try {
        return await fn();
    }
    catch (err) {
        return Promise.reject(err);
    }
}
function attempt(ctx, plugin) {
    // ctx.log('debug', 'plugin', { plugin: plugin.name })
    const start = new Date().getTime();
    const hook = plugin[ctx.event.type];
    if (hook === undefined) {
        return Promise.resolve(ctx);
    }
    const newCtx = tryAsync(() => hook.apply(plugin, [ctx]))
        .then((ctx) => {
        // @ts-ignore unused
        const done = new Date().getTime() - start;
        // ctx.stats.gauge('plugin_time', done, [`plugin:${plugin.name}`])
        return ctx;
    })
        .catch((err) => {
        if (err instanceof context_ContextCancelation &&
            err.type === 'middleware_cancellation') {
            throw err;
        }
        if (err instanceof context_ContextCancelation) {
            // ctx.log('warn', err.type, {
            //   plugin: plugin.name,
            //   error: err,
            // })
            return err;
        }
        // ctx.log('error', 'plugin Error', {
        //   plugin: plugin.name,
        //   error: err,
        // })
        // ctx.stats.increment('plugin_error', 1, [`plugin:${plugin.name}`])
        return err;
    });
    return newCtx;
}
function ensure(ctx, plugin) {
    return attempt(ctx, plugin).then((newContext) => {
        if (newContext instanceof CoreContext) {
            return newContext;
        }
        // ctx.log('debug', 'Context canceled')
        // ctx.stats.increment('context_canceled')
        ctx.cancel(newContext);
    });
}
//# sourceMappingURL=delivery.js.map
;// CONCATENATED MODULE: ../core/dist/esm/queue/event-queue.js






class CoreEventQueue extends Emitter {
    constructor(priorityQueue) {
        super();
        /**
         * All event deliveries get suspended until all the tasks in this task group are complete.
         * For example: a middleware that augments the event object should be loaded safely as a
         * critical task, this way, event queue will wait for it to be ready before sending events.
         *
         * This applies to all the events already in the queue, and the upcoming ones
         */
        this.criticalTasks = createTaskGroup();
        this.plugins = [];
        this.failedInitializations = [];
        this.flushing = false;
        this.queue = priorityQueue;
        this.queue.on(ON_REMOVE_FROM_FUTURE, () => {
            this.scheduleFlush(0);
        });
    }
    async register(ctx, plugin, instance) {
        this.plugins.push(plugin);
        const handleLoadError = (err) => {
            this.failedInitializations.push(plugin.name);
            this.emit('initialization_failure', plugin);
            console.warn(plugin.name, err);
            // ctx.log('warn', 'Failed to load destination', {
            //   plugin: plugin.name,
            //   error: err,
            // })
            // Filter out the failed plugin by excluding it from the list
            this.plugins = this.plugins.filter((p) => p !== plugin);
        };
        if (plugin.type === 'destination' && plugin.name !== 'Segment.io') {
            plugin.load(ctx, instance).catch(handleLoadError);
        }
        else {
            // for non-destinations plugins, we do need to wait for them to load
            // reminder: action destinations can require plugins that are not of type "destination".
            // For example, GA4 loads a type 'before' plugins and addition to a type 'destination' plugin
            try {
                await plugin.load(ctx, instance);
            }
            catch (err) {
                handleLoadError(err);
            }
        }
    }
    // async deregister(
    //   ctx: Ctx,
    //   plugin: CorePlugin<Ctx>,
    //   instance: CoreAnalytics
    // ): Promise<void> {
    //   try {
    //     if (plugin.unload) {
    //       await Promise.resolve(plugin.unload(ctx, instance))
    //     }
    //     this.plugins = this.plugins.filter((p) => p.name !== plugin.name)
    //   } catch (e) {
    //     ctx.log('warn', 'Failed to unload destination', {
    //       plugin: plugin.name,
    //       error: e,
    //     })
    //   }
    // }
    async dispatch(ctx) {
        // ctx.log('debug', 'Dispatching')
        // ctx.stats.increment('message_dispatched')
        this.queue.push(ctx);
        const willDeliver = this.subscribeToDelivery(ctx);
        this.scheduleFlush(0);
        return willDeliver;
    }
    async subscribeToDelivery(ctx) {
        return new Promise((resolve) => {
            const onDeliver = (flushed, delivered) => {
                if (flushed.isSame(ctx)) {
                    this.off('flush', onDeliver);
                    if (delivered) {
                        resolve(flushed);
                    }
                    else {
                        resolve(flushed);
                    }
                }
            };
            this.on('flush', onDeliver);
        });
    }
    async dispatchSingle(ctx) {
        // ctx.log('debug', 'Dispatching')
        // ctx.stats.increment('message_dispatched')
        this.queue.updateAttempts(ctx);
        ctx.attempts = 1;
        return this.deliver(ctx).catch((err) => {
            const accepted = this.enqueuRetry(err, ctx);
            if (!accepted) {
                ctx.setFailedDelivery({ reason: err });
                return ctx;
            }
            return this.subscribeToDelivery(ctx);
        });
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    scheduleFlush(timeout = 500) {
        if (this.flushing) {
            return;
        }
        this.flushing = true;
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.flush().then(() => {
                setTimeout(() => {
                    this.flushing = false;
                    if (this.queue.length) {
                        this.scheduleFlush(0);
                    }
                }, 0);
            });
        }, timeout);
    }
    async deliver(ctx) {
        await this.criticalTasks.done();
        const start = Date.now();
        try {
            ctx = await this.flushOne(ctx);
            // @ts-ignore unused
            const done = Date.now() - start;
            this.emit('delivery_success', ctx);
            // ctx.stats.gauge('delivered', done)
            // ctx.log('debug', 'Delivered', ctx.event)
            return ctx;
        }
        catch (err) {
            const error = err;
            // ctx.log('error', 'Failed to deliver', error)
            this.emit('delivery_failure', ctx, error);
            // ctx.stats.increment('delivery_failed')
            throw err;
        }
    }
    enqueuRetry(err, ctx) {
        const retriable = !(err instanceof context_ContextCancelation) || err.retry;
        if (!retriable) {
            return false;
        }
        return this.queue.pushWithBackoff(ctx);
    }
    async flush() {
        if (this.queue.length === 0) {
            return [];
        }
        let ctx = this.queue.pop();
        if (!ctx) {
            return [];
        }
        ctx.attempts = this.queue.getAttempts(ctx);
        try {
            ctx = await this.deliver(ctx);
            this.emit('flush', ctx, true);
        }
        catch (err) {
            const accepted = this.enqueuRetry(err, ctx);
            if (!accepted) {
                ctx.setFailedDelivery({ reason: err });
                this.emit('flush', ctx, false);
            }
            return [];
        }
        return [ctx];
    }
    isReady() {
        // return this.plugins.every((p) => p.isLoaded())
        // should we wait for every plugin to load?
        return true;
    }
    availableExtensions(denyList) {
        const available = this.plugins.filter((p) => {
            var _a, _b, _c;
            // Only filter out destination plugins or the Segment.io plugin
            if (p.type !== 'destination' && p.name !== 'Segment.io') {
                return true;
            }
            let alternativeNameMatch = undefined;
            (_a = p.alternativeNames) === null || _a === void 0 ? void 0 : _a.forEach((name) => {
                if (denyList[name] !== undefined) {
                    alternativeNameMatch = denyList[name];
                }
            });
            // Explicit integration option takes precedence, `All: false` does not apply to Segment.io
            return ((_c = (_b = denyList[p.name]) !== null && _b !== void 0 ? _b : alternativeNameMatch) !== null && _c !== void 0 ? _c : (p.name === 'Segment.io' ? true : denyList.All) !== false);
        });
        const { before = [], enrichment = [], destination = [], after = [], } = groupBy(available, 'type');
        return {
            before,
            enrichment,
            destinations: destination,
            after,
        };
    }
    async flushOne(ctx) {
        var _a, _b;
        if (!this.isReady()) {
            throw new Error('Not ready');
        }
        if (ctx.attempts > 1) {
            this.emit('delivery_retry', ctx);
        }
        const { before, enrichment } = this.availableExtensions((_a = ctx.event.integrations) !== null && _a !== void 0 ? _a : {});
        for (const beforeWare of before) {
            const temp = await ensure(ctx, beforeWare);
            if (temp instanceof CoreContext) {
                ctx = temp;
            }
            this.emit('message_enriched', ctx, beforeWare);
        }
        for (const enrichmentWare of enrichment) {
            const temp = await attempt(ctx, enrichmentWare);
            if (temp instanceof CoreContext) {
                ctx = temp;
            }
            this.emit('message_enriched', ctx, enrichmentWare);
        }
        // Enrichment and before plugins can re-arrange the deny list dynamically
        // so we need to pluck them at the end
        const { destinations, after } = this.availableExtensions((_b = ctx.event.integrations) !== null && _b !== void 0 ? _b : {});
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                const attempts = destinations.map((destination) => attempt(ctx, destination));
                Promise.all(attempts).then(resolve).catch(reject);
            }, 0);
        });
        // ctx.stats.increment('message_delivered')
        this.emit('message_delivered', ctx);
        const afterCalls = after.map((after) => attempt(ctx, after));
        await Promise.all(afterCalls);
        return ctx;
    }
}
//# sourceMappingURL=event-queue.js.map
;// CONCATENATED MODULE: ./src/core/queue/event-queue.ts



class EventQueue extends CoreEventQueue {
    constructor(nameOrQueue) {
        super(typeof nameOrQueue === 'string'
            ? new PersistedPriorityQueue(4, nameOrQueue)
            : nameOrQueue);
    }
    async flush() {
        if (isOffline())
            return [];
        return super.flush();
    }
}

;// CONCATENATED MODULE: ./src/lib/bind-all.ts
function bindAll(obj) {
    const proto = obj.constructor.prototype;
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== 'constructor') {
            const desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key);
            if (!!desc && typeof desc.value === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    }
    return obj;
}

;// CONCATENATED MODULE: ./src/core/storage/types.ts
const types_StoreType = {
    Cookie: 'cookie',
    LocalStorage: 'localStorage',
    Memory: 'memory',
};

;// CONCATENATED MODULE: ./src/core/storage/universalStorage.ts
// not adding to private method because those method names do not get minified atm, and does not use 'this'
const _logStoreKeyError = (store, action, key, err) => {
    console.warn(`${store.constructor.name}: Can't ${action} key "${key}" | Err: ${err}`);
};
/**
 * Uses multiple storages in a priority list to get/set values in the order they are specified.
 */
class UniversalStorage {
    constructor(stores) {
        this.stores = stores;
    }
    get(key) {
        let val = null;
        for (const store of this.stores) {
            try {
                val = store.get(key);
                if (val !== undefined && val !== null) {
                    return val;
                }
            }
            catch (e) {
                _logStoreKeyError(store, 'get', key, e);
            }
        }
        return null;
    }
    set(key, value) {
        this.stores.forEach((store) => {
            try {
                store.set(key, value);
            }
            catch (e) {
                _logStoreKeyError(store, 'set', key, e);
            }
        });
    }
    clear(key) {
        this.stores.forEach((store) => {
            try {
                store.remove(key);
            }
            catch (e) {
                _logStoreKeyError(store, 'remove', key, e);
            }
        });
    }
    /*
      This is to support few scenarios where:
      - value exist in one of the stores ( as a result of other stores being cleared from browser ) and we want to resync them
      - read values in AJS 1.0 format ( for customers after 1.0 --> 2.0 migration ) and then re-write them in AJS 2.0 format
    */
    getAndSync(key) {
        const val = this.get(key);
        // legacy behavior, getAndSync can change the type of a value from number to string (AJS 1.0 stores numerical values as a number)
        const coercedValue = (typeof val === 'number' ? val.toString() : val);
        this.set(key, coercedValue);
        return coercedValue;
    }
}

;// CONCATENATED MODULE: ./src/core/storage/memoryStorage.ts
/**
 * Data Storage using in memory object
 */
class MemoryStorage {
    constructor() {
        this.cache = {};
    }
    get(key) {
        var _a;
        return ((_a = this.cache[key]) !== null && _a !== void 0 ? _a : null);
    }
    set(key, value) {
        this.cache[key] = value;
    }
    remove(key) {
        delete this.cache[key];
    }
}

;// CONCATENATED MODULE: ./src/core/storage/localStorage.ts
/**
 * Data storage using browser's localStorage
 */
class LocalStorage {
    localStorageWarning(key, state) {
        console.warn(`Unable to access ${key}, localStorage may be ${state}`);
    }
    get(key) {
        var _a;
        try {
            const val = localStorage.getItem(key);
            if (val === null) {
                return null;
            }
            try {
                return (_a = JSON.parse(val)) !== null && _a !== void 0 ? _a : null;
            }
            catch (e) {
                return (val !== null && val !== void 0 ? val : null);
            }
        }
        catch (err) {
            this.localStorageWarning(key, 'unavailable');
            return null;
        }
    }
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (_a) {
            this.localStorageWarning(key, 'full');
        }
    }
    remove(key) {
        try {
            return localStorage.removeItem(key);
        }
        catch (err) {
            this.localStorageWarning(key, 'unavailable');
        }
    }
}

;// CONCATENATED MODULE: ./src/core/storage/settings.ts

function isArrayOfStoreType(s) {
    return (s &&
        s.stores &&
        Array.isArray(s.stores) &&
        s.stores.every((e) => Object.values(StoreType).includes(e)));
}
function isStoreTypeWithSettings(s) {
    return typeof s === 'object' && s.name !== undefined;
}

;// CONCATENATED MODULE: ./src/core/storage/index.ts










/**
 * Creates multiple storage systems from an array of StoreType and options
 * @param args StoreType and options
 * @returns Storage array
 */
function initializeStorages(args) {
    const storages = args.map((s) => {
        let type;
        // let settings
        if (isStoreTypeWithSettings(s)) {
            type = s.name;
            // settings = s.settings
        }
        else {
            type = s;
        }
        switch (type) {
            // case StoreType.Cookie:
            //   return new CookieStorage(settings)
            case types_StoreType.LocalStorage:
                return new LocalStorage();
            case types_StoreType.Memory:
                return new MemoryStorage();
            default:
                throw new Error(`Unknown Store Type: ${s}`);
        }
    });
    return storages;
}
/**
 * Injects the CookieOptions into a the arguments for initializeStorage
 * @param storeTypes list of storeType
 * @param cookieOptions cookie Options
 * @returns arguments for initializeStorage
 */
function applyCookieOptions(storeTypes, cookieOptions) {
    return storeTypes.map((s) => {
        if (cookieOptions && s === StoreType.Cookie) {
            return {
                name: s,
                settings: cookieOptions,
            };
        }
        return s;
    });
}

;// CONCATENATED MODULE: ./src/core/user/index.ts



const defaults = {
    persist: true,
    cookie: {
        key: 'ajs_user_id',
        oldKey: 'ajs_user',
    },
    localStorage: {
        key: 'ajs_user_traits',
    },
};
class User {
    constructor(options = defaults, cookieOptions) {
        var _a, _b, _c, _d;
        this.options = {};
        this.id = (id) => {
            if (this.options.disable) {
                return null;
            }
            const prevId = this.identityStore.getAndSync(this.idKey);
            if (id !== undefined) {
                this.identityStore.set(this.idKey, id);
                const changingIdentity = id !== prevId && prevId !== null && id !== null;
                if (changingIdentity) {
                    this.anonymousId(null);
                }
            }
            const retId = this.identityStore.getAndSync(this.idKey);
            if (retId)
                return retId;
            const retLeg = this.legacyUserStore.get(defaults.cookie.oldKey);
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
        this.anonymousId = (id) => {
            if (this.options.disable) {
                return null;
            }
            if (id === undefined) {
                // const val =
                //   this.identityStore.getAndSync(this.anonKey) ?? this.legacySIO()?.[0]
                const val = this.identityStore.getAndSync(this.anonKey);
                if (val) {
                    return val;
                }
            }
            if (id === null) {
                this.identityStore.set(this.anonKey, null);
                return this.identityStore.getAndSync(this.anonKey);
            }
            this.identityStore.set(this.anonKey, id !== null && id !== void 0 ? id : v4());
            return this.identityStore.getAndSync(this.anonKey);
        };
        this.traits = (traits) => {
            var _a;
            if (this.options.disable) {
                return;
            }
            if (traits === null) {
                traits = {};
            }
            if (traits) {
                this.traitsStore.set(this.traitsKey, traits !== null && traits !== void 0 ? traits : {});
            }
            return (_a = this.traitsStore.get(this.traitsKey)) !== null && _a !== void 0 ? _a : {};
        };
        this.options = Object.assign(Object.assign({}, defaults), options);
        this.cookieOptions = cookieOptions;
        this.idKey = (_b = (_a = options.cookie) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : defaults.cookie.key;
        this.traitsKey = (_d = (_c = options.localStorage) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : defaults.localStorage.key;
        this.anonKey = 'ajs_anonymous_id';
        this.identityStore = this.createStorage(this.options, cookieOptions);
        // using only cookies for legacy user store
        this.legacyUserStore = this.createStorage(this.options, cookieOptions, (s) => s === types_StoreType.Cookie);
        // using only localStorage / memory for traits store
        this.traitsStore = this.createStorage(this.options, cookieOptions, (s) => s !== types_StoreType.Cookie);
        const legacyUser = this.legacyUserStore.get(defaults.cookie.oldKey);
        if (legacyUser && typeof legacyUser === 'object') {
            legacyUser.id && this.id(legacyUser.id);
            legacyUser.traits && this.traits(legacyUser.traits);
        }
        bindAll(this);
    }
    identify(id, traits) {
        if (this.options.disable) {
            return;
        }
        traits = traits !== null && traits !== void 0 ? traits : {};
        const currentId = this.id();
        if (currentId === null || currentId === id) {
            traits = Object.assign(Object.assign({}, this.traits()), traits);
        }
        if (id) {
            this.id(id);
        }
        this.traits(traits);
    }
    logout() {
        this.anonymousId(null);
        this.id(null);
        this.traits({});
    }
    reset() {
        this.logout();
        this.identityStore.clear(this.idKey);
        this.identityStore.clear(this.anonKey);
        this.traitsStore.clear(this.traitsKey);
    }
    load() {
        return new User(this.options, this.cookieOptions);
    }
    save() {
        return true;
    }
    /**
     * Creates the right storage system applying all the user options, cookie options and particular filters
     * @param options UserOptions
     * @param cookieOpts CookieOptions
     * @param filterStores filter function to apply to any StoreTypes (skipped if options specify using a custom storage)
     * @returns a Storage object
     */
    createStorage(options, 
    // @ts-ignore
    cookieOpts, filterStores) {
        let stores = [
            types_StoreType.LocalStorage,
            // StoreType.Cookie,
            types_StoreType.Memory,
        ];
        // If disabled we won't have any storage functionality
        // if (options.disable) {
        //   return new UniversalStorage<T>([])
        // }
        // If persistance is disabled we will always fallback to Memory Storage
        if (!options.persist) {
            return new UniversalStorage([new MemoryStorage()]);
        }
        // if (options.storage !== undefined && options.storage !== null) {
        //   if (isArrayOfStoreType(options.storage)) {
        //     // If the user only specified order of stores we will still apply filters and transformations e.g. not using localStorage if localStorageFallbackDisabled
        //     stores = options.storage.stores
        //   }
        // }
        // Disable LocalStorage
        if (options.localStorageFallbackDisabled) {
            stores = stores.filter((s) => s !== types_StoreType.LocalStorage);
        }
        // Apply Additional filters
        if (filterStores) {
            stores = stores.filter(filterStores);
        }
        return new UniversalStorage(
        // initializeStorages(applyCookieOptions(stores, cookieOpts))
        initializeStorages(stores));
    }
}
User.defaults = defaults;
// const groupDefaults: UserOptions = {
//   persist: true,
//   cookie: {
//     key: 'ajs_group_id',
//   },
//   localStorage: {
//     key: 'ajs_group_properties',
//   },
// }
// export class Group extends User {
//   constructor(options: UserOptions = groupDefaults, cookie?: CookieOptions) {
//     super({ ...groupDefaults, ...options }, cookie)
//     autoBind(this)
//   }
//   anonymousId = (_id?: ID): ID => {
//     return undefined
//   }
// }

;// CONCATENATED MODULE: ./src/lib/is-thenable.ts
/**
 *  Check if  thenable
 *  (instanceof Promise doesn't respect realms)
 */
const is_thenable_isThenable = (value) => typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function';

;// CONCATENATED MODULE: ./src/generated/version.ts
// This file is generated.
const version = '1.74.0';

;// CONCATENATED MODULE: ./src/core/buffer/index.ts





const flushSyncAnalyticsCalls = (name, analytics, buffer) => {
    buffer.getAndRemove(name).forEach((c) => {
        // While the underlying methods are synchronous, the callAnalyticsMethod returns a promise,
        // which normalizes success and error states between async and non-async methods, with no perf penalty.
        callAnalyticsMethod(analytics, c).catch(console.error);
    });
};
const flushAddSourceMiddleware = async (analytics, buffer) => {
    for (const c of buffer.getAndRemove('addSourceMiddleware')) {
        await callAnalyticsMethod(analytics, c).catch(console.error);
    }
};
/**
 *  Flush register plugin
 */
const flushRegister = async (analytics, buffer) => {
    for (const c of buffer.getAndRemove('register')) {
        await callAnalyticsMethod(analytics, c).catch(console.error);
    }
};
const flushOn = flushSyncAnalyticsCalls.bind(undefined, 'on');
const flushSetAnonymousID = flushSyncAnalyticsCalls.bind(undefined, 'setAnonymousId');
const flushAnalyticsCallsInNewTask = (analytics, buffer) => {
    ;
    Object.keys(buffer.calls).forEach((m) => {
        buffer.getAndRemove(m).forEach((c) => {
            // No one remembers why this event loop optimization is/was neccessary. Lost to history.
            setTimeout(() => {
                callAnalyticsMethod(analytics, c).catch(console.error);
            }, 0);
        });
    });
};
const popPageContext = (args) => {
    if (hasBufferedPageContextAsLastArg(args)) {
        const ctx = args.pop();
        return createPageContext(ctx);
    }
};
const hasBufferedPageContextAsLastArg = (args) => {
    const lastArg = args[args.length - 1];
    return isBufferedPageContext(lastArg);
};
/**
 *  Represents a buffered method call that occurred before initialization.
 */
class PreInitMethodCall {
    constructor(method, args, resolve = () => { }, reject = console.error) {
        this.method = method;
        this.resolve = resolve;
        this.reject = reject;
        this.called = false;
        this.args = args;
    }
}
/**
 *  Represents any and all the buffered method calls that occurred before initialization.
 */
class PreInitMethodCallBuffer {
    constructor(...calls) {
        this._callMap = {};
        this.add(...calls);
    }
    /**
     * Pull any buffered method calls from the window object, and use them to hydrate the instance buffer.
     */
    get calls() {
        this._pushSnippetWindowBuffer();
        return this._callMap;
    }
    set calls(calls) {
        this._callMap = calls;
    }
    get(methodName) {
        var _a;
        return ((_a = this.calls[methodName]) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * Get all buffered method calls for a given method name, and clear them from the buffer.
     */
    getAndRemove(methodName) {
        const calls = this.get(methodName);
        this.calls[methodName] = [];
        return calls;
    }
    add(...calls) {
        calls.forEach((call) => {
            const eventsExpectingPageContext = [
                'track',
                // 'screen',
                // 'alias',
                // 'group',
                'page',
                // 'identify',
            ];
            if (eventsExpectingPageContext.includes(call.method) &&
                !hasBufferedPageContextAsLastArg(call.args)) {
                call.args = [...call.args, getDefaultBufferedPageContext()];
            }
            if (this.calls[call.method]) {
                this.calls[call.method].push(call);
            }
            else {
                this.calls[call.method] = [call];
            }
        });
    }
    clear() {
        // clear calls in the global snippet buffered array.
        this._pushSnippetWindowBuffer();
        // clear calls in this instance
        this.calls = {};
    }
    toArray() {
        return [].concat(...Object.values(this.calls));
    }
    /**
     * Fetch the buffered method calls from the window object,
     * normalize them, and use them to hydrate the buffer.
     * This removes existing buffered calls from the window object.
     */
    _pushSnippetWindowBuffer() {
        // if this is the npm version, we don't want to read from the window object.
        // This avoids namespace conflicts if there is a seperate analytics library on the page.
        if (getVersionType() === 'npm') {
            return undefined;
        }
        const wa = getGlobalAnalytics();
        if (!Array.isArray(wa))
            return undefined;
        const buffered = wa.splice(0, wa.length);
        const calls = buffered.map(([methodName, ...args]) => new PreInitMethodCall(methodName, args));
        this.add(...calls);
    }
}
/**
 *  Call method and mark as "called"
 *  This function should never throw an error
 */
async function callAnalyticsMethod(analytics, call) {
    try {
        if (call.called) {
            return undefined;
        }
        call.called = true;
        const result = analytics[call.method](...call.args);
        if (is_thenable_isThenable(result)) {
            // do not defer for non-async methods
            await result;
        }
        call.resolve(result);
    }
    catch (err) {
        call.reject(err);
    }
}
class AnalyticsBuffered {
    constructor(loader) {
        // trackSubmit = this._createMethod('trackSubmit')
        // trackClick = this._createMethod('trackClick')
        // trackLink = this._createMethod('trackLink')
        // pageView = this._createMethod('pageview')
        // identify = this._createMethod('identify')
        // reset = this._createMethod('reset')
        // group = this._createMethod('group') as AnalyticsBrowserCore['group']
        this.track = this._createMethod('track');
        // ready = this._createMethod('ready')
        // alias = this._createMethod('alias')
        // debug = this._createChainableMethod('debug')
        this.page = this._createMethod('page');
        // once = this._createChainableMethod('once')
        // off = this._createChainableMethod('off')
        // on = this._createChainableMethod('on')
        // addSourceMiddleware = this._createMethod('addSourceMiddleware')
        // setAnonymousId = this._createMethod('setAnonymousId')
        // addDestinationMiddleware = this._createMethod('addDestinationMiddleware')
        // screen = this._createMethod('screen')
        this.register = this._createMethod('register');
        // deregister = this._createMethod('deregister')
        // user = this._createMethod('user')
        this.VERSION = version;
        this._preInitBuffer = new PreInitMethodCallBuffer();
        this._promise = loader(this._preInitBuffer);
        this._promise
            .then(([ajs, ctx]) => {
            this.instance = ajs;
            this.ctx = ctx;
        })
            .catch(() => {
            // intentionally do nothing...
            // this result of this promise will be caught by the 'catch' block on this class.
        });
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
            return new Promise((resolve, reject) => {
                this._preInitBuffer.add(new PreInitMethodCall(methodName, args, resolve, reject));
            });
        };
    }
}

;// CONCATENATED MODULE: ./src/core/analytics/index.ts

// import type { FormArgs, LinkArgs } from '../auto-track'









// import { version } from '../../generated/version'


// import { setGlobalAnalytics } from '../../lib/global-analytics-helper'

// const deprecationWarning =
//   'This is being deprecated and will be not be available in future releases of Analytics JS'
// // reference any pre-existing "analytics" object so a user can restore the reference
// const global: any = getGlobal()
// const _analytics = global?.analytics
function createDefaultQueue(name, retryQueue = false, disablePersistance = false) {
    const maxAttempts = retryQueue ? 10 : 1;
    const priorityQueue = disablePersistance
        ? new PriorityQueue(maxAttempts, [])
        : new PersistedPriorityQueue(maxAttempts, name);
    return new EventQueue(priorityQueue);
}
/**
 * The public settings that are set on the analytics instance
 */
class AnalyticsInstanceSettings {
    constructor(settings) {
        var _a;
        /**
         * Auto-track specific timeout setting for legacy purposes.
         */
        this.timeout = 300;
        this.writeKey = settings.writeKey;
        this.cdnSettings = (_a = settings.cdnSettings) !== null && _a !== void 0 ? _a : {
            integrations: {},
            edgeFunction: {},
        };
        this.cdnURL = settings.cdnURL;
    }
}
// /* analytics-classic stubs */
// function _stub(this: never) {
//   console.warn(deprecationWarning)
// }
class Analytics extends Emitter {
    constructor(settings, options) {
        var _a, _b;
        super();
        this._debug = false;
        this.initialized = false;
        this.user = () => {
            return this._user;
        };
        const cookieOptions = options === null || options === void 0 ? void 0 : options.cookie;
        const disablePersistance = (_a = options === null || options === void 0 ? void 0 : options.disableClientPersistence) !== null && _a !== void 0 ? _a : false;
        this.settings = new AnalyticsInstanceSettings(settings);
        this.queue =
            // queue ??
            createDefaultQueue(`${settings.writeKey}:event-queue`, options === null || options === void 0 ? void 0 : options.retryQueue, disablePersistance);
        const storageSetting = options === null || options === void 0 ? void 0 : options.storage;
        this._universalStorage = this.createStore(disablePersistance, storageSetting, cookieOptions);
        this._user =
            // user ??
            new User(Object.assign({ persist: !disablePersistance, storage: options === null || options === void 0 ? void 0 : options.storage }, options === null || options === void 0 ? void 0 : options.user), cookieOptions).load();
        // this._group =
        //   group ??
        //   new Group(
        //     {
        //       persist: !disablePersistance,
        //       storage: options?.storage,
        //       // Any group specific options override everything else
        //       ...options?.group,
        //     },
        //     cookieOptions
        //   ).load()
        this.eventFactory = new EventFactory(this._user);
        this.integrations = (_b = options === null || options === void 0 ? void 0 : options.integrations) !== null && _b !== void 0 ? _b : {};
        this.options = options !== null && options !== void 0 ? options : {};
        bindAll(this);
    }
    /**
     * Creates the storage system based on the settings received
     * @returns Storage
     */
    createStore(disablePersistance, 
    // @ts-ignore unused
    storageSetting, 
    // @ts-ignore unused
    cookieOptions) {
        // DisablePersistance option overrides all, no storage will be used outside of memory even if specified
        if (disablePersistance) {
            return new UniversalStorage([new MemoryStorage()]);
        }
        else {
            // if (storageSetting) {
            //   if (isArrayOfStoreType(storageSetting)) {
            //     // We will create the store with the priority for customer settings
            //     return new UniversalStorage(
            //       initializeStorages(
            //         applyCookieOptions(storageSetting.stores, cookieOptions)
            //       )
            //     )
            //   }
            // }
        }
        // We default to our multi storage with priority
        return new UniversalStorage(initializeStorages([
            types_StoreType.LocalStorage,
            // {
            //   name: StoreType.Cookie,
            //   settings: cookieOptions,
            // },
            // StoreType.Memory,
        ]));
    }
    get storage() {
        return this._universalStorage;
    }
    async track(...args) {
        const pageCtx = popPageContext(args);
        const [name, data, opts, cb] = resolveArguments(...args);
        const segmentEvent = this.eventFactory.track(name, data, opts, this.integrations, pageCtx);
        return this._dispatch(segmentEvent, cb).then((ctx) => {
            this.emit('track', name, ctx.event.properties, ctx.event.options);
            return ctx;
        });
    }
    async page(...args) {
        const pageCtx = popPageContext(args);
        const [category, page, properties, options, callback] = resolvePageArguments(...args);
        const segmentEvent = this.eventFactory.page(category, page, properties, options, this.integrations, pageCtx);
        return this._dispatch(segmentEvent, callback).then((ctx) => {
            this.emit('page', category, page, ctx.event.properties, ctx.event.options);
            return ctx;
        });
    }
    // async identify(...args: IdentifyParams): Promise<DispatchedEvent> {
    //   const pageCtx = popPageContext(args)
    //   const [id, _traits, options, callback] = resolveUserArguments(this._user)(
    //     ...args
    //   )
    //   this._user.identify(id, _traits)
    //   const segmentEvent = this.eventFactory.identify(
    //     this._user.id(),
    //     this._user.traits(),
    //     options,
    //     this.integrations,
    //     pageCtx
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
    //   const pageCtx = popPageContext(args)
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
    //     this.integrations,
    //     pageCtx
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit('group', ctx.event.groupId, ctx.event.traits, ctx.event.options)
    //     return ctx
    //   })
    // }
    // async alias(...args: AliasParams): Promise<DispatchedEvent> {
    //   const pageCtx = popPageContext(args)
    //   const [to, from, options, callback] = resolveAliasArguments(...args)
    //   const segmentEvent = this.eventFactory.alias(
    //     to,
    //     from,
    //     options,
    //     this.integrations,
    //     pageCtx
    //   )
    //   return this._dispatch(segmentEvent, callback).then((ctx) => {
    //     this.emit('alias', to, from, ctx.event.options)
    //     return ctx
    //   })
    // }
    // async screen(...args: PageParams): Promise<DispatchedEvent> {
    //   const pageCtx = popPageContext(args)
    //   const [category, page, properties, options, callback] =
    //     resolvePageArguments(...args)
    //   const segmentEvent = this.eventFactory.screen(
    //     category,
    //     page,
    //     properties,
    //     options,
    //     this.integrations,
    //     pageCtx
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
    async register(...plugins) {
        const ctx = Context.system();
        const registrations = plugins.map((xt) => this.queue.register(ctx, xt, this));
        await Promise.all(registrations);
        return ctx;
    }
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
    debug(toggle) {
        // Make sure legacy ajs debug gets turned off if it was enabled before upgrading.
        if (toggle === false && localStorage.getItem('debug')) {
            localStorage.removeItem('debug');
        }
        this._debug = toggle;
        return this;
    }
    // reset(): void {
    //   this._user.reset()
    //   this._group.reset()
    //   this.emit('reset')
    // }
    timeout(timeout) {
        this.settings.timeout = timeout;
    }
    async _dispatch(event, callback) {
        const ctx = new Context(event);
        if (isOffline() && !this.options.retryQueue) {
            return ctx;
        }
        return dispatch(ctx, this.queue, this, {
            callback,
            debug: this._debug,
            timeout: this.settings.timeout,
        });
    }
    async addSourceMiddleware(fn) {
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
        return this;
    }
    //   /* TODO: This does not have to return a promise? */
    //   addDestinationMiddleware(
    //     integrationName: string,
    //     ...middlewares: DestinationMiddlewareFunction[]
    //   ): Promise<Analytics> {
    //     this.queue.plugins
    //       .filter(isDestinationPluginWithAddMiddleware)
    //       .forEach((p) => {
    //         if (
    //           integrationName === '*' ||
    //           p.name.toLowerCase() === integrationName.toLowerCase()
    //         ) {
    //           p.addMiddleware(...middlewares)
    //         }
    //       })
    //     return Promise.resolve(this)
    //   }
    setAnonymousId(id) {
        return this._user.anonymousId(id);
    }
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
    async ready(callback = (res) => res) {
        return Promise.all(this.queue.plugins.map((i) => (i.ready ? i.ready() : Promise.resolve()))).then((res) => {
            callback(res);
            return res;
        });
    }
}
/**
 * @returns a no-op analytics instance that does not create cookies or localstorage, or send any events to segment.
 */
// export class NullAnalytics extends Analytics {
//   constructor() {
//     super({ writeKey: '' }, { disableClientPersistence: true })
//     this.initialized = true
//   }
// }

;// CONCATENATED MODULE: ./src/lib/merged-options.ts
/**
 * Merge legacy settings and initialized Integration option overrides.
 *
 * This will merge any options that were passed from initialization into
 * overrides for settings that are returned by the Segment CDN.
 *
 * i.e. this allows for passing options directly into destinations from
 * the Analytics constructor.
 */
function mergedOptions(cdnSettings, options) {
    var _a;
    const optionOverrides = Object.entries((_a = options.integrations) !== null && _a !== void 0 ? _a : {}).reduce((overrides, [integration, options]) => {
        if (typeof options === 'object') {
            return Object.assign(Object.assign({}, overrides), { [integration]: options });
        }
        return Object.assign(Object.assign({}, overrides), { [integration]: {} });
    }, {});
    return Object.entries(cdnSettings.integrations).reduce((integrationSettings, [integration, settings]) => {
        return Object.assign(Object.assign({}, integrationSettings), { [integration]: Object.assign(Object.assign({}, settings), optionOverrides[integration]) });
    }, {});
}

;// CONCATENATED MODULE: ../generic-utils/dist/esm/create-deferred/create-deferred.js
/**
 * Return a promise that can be externally resolved
 */
const createDeferred = () => {
    let resolve;
    let reject;
    let settled = false;
    const promise = new Promise((_resolve, _reject) => {
        resolve = (...args) => {
            settled = true;
            _resolve(...args);
        };
        reject = (...args) => {
            settled = true;
            _reject(...args);
        };
    });
    return {
        resolve,
        reject,
        promise,
        isSettled: () => settled,
    };
};
//# sourceMappingURL=create-deferred.js.map
;// CONCATENATED MODULE: ../../node_modules/js-cookie/dist/js.cookie.mjs
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function js_cookie_assign (target) {
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

    attributes = js_cookie_assign({}, defaultAttributes, attributes);

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
          js_cookie_assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, js_cookie_assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(js_cookie_assign({}, this.converter, converter), this.attributes)
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

/* harmony default export */ var js_cookie = (api);

;// CONCATENATED MODULE: ./src/core/user/tld.ts

/**
 * Levels returns all levels of the given url.
 *
 * @param {string} url
 * @return {Array}
 * @api public
 */
function levels(url) {
    const host = url.hostname;
    const parts = host.split('.');
    const last = parts[parts.length - 1];
    const levels = [];
    // Ip address.
    if (parts.length === 4 && parseInt(last, 10) > 0) {
        return levels;
    }
    // Localhost.
    if (parts.length <= 1) {
        return levels;
    }
    // Create levels.
    for (let i = parts.length - 2; i >= 0; --i) {
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
    const parsedUrl = parseUrl(url);
    if (!parsedUrl)
        return;
    const lvls = levels(parsedUrl);
    // Lookup the real top level one.
    for (let i = 0; i < lvls.length; ++i) {
        const cname = '__tld__';
        const domain = lvls[i];
        const opts = { domain: '.' + domain };
        try {
            // cookie access throw an error if the library is ran inside a sandboxed environment (e.g. sandboxed iframe)
            js_cookie.set(cname, '1', opts);
            if (js_cookie.get(cname)) {
                js_cookie.remove(cname, opts);
                return domain;
            }
        }
        catch (_) {
            return;
        }
    }
}

;// CONCATENATED MODULE: ./src/core/query-string/gracefulDecodeURIComponent.ts
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

;// CONCATENATED MODULE: ./src/core/storage/cookieStorage.ts


const ONE_YEAR = 365;
/**
 * Data storage using browser cookies
 */
class CookieStorage {
    static get defaults() {
        return {
            maxage: ONE_YEAR,
            domain: tld(window.location.href),
            path: '/',
            sameSite: 'Lax',
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
            secure: this.options.secure,
        };
    }
    get(key) {
        var _a;
        try {
            const value = js_cookie.get(key);
            if (value === undefined || value === null) {
                return null;
            }
            try {
                return (_a = JSON.parse(value)) !== null && _a !== void 0 ? _a : null;
            }
            catch (e) {
                return (value !== null && value !== void 0 ? value : null);
            }
        }
        catch (e) {
            return null;
        }
    }
    set(key, value) {
        if (typeof value === 'string') {
            js_cookie.set(key, value, this.opts());
        }
        else if (value === null) {
            js_cookie.remove(key, this.opts());
        }
        else {
            js_cookie.set(key, JSON.stringify(value), this.opts());
        }
    }
    remove(key) {
        return js_cookie.remove(key, this.opts());
    }
}

;// CONCATENATED MODULE: ./src/lib/client-hints/index.ts
async function clientHints(hints) {
    const userAgentData = navigator.userAgentData;
    if (!userAgentData)
        return undefined;
    if (!hints)
        return userAgentData.toJSON();
    return userAgentData
        .getHighEntropyValues(hints)
        .catch(() => userAgentData.toJSON());
}

;// CONCATENATED MODULE: ./src/plugins/env-enrichment/index.ts







let cookieOptions;
function getCookieOptions() {
    if (cookieOptions) {
        return cookieOptions;
    }
    const domain = tld(window.location.href);
    cookieOptions = {
        expires: 31536000000,
        secure: false,
        path: '/',
    };
    if (domain) {
        cookieOptions.domain = domain;
    }
    return cookieOptions;
}
function ads(query) {
    const queryIds = {
        btid: 'dataxu',
        urid: 'millennial-media',
    };
    if (query.startsWith('?')) {
        query = query.substring(1);
    }
    query = query.replace(/\?/g, '&');
    const parts = query.split('&');
    for (const part of parts) {
        const [k, v] = part.split('=');
        if (queryIds[k]) {
            return {
                id: v,
                type: queryIds[k],
            };
        }
    }
}
function utm(query) {
    if (query.startsWith('?')) {
        query = query.substring(1);
    }
    query = query.replace(/\?/g, '&');
    return query.split('&').reduce((acc, str) => {
        const [k, v = ''] = str.split('=');
        if (k.includes('utm_') && k.length > 4) {
            let utmParam = k.slice(4);
            if (utmParam === 'campaign') {
                utmParam = 'name';
            }
            acc[utmParam] = gracefulDecodeURIComponent(v);
        }
        return acc;
    }, {});
}
function ampId() {
    const ampId = js_cookie.get('_ga');
    if (ampId && ampId.startsWith('amp')) {
        return ampId;
    }
}
function referrerId(query, ctx, disablePersistance) {
    var _a;
    const storage = new UniversalStorage(disablePersistance ? [] : [new CookieStorage(getCookieOptions())]);
    const stored = storage.get('s:context.referrer');
    const ad = (_a = ads(query)) !== null && _a !== void 0 ? _a : stored;
    if (!ad) {
        return;
    }
    if (ctx) {
        ctx.referrer = Object.assign(Object.assign({}, ctx.referrer), ad);
    }
    storage.set('s:context.referrer', ad);
}
/**
 *
 * @param obj e.g. { foo: 'b', bar: 'd', baz: ['123', '456']}
 * @returns e.g. 'foo=b&bar=d&baz=123&baz=456'
 */
const objectToQueryString = (obj) => {
    try {
        const searchParams = new URLSearchParams();
        Object.entries(obj).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                v.forEach((value) => searchParams.append(k, value));
            }
            else {
                searchParams.append(k, v);
            }
        });
        return searchParams.toString();
    }
    catch (_a) {
        return '';
    }
};
class EnvironmentEnrichmentPlugin {
    constructor() {
        this.name = 'Page Enrichment';
        this.type = 'before';
        this.version = '0.1.0';
        this.isLoaded = () => true;
        this.load = async (_ctx, instance) => {
            this.instance = instance;
            try {
                this.userAgentData = await clientHints(this.instance.options.highEntropyValuesClientHints);
            }
            catch (_) {
                // if client hints API doesn't return anything leave undefined
            }
            return Promise.resolve();
        };
        this.enrich = (ctx) => {
            var _a, _b;
            // Note: Types are off - context should never be undefined here, since it is set as part of event creation.
            const evtCtx = ctx.event.context;
            const search = evtCtx.page.search || '';
            const query = typeof search === 'object' ? objectToQueryString(search) : search;
            evtCtx.userAgent = navigator.userAgent;
            evtCtx.userAgentData = this.userAgentData;
            // @ts-ignore
            const locale = navigator.userLanguage || navigator.language;
            if (typeof evtCtx.locale === 'undefined' && typeof locale !== 'undefined') {
                evtCtx.locale = locale;
            }
            (_a = evtCtx.library) !== null && _a !== void 0 ? _a : (evtCtx.library = {
                name: 'analytics.js',
                version: `${getVersionType() === 'web' ? 'next' : 'npm:next'}-${version}`,
            });
            if (query && !evtCtx.campaign) {
                evtCtx.campaign = utm(query);
            }
            const amp = ampId();
            if (amp) {
                evtCtx.amp = { id: amp };
            }
            referrerId(query, evtCtx, (_b = this.instance.options.disableClientPersistence) !== null && _b !== void 0 ? _b : false);
            try {
                evtCtx.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
            catch (_) {
                // If browser doesn't have support leave timezone undefined
            }
            return ctx;
        };
        this.track = this.enrich;
        this.identify = this.enrich;
        this.page = this.enrich;
        this.group = this.enrich;
        this.alias = this.enrich;
        this.screen = this.enrich;
    }
}
const envEnrichment = new EnvironmentEnrichmentPlugin();

;// CONCATENATED MODULE: ./src/lib/load-script.ts
function findScript(src) {
    const scripts = Array.prototype.slice.call(window.document.querySelectorAll('script'));
    return scripts.find((s) => s.src === src);
}
/**
 * Load a script from a URL and append it to the document.
 */
function loadScript(src, attributes) {
    const found = findScript(src);
    if (found !== undefined) {
        const status = found === null || found === void 0 ? void 0 : found.getAttribute('status');
        if (status === 'loaded') {
            return Promise.resolve(found);
        }
        if (status === 'loading') {
            return new Promise((resolve, reject) => {
                found.addEventListener('load', () => resolve(found));
                found.addEventListener('error', (err) => reject(err));
            });
        }
    }
    return new Promise((resolve, reject) => {
        var _a;
        const script = window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.setAttribute('status', 'loading');
        for (const [k, v] of Object.entries(attributes !== null && attributes !== void 0 ? attributes : {})) {
            script.setAttribute(k, v);
        }
        script.onload = () => {
            script.onerror = script.onload = null;
            script.setAttribute('status', 'loaded');
            resolve(script);
        };
        script.onerror = () => {
            script.onerror = script.onload = null;
            script.setAttribute('status', 'error');
            reject(new Error(`Failed to load ${src}`));
        };
        const firstExistingScript = window.document.querySelector('script');
        if (!firstExistingScript) {
            window.document.head.appendChild(script);
        }
        else {
            (_a = firstExistingScript.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(script, firstExistingScript);
        }
    });
}
function unloadScript(src) {
    const found = findScript(src);
    if (found !== undefined) {
        found.remove();
    }
    return Promise.resolve();
}

;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/clone.js
function clone(properties) {
    if (typeof properties !== 'object')
        return properties;
    if (Object.prototype.toString.call(properties) === '[object Object]') {
        const temp = {};
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                temp[key] = clone(properties[key]);
            }
        }
        return temp;
    }
    else if (Array.isArray(properties)) {
        return properties.map(clone);
    }
    else {
        // this is dangerous because it means this is not cloned
        return properties;
    }
}

// EXTERNAL MODULE: ../../node_modules/new-date/lib/index.js
var lib = __webpack_require__(870);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
// EXTERNAL MODULE: ../../node_modules/@head.js/analytics.js-obj-case/index.js
var analytics_js_obj_case = __webpack_require__(174);
var analytics_js_obj_case_default = /*#__PURE__*/__webpack_require__.n(analytics_js_obj_case);
// EXTERNAL MODULE: ../../node_modules/@head.js/analytics.js-isodate-traverse/lib/index.js
var analytics_js_isodate_traverse_lib = __webpack_require__(564);
var analytics_js_isodate_traverse_lib_default = /*#__PURE__*/__webpack_require__.n(analytics_js_isodate_traverse_lib);
;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/facade.js

// import address from "./address";

// import isEnabled from "./is-enabled";



/**
 * A *Facade* is an object meant for creating convience wrappers around
 * objects. When developing integrations, you probably want to look at its
 * subclasses, such as {@link Track} or {@link Identify}, rather than this
 * general-purpose class.
 *
 * This letructor will initialize a new `Facade` with an `obj` of arguments.
 *
 * If the inputted `obj` doesn't have a `timestamp` property, one will be added
 * with the value `new Date()`. Otherwise, the `timestamp` property will be
 * converted to a Date using the `new-date` package.
 *
 * By default, the inputted object will be defensively copied, and all ISO
 * strings present in the string will be converted into Dates.
 *
 * @param {Object} obj - The object to wrap.
 * @param {Object} opts - Options about what kind of Facade to create.
 * @param {boolean} [opts.clone=true] - Whether to make defensive clones. If enabled,
 * the inputted object will be cloned, and any objects derived from this facade
 * will be cloned before being returned.
 * @param {boolean} [opts.traverse=true] - Whether to perform ISODate-Traverse
 * on the inputted object.
 *
 * @see {@link https://github.com/segmentio/new-date|new-date}
 * @see {@link https://github.com/segmentio/isodate-traverse|isodate-traverse}
 */
function Facade(obj, opts) {
    opts = opts || {};
    this.raw = clone(obj);
    if (!("clone" in opts))
        opts.clone = true;
    if (opts.clone)
        obj = clone(obj);
    if (!("traverse" in opts))
        opts.traverse = true;
    if (!("timestamp" in obj))
        obj.timestamp = new Date();
    else
        obj.timestamp = lib_default()(obj.timestamp);
    if (opts.traverse)
        analytics_js_isodate_traverse_lib_default()(obj);
    this.opts = opts;
    this.obj = obj;
}
const f = Facade.prototype;
/**
 * Get a potentially-nested field in this facade. `field` should be a
 * period-separated sequence of properties.
 *
 * If the first field passed in points to a function (e.g. the `field` passed
 * in is `a.b.c` and this facade's `obj.a` is a function), then that function
 * will be called, and then the deeper fields will be fetched (using obj-case)
 * from what that function returns. If the first field isn't a function, then
 * this function works just like obj-case.
 *
 * Because this function uses obj-case, the camel- or snake-case of the input
 * is irrelevant.
 *
 * @example
 * YourClass.prototype.height = function() {
 *   return this.proxy('getDimensions.height') ||
 *     this.proxy('props.size.side_length');
 * }
 * @param {string} field - A sequence of properties, joined by periods (`.`).
 * @return {*} - A property of the inputted object.
 * @see {@link https://github.com/segmentio/obj-case|obj-case}
 */
f.proxy = function (field) {
    let fields = field.split(".");
    field = fields.shift();
    // Call a function at the beginning to take advantage of facaded fields
    let obj = this[field] || this.obj[field];
    if (!obj)
        return obj;
    if (typeof obj === "function")
        obj = obj.call(this) || {};
    if (fields.length === 0)
        return this.opts.clone ? transform(obj) : obj;
    obj = analytics_js_obj_case_default()(obj, fields.join("."));
    return this.opts.clone ? transform(obj) : obj;
};
/**
 * Directly access a specific `field` from the underlying object. Only
 * "top-level" fields will work with this function. "Nested" fields *will not
 * work* with this function.
 *
 * @param {string} field
 * @return {*}
 */
f.field = function (field) {
    let obj = this.obj[field];
    return this.opts.clone ? transform(obj) : obj;
};
/**
 * Utility method to always proxy a particular `field`. In other words, it
 * returns a function that will always return `this.proxy(field)`.
 *
 * @example
 * MyClass.prototype.height = Facade.proxy('options.dimensions.height');
 *
 * @param {string} field
 * @return {Function}
 */
Facade.proxy = function (field) {
    return function () {
        return this.proxy(field);
    };
};
/**
 * Utility method to always access a `field`. In other words, it returns a
 * function that will always return `this.field(field)`.
 *
 * @param {string} field
 * @return {Function}
 */
Facade.field = function (field) {
    return function () {
        return this.field(field);
    };
};
/**
 * Create a helper function for fetching a "plural" thing.
 *
 * The generated method will take the inputted `path` and append an "s" to it
 * and calls `this.proxy` with this "pluralized" path. If that produces an
 * array, that will be returned. Otherwise, a one-element array containing
 * `this.proxy(path)` will be returned.
 *
 * @example
 * MyClass.prototype.birds = Facade.multi('animals.bird');
 *
 * @param {string} path
 * @return {Function}
 */
Facade.multi = function (path) {
    return function () {
        let multi = this.proxy(path + "s");
        if (Array.isArray(multi))
            return multi;
        let one = this.proxy(path);
        if (one)
            one = [this.opts.clone ? clone(one) : one];
        return one || [];
    };
};
/**
 * Create a helper function for getting a "singular" thing.
 *
 * The generated method will take the inputted path and call
 * `this.proxy(path)`. If a truthy thing is produced, it will be returned.
 * Otherwise, `this.proxy(path + 's')` will be called, and if that produces an
 * array the first element of that array will be returned. Otherwise,
 * `undefined` is returned.
 *
 * @example
 * MyClass.prototype.bird = Facade.one('animals.bird');
 *
 * @param {string} path
 * @return {Function}
 */
Facade.one = function (path) {
    return function () {
        let one = this.proxy(path);
        if (one)
            return one;
        let multi = this.proxy(path + "s");
        if (Array.isArray(multi))
            return multi[0];
    };
};
/**
 * Gets the underlying object this facade wraps around.
 *
 * If this facade has a property `type`, it will be invoked as a function and
 * will be assigned as the property `type` of the outputted object.
 *
 * @return {Object}
 */
f.json = function () {
    let ret = this.opts.clone ? clone(this.obj) : this.obj;
    if (this.type)
        ret.type = this.type();
    return ret;
};
/**
 * Gets a copy of the unmodified input object this facade wraps around.
 *
 * Unlike the `json` method which does make some subtle modifications
 * to datetime values and the `type` property. This method returns a copy of
 * the unmodified input object
 *
 * @return {Object}
 */
f.rawEvent = function () {
    return this.raw;
};
/**
 * Get the options of a call. If an integration is passed, only the options for
 * that integration are included. If the integration is not enabled, then
 * `undefined` is returned.
 *
 * Options are taken from the `options` property of the underlying object,
 * falling back to the object's `context` or simply `{}`.
 *
 * @param {string} integration - The name of the integration to get settings
 * for. Casing does not matter.
 * @return {Object|undefined}
 */
f.options = function (integration) {
    let obj = this.obj.options || this.obj.context || {};
    let options = this.opts.clone ? clone(obj) : obj;
    if (!integration)
        return options;
    if (!this.enabled(integration))
        return;
    let integrations = this.integrations();
    let value = integrations[integration] || analytics_js_obj_case_default()(integrations, integration);
    if (typeof value !== "object")
        value = analytics_js_obj_case_default()(this.options(), integration);
    return typeof value === "object" ? value : {};
};
/**
 * An alias for {@link Facade#options}.
 */
f.context = f.options;
/**
 * Check whether an integration is enabled.
 *
 * Basically, this method checks whether this integration is explicitly
 * enabled. If it isn'texplicitly mentioned, it checks whether it has been
 * enabled at the global level. Some integrations (e.g. Salesforce), cannot
 * enabled by these global event settings.
 *
 * More concretely, the deciding factors here are:
 *
 * 1. If `this.integrations()` has the integration set to `true`, return `true`.
 * 2. If `this.integrations().providers` has the integration set to `true`, return `true`.
 * 3. If integrations are set to default-disabled via global parameters (i.e.
 * `options.providers.all`, `options.all`, or `integrations.all`), then return
 * false.
 * 4. If the integration is one of the special default-deny integrations
 * (currently, only Salesforce), then return false.
 * 5. Else, return true.
 *
 * @param {string} integration
 * @return {boolean}
 */
f.enabled = function (integration) {
    let allEnabled = this.proxy("options.providers.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = this.proxy("options.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = this.proxy("integrations.all");
    if (typeof allEnabled !== "boolean")
        allEnabled = true;
    let enabled = allEnabled /* && isEnabled(integration) */;
    let options = this.integrations();
    // If the integration is explicitly enabled or disabled, use that
    // First, check options.providers for backwards compatibility
    if (options.providers && options.providers.hasOwnProperty(integration)) {
        enabled = options.providers[integration];
    }
    // Next, check for the integration's existence in 'options' to enable it.
    // If the settings are a boolean, use that, otherwise it should be enabled.
    if (options.hasOwnProperty(integration)) {
        let settings = options[integration];
        if (typeof settings === "boolean") {
            enabled = settings;
        }
        else {
            enabled = true;
        }
    }
    return !!enabled;
};
/**
 * Get all `integration` options.
 *
 * @ignore
 * @param {string} integration
 * @return {Object}
 */
f.integrations = function () {
    return (this.obj.integrations || this.proxy("options.providers") || this.options());
};
/**
 * Check whether the user is active.
 *
 * @return {boolean}
 */
f.active = function () {
    let active = this.proxy("options.active");
    if (active === null || active === undefined)
        active = true;
    return active;
};
/**
 * Get `sessionId / anonymousId`.
 *
 * @return {*}
 */
f.anonymousId = function () {
    return this.field("anonymousId") || this.field("sessionId");
};
/**
 * An alias for {@link Facade#anonymousId}.
 *
 * @function
 * @return {string}
 */
f.sessionId = f.anonymousId;
/**
 * Get `groupId` from `context.groupId`.
 *
 * @function
 * @return {string}
 */
f.groupId = Facade.proxy("options.groupId");
/**
 * Get the call's "traits". All event types can pass in traits, though {@link
 * Identify} and {@link Group} override this implementation.
 *
 * Traits are gotten from `options.traits`, augmented with a property `id` with
 * the event's `userId`.
 *
 * The parameter `aliases` is meant to transform keys in `options.traits` into
 * new keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx`
 * in the traits, and move it to `yyy`. If `xxx` is a method of this facade,
 * it'll be called as a function instead of treated as a key into the traits.
 *
 * @example
 * let obj = { options: { traits: { foo: "bar" } }, anonymousId: "xxx" }
 * let facade = new Facade(obj)
 *
 * facade.traits() // { "foo": "bar" }
 * facade.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * facade.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
f.traits = function (aliases) {
    let ret = this.proxy("options.traits") || {};
    let id = this.userId();
    aliases = aliases || {};
    if (id)
        ret.id = id;
    for (const alias in aliases) {
        if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
            const value = this[alias] == null
                ? this.proxy("options.traits." + alias)
                : this[alias]();
            if (value == null)
                continue;
            ret[aliases[alias]] = value;
            delete ret[alias];
        }
    }
    return ret;
};
/**
 * The library and version of the client used to produce the message.
 *
 * If the library name cannot be determined, it is set to `"unknown"`. If the
 * version cannot be determined, it is set to `null`.
 *
 * @return {{name: string, version: string}}
 */
f.library = function () {
    let library = this.proxy("options.library");
    if (!library)
        return { name: "unknown", version: null };
    if (typeof library === "string")
        return { name: library, version: null };
    return library;
};
/**
 * Get the User-Agent from `context.userAgent`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
f.userAgent = Facade.proxy("context.userAgent");
/**
 * Get the timezone from `context.timezone`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
f.timezone = Facade.proxy("context.timezone");
/**
 * Get the timestamp from `context.timestamp`.
 *
 * @function
 * @return string
 */
f.timestamp = Facade.field("timestamp");
/**
 * Get the channel from `channel`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
f.channel = Facade.field("channel");
/**
 * Get the IP address from `context.ip`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
f.ip = Facade.proxy("context.ip");
/**
 * Get the user ID from `userId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return string
 */
f.userId = Facade.field("userId");
/**
 * Get the region from `traits`, `traits.address`, `properties`, or
 * `properties.address`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @name region
 * @function
 * @memberof f
 * @return {string}
 */
// address(f);
/**
 * Return the cloned and traversed object
 *
 * @ignore
 * @param {*} obj
 * @return {*}
 */
function transform(obj) {
    return clone(obj);
}

// EXTERNAL MODULE: ../../node_modules/inherits/inherits_browser.js
var inherits_browser = __webpack_require__(285);
var inherits_browser_default = /*#__PURE__*/__webpack_require__.n(inherits_browser);
;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/is-email.js
const matcher = /.+\@.+\..+/;
function isEmail(string) {
    return matcher.test(string);
}

;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/identify.js






let trim = (str) => str.trim();
/**
 * Initialize a new `Identify` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.userId] - The ID of the user.
 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
 * @param {string} [dictionary.traits] - The user's traits.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Identify(dictionary, opts) {
    Facade.call(this, dictionary, opts);
}
inherits_browser_default()(Identify, Facade);
const i = Identify.prototype;
/**
 * Return the type of facade this is. This will always return `"identify"`.
 *
 * @return {string}
 */
i.action = function () {
    return "identify";
};
/**
 * An alias for {@link Identify#action}.
 *
 * @function
 * @return {string}
 */
i.type = i.action;
/**
 * Get the user's traits. This is identical to how {@link Facade#traits} works,
 * except it looks at `traits.*` instead of `options.traits.*`.
 *
 * Traits are gotten from `traits`, augmented with a property `id` with
 * the event's `userId`.
 *
 * The parameter `aliases` is meant to transform keys in `traits` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * let obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
 * let identify = new Identify(obj)
 *
 * identify.traits() // { "foo": "bar" }
 * identify.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * identify.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
i.traits = function (aliases) {
    let ret = this.field("traits") || {};
    let id = this.userId();
    aliases = aliases || {};
    if (id)
        ret.id = id;
    for (let alias in aliases) {
        let value = this[alias] == null ? this.proxy("traits." + alias) : this[alias]();
        if (value == null)
            continue;
        ret[aliases[alias]] = value;
        if (alias !== aliases[alias])
            delete ret[alias];
    }
    return ret;
};
/**
 * Get the user's email from `traits.email`, falling back to `userId` only if
 * it looks like a valid email.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
i.email = function () {
    let email = this.proxy("traits.email");
    if (email)
        return email;
    let userId = this.userId();
    if (isEmail(userId))
        return userId;
};
/**
 * Get the time of creation of the user from `traits.created` or
 * `traits.createdAt`.
 *
 * @return {Date}
 */
i.created = function () {
    let created = this.proxy("traits.created") || this.proxy("traits.createdAt");
    if (created)
        return lib_default()(created);
};
/**
 * Get the user's name `traits.name`, falling back to combining {@link
 * Identify#firstName} and {@link Identify#lastName} if possible.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
i.name = function () {
    let name = this.proxy("traits.name");
    if (typeof name === "string") {
        return trim(name);
    }
    let firstName = this.firstName();
    let lastName = this.lastName();
    if (firstName && lastName) {
        return trim(firstName + " " + lastName);
    }
};
/**
 * Get the user's "unique id" from `userId`, `traits.username`, or
 * `traits.email`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
i.uid = function () {
    return this.userId() || this.username() || this.email();
};
/**
 * Get the user's description from `traits.description` or `traits.background`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
i.description = function () {
    return this.proxy("traits.description") || this.proxy("traits.background");
};
/**
 * Get the URL of the user's avatar from `traits.avatar`, `traits.photoUrl`, or
 * `traits.avatarUrl`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
i.avatar = function () {
    let traits = this.traits();
    return (analytics_js_obj_case_default()(traits, "avatar") || analytics_js_obj_case_default()(traits, "photoUrl") || analytics_js_obj_case_default()(traits, "avatarUrl"));
};
/**
 * Get the user's username from `traits.username`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
i.username = Facade.proxy("traits.username");

;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/track.js






/**
 * Initialize a new `Track` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.event] - The name of the event being tracked.
 * @param {string} [dictionary.userId] - The ID of the user being tracked.
 * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
 * @param {string} [dictionary.properties] - Properties of the track event.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Track(dictionary, opts) {
    Facade.call(this, dictionary, opts);
}
inherits_browser_default()(Track, Facade);
let t = Track.prototype;
/**
 * Return the type of facade this is. This will always return `"track"`.
 *
 * @return {string}
 */
t.action = function () {
    return "track";
};
/**
 * An alias for {@link Track#action}.
 *
 * @function
 * @return {string}
 */
t.type = t.action;
/**
 * Get the event name from `event`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.event = Facade.field("event");
/**
 * Get the event value, usually the monetary value, from `properties.value`.
 *
 * This *should* be a number, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {number}
 */
t.value = Facade.proxy("properties.value");
/**
 * Get the event cateogry from `properties.category`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.category = Facade.proxy("properties.category");
/**
 * Get the event ID from `properties.id`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.id = Facade.proxy("properties.id");
/**
 * Get the name of this event from `properties.name`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.name = Facade.proxy("properties.name");
/**
 * Get a description for this event from `properties.description`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.description = Facade.proxy("properties.description");
/**
 * Get a plan, as in the plan the user is on, for this event from
 * `properties.plan`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string}
 */
t.plan = Facade.proxy("properties.plan");
/**
 * Get the referrer for this event from `context.referrer.url`,
 * `context.page.referrer`, or `properties.referrer`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
t.referrer = function () {
    // TODO re-examine whether this function is necessary
    return (this.proxy("context.referrer.url") ||
        this.proxy("context.page.referrer") ||
        this.proxy("properties.referrer"));
};
/**
 * Get the query for this event from `options.query`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @function
 * @return {string|object}
 */
t.query = Facade.proxy("options.query");
/**
 * Get the page's properties. This is identical to how {@link Facade#traits}
 * works, except it looks at `properties.*` instead of `options.traits.*`.
 *
 * Properties are gotten from `properties`.
 *
 * The parameter `aliases` is meant to transform keys in `properties` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * let obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
 * let track = new Track(obj)
 *
 * track.traits() // { "foo": "bar" }
 * track.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * track.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
t.properties = function (aliases) {
    let ret = this.field("properties") || {};
    aliases = aliases || {};
    for (const alias in aliases) {
        if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
            const value = this[alias] == null
                ? this.proxy("properties." + alias)
                : this[alias]();
            if (value == null)
                continue;
            ret[aliases[alias]] = value;
            delete ret[alias];
        }
    }
    return ret;
};
/**
 * Get the username of the user for this event from `traits.username`,
 * `properties.username`, `userId`, or `anonymousId`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string|undefined}
 */
t.username = function () {
    return (this.proxy("traits.username") ||
        this.proxy("properties.username") ||
        this.userId() ||
        this.sessionId());
};
/**
 * Get the email of the user for this event from `trais.email`,
 * `properties.email`, or `options.traits.email`, falling back to `userId` if
 * it looks like a valid email.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string|undefined}
 */
t.email = function () {
    let email = this.proxy("traits.email") ||
        this.proxy("properties.email") ||
        this.proxy("options.traits.email");
    if (email)
        return email;
    let userId = this.userId();
    if (isEmail(userId))
        return userId;
};
/**
 * Convert this event into an {@link Identify} facade.
 *
 * This works by taking this event's underlying object and creating an Identify
 * from it. This event's traits, taken from `options.traits`, will be used as
 * the Identify's traits.
 *
 * @return {Identify}
 */
t.identify = function () {
    // TODO: remove me.
    let json = this.json();
    json.traits = this.traits();
    return new Identify(json, this.opts);
};

;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/page.js





/**
 * Initialize a new `Page` facade with a `dictionary` of arguments.
 *
 * @param {Object} dictionary - The object to wrap.
 * @param {string} [dictionary.category] - The page category.
 * @param {string} [dictionary.name] - The page name.
 * @param {string} [dictionary.properties] - The page properties.
 * @param {Object} opts - Options about what kind of Facade to create.
 *
 * @augments Facade
 */
function Page(dictionary, opts) {
    Facade.call(this, dictionary, opts);
}
inherits_browser_default()(Page, Facade);
const p = Page.prototype;
/**
 * Return the type of facade this is. This will always return `"page"`.
 *
 * @return {string}
 */
p.action = function () {
    return "page";
};
/**
 * An alias for {@link Page#action}.
 *
 * @function
 * @return {string}
 */
p.type = p.action;
/**
 * Get the page category from `category`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.category = Facade.field("category");
/**
 * Get the page name from `name`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.name = Facade.field("name");
/**
 * Get the page title from `properties.title`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.title = Facade.proxy("properties.title");
/**
 * Get the page path from `properties.path`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.path = Facade.proxy("properties.path");
/**
 * Get the page URL from `properties.url`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.url = Facade.proxy("properties.url");
/**
 * Get the HTTP referrer from `context.referrer.url`, `context.page.referrer`,
 * or `properties.referrer`.
 *
 * This *should* be a string, but may not be if the client isn't adhering to
 * the spec.
 *
 * @return {string}
 */
p.referrer = function () {
    return (this.proxy("context.referrer.url") ||
        this.proxy("context.page.referrer") ||
        this.proxy("properties.referrer"));
};
/**
 * Get the page's properties. This is identical to how {@link Facade#traits}
 * works, except it looks at `properties.*` instead of `options.traits.*`.
 *
 * Properties are gotten from `properties`, augmented with the page's `name`
 * and `category`.
 *
 * The parameter `aliases` is meant to transform keys in `properties` into new
 * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
 * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
 * be called as a function instead of treated as a key into the traits.
 *
 * @example
 * let obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
 * let page = new Page(obj)
 *
 * page.traits() // { "foo": "bar" }
 * page.traits({ "foo": "asdf" }) // { "asdf": "bar" }
 * page.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
 *
 * @param {Object} aliases - A mapping from keys to the new keys they should be
 * transformed to.
 * @return {Object}
 */
p.properties = function (aliases) {
    let props = this.field("properties") || {};
    let category = this.category();
    let name = this.name();
    aliases = aliases || {};
    if (category)
        props.category = category;
    if (name)
        props.name = name;
    for (const alias in aliases) {
        if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
            const value = this[alias] == null
                ? this.proxy("properties." + alias)
                : this[alias]();
            if (value == null)
                continue;
            props[aliases[alias]] = value;
            if (alias !== aliases[alias])
                delete props[alias];
        }
    }
    return props;
};
/**
 * Get an event name from this page call. If `name` is present, this will be
 * `Viewed $name Page`; otherwise, it will be `Loaded a Page`.
 *
 * @param {string} name - The name of this page.
 * @return {string}
 */
p.event = function (name) {
    return name ? "Viewed " + name + " Page" : "Loaded a Page";
};
/**
 * Convert this Page to a {@link Track} facade. The inputted `name` will be
 * converted to the Track's event name via {@link Page#event}.
 *
 * @param {string} name
 * @return {Track}
 */
p.track = function (name) {
    let json = this.json();
    json.event = this.event(name);
    json.timestamp = this.timestamp();
    json.properties = this.properties();
    return new Track(json, this.opts);
};

;// CONCATENATED MODULE: ../../node_modules/@head.js/analytics.js-facade/dist/index.js


// import { Alias } from "./alias";
// import { Group } from "./group";



// import { Screen } from "./screen";
// import { Delete } from "./delete";
// export default {
//   ...Facade,
//   Alias,
//   Group,
//   Identify,
//   Track,
//   Page,
//   Screen,
//   Delete,
// };


;// CONCATENATED MODULE: ./src/lib/to-facade.ts

function to_facade_toFacade(evt, options) {
    let fcd = new Facade(evt, options);
    if (evt.type === 'track') {
        fcd = new Track(evt, options);
    }
    if (evt.type === 'identify') {
        fcd = new Identify(evt, options);
    }
    if (evt.type === 'page') {
        fcd = new Page(evt, options);
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

;// CONCATENATED MODULE: ./src/plugins/middleware/index.ts


async function applyDestinationMiddleware(destination, evt, middleware) {
    // Clone the event so mutations are localized to a single destination.
    let modifiedEvent = to_facade_toFacade(evt, {
        clone: true,
        traverse: false,
    }).rawEvent();
    async function applyMiddleware(event, fn) {
        let nextCalled = false;
        let returnedEvent = null;
        await fn({
            payload: to_facade_toFacade(event, {
                clone: true,
                traverse: false,
            }),
            integration: destination,
            next(evt) {
                nextCalled = true;
                if (evt === null) {
                    returnedEvent = null;
                }
                if (evt) {
                    returnedEvent = evt.obj;
                }
            },
        });
        if (!nextCalled && returnedEvent !== null) {
            returnedEvent = returnedEvent;
            returnedEvent.integrations = Object.assign(Object.assign({}, event.integrations), { [destination]: false });
        }
        return returnedEvent;
    }
    for (const md of middleware) {
        const result = await applyMiddleware(modifiedEvent, md);
        if (result === null) {
            return null;
        }
        modifiedEvent = result;
    }
    return modifiedEvent;
}
function sourceMiddlewarePlugin(fn, integrations) {
    async function apply(ctx) {
        let nextCalled = false;
        await fn({
            payload: toFacade(ctx.event, {
                clone: true,
                traverse: false,
            }),
            integrations: integrations !== null && integrations !== void 0 ? integrations : {},
            next(evt) {
                nextCalled = true;
                if (evt) {
                    ctx.event = evt.obj;
                }
            },
        });
        if (!nextCalled) {
            throw new ContextCancelation({
                retry: false,
                type: 'middleware_cancellation',
                reason: 'Middleware `next` function skipped',
            });
        }
        return ctx;
    }
    return {
        name: `Source Middleware ${fn.name}`,
        type: 'before',
        version: '0.1.0',
        isLoaded: () => true,
        load: (ctx) => Promise.resolve(ctx),
        track: apply,
        page: apply,
        identify: apply,
        // alias: apply,
        // group: apply,
    };
}

;// CONCATENATED MODULE: ./src/plugins/remote-loader/index.ts





class ActionDestination {
    constructor(name, action) {
        this.version = '1.0.0';
        this.alternativeNames = [];
        this.loadPromise = createDeferred();
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
    addMiddleware(...fn) {
        /** Make sure we only apply destination filters to actions of the "destination" type to avoid causing issues for hybrid destinations */
        if (this.type === 'destination') {
            this.middleware.push(...fn);
        }
    }
    async transform(ctx) {
        const modifiedEvent = await applyDestinationMiddleware(this.name, ctx.event, this.middleware);
        if (modifiedEvent === null) {
            ctx.cancel(new context_ContextCancelation({
                retry: false,
                reason: 'dropped by destination middleware',
            }));
        }
        return new Context(modifiedEvent);
    }
    _createMethod(methodName) {
        return async (ctx) => {
            if (!this.action[methodName])
                return ctx;
            let transformedContext = ctx;
            // Transformations only allowed for destination plugins. Other plugin types support mutating events.
            if (this.type === 'destination') {
                transformedContext = await this.transform(ctx);
            }
            try {
                if (!(await this.ready())) {
                    throw new Error('Something prevented the destination from getting ready');
                }
                // recordIntegrationMetric(ctx, {
                //   integrationName: this.action.name,
                //   methodName,
                //   type: 'action',
                // })
                await this.action[methodName](transformedContext);
            }
            catch (error) {
                // recordIntegrationMetric(ctx, {
                //   integrationName: this.action.name,
                //   methodName,
                //   type: 'action',
                //   didError: true,
                // })
                throw error;
            }
            return ctx;
        };
    }
    /* --- PASSTHROUGH METHODS --- */
    isLoaded() {
        return this.action.isLoaded();
    }
    async ready() {
        try {
            await this.loadPromise.promise;
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async load(ctx, analytics) {
        if (this.loadPromise.isSettled()) {
            return this.loadPromise.promise;
        }
        try {
            // recordIntegrationMetric(ctx, {
            //   integrationName: this.action.name,
            //   methodName: 'load',
            //   type: 'action',
            // })
            const loadP = this.action.load(ctx, analytics);
            this.loadPromise.resolve(await loadP);
            return loadP;
        }
        catch (error) {
            // recordIntegrationMetric(ctx, {
            //   integrationName: this.action.name,
            //   methodName: 'load',
            //   type: 'action',
            //   didError: true,
            // })
            this.loadPromise.reject(error);
            throw error;
        }
    }
    unload(ctx, analytics) {
        var _a, _b;
        return (_b = (_a = this.action).unload) === null || _b === void 0 ? void 0 : _b.call(_a, ctx, analytics);
    }
}
function validate(pluginLike) {
    if (!Array.isArray(pluginLike)) {
        throw new Error('Not a valid list of plugins');
    }
    const required = ['load', 'isLoaded', 'name', 'version', 'type'];
    pluginLike.forEach((plugin) => {
        required.forEach((method) => {
            var _a;
            if (plugin[method] === undefined) {
                throw new Error(`Plugin: ${(_a = plugin.name) !== null && _a !== void 0 ? _a : 'unknown'} missing required function ${method}`);
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
async function loadPluginFactory(remotePlugin) {
    try {
        const defaultCdn = new RegExp('https://cdn.segment.(com|build)');
        const cdn = getCDN();
        //   if (obfuscate) {
        //     const urlSplit = remotePlugin.url.split('/')
        //     const name = urlSplit[urlSplit.length - 2]
        //     const obfuscatedURL = remotePlugin.url.replace(
        //       name,
        //       btoa(name).replace(/=/g, '')
        //     )
        //     try {
        //       await loadScript(obfuscatedURL.replace(defaultCdn, cdn))
        //     } catch (error) {
        //       // Due to syncing concerns it is possible that the obfuscated action destination (or requested version) might not exist.
        //       // We should use the unobfuscated version as a fallback.
        //       await loadScript(remotePlugin.url.replace(defaultCdn, cdn))
        //     }
        //   } else {
        await loadScript(remotePlugin.url.replace(defaultCdn, cdn));
        //   }
        // @ts-expect-error
        if (typeof window[remotePlugin.libraryName] === 'function') {
            // @ts-expect-error
            return window[remotePlugin.libraryName];
        }
    }
    catch (err) {
        console.error('Failed to create PluginFactory', remotePlugin);
        throw err;
    }
}
async function remoteLoader(loadSettings, settings, 
// userIntegrations: Integrations,
// @ts-ignore
mergedIntegrations, 
// options?: InitOptions,
routingMiddleware) {
    var _a, _b, _c;
    const allPlugins = [];
    const cdn = getCDN();
    const routingRules = (_b = (_a = settings.middlewareSettings) === null || _a === void 0 ? void 0 : _a.routingRules) !== null && _b !== void 0 ? _b : [];
    const pluginPromises = ((_c = settings.remotePlugins) !== null && _c !== void 0 ? _c : []).map(async (remotePlugin) => {
        // if (isPluginDisabled(userIntegrations, remotePlugin)) return
        if (!remotePlugin.creationName) {
            remotePlugin.creationName = `AnalyticsPlugin${remotePlugin.name}`;
        }
        if (!remotePlugin.libraryName) {
            remotePlugin.libraryName = `AnalyticsPlugin${remotePlugin.name}`;
        }
        if (!remotePlugin.url) {
            remotePlugin.url = `${cdn}analytics-plugin-${remotePlugin.name.toLocaleLowerCase()}.js`;
        }
        try {
            const pluginFactory = 
            // pluginSources?.find(
            //   ({ pluginName }) => pluginName === remotePlugin.name
            // ) || (await loadPluginFactory(remotePlugin, options?.obfuscate))
            await loadPluginFactory(remotePlugin);
            if (pluginFactory) {
                // console.log(pluginFactory);
                const plugin = await pluginFactory(Object.assign(Object.assign({ app: loadSettings.app || {}, rum: loadSettings.rum || {} }, remotePlugin.settings), mergedIntegrations[remotePlugin.name]));
                const plugins = Array.isArray(plugin) ? plugin : [plugin];
                validate(plugins);
                const routing = routingRules.filter((rule) => rule.destinationName === remotePlugin.creationName);
                plugins.forEach((plugin) => {
                    const wrapper = new ActionDestination(remotePlugin.creationName, plugin);
                    if (routing.length && routingMiddleware) {
                        wrapper.addMiddleware(routingMiddleware);
                    }
                    allPlugins.push(wrapper);
                });
            }
        }
        catch (error) {
            console.warn('Failed to load Remote Plugin', error);
        }
    });
    await Promise.all(pluginPromises);
    return allPlugins.filter(Boolean);
}

;// CONCATENATED MODULE: ./src/lib/get-global.ts
// This an imperfect polyfill for globalThis
const getGlobal = () => {
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

;// CONCATENATED MODULE: ./src/core/inspector/index.ts
var _a;
var _b;

const env = getGlobal();
// The code below assumes the inspector extension will use Object.assign
// to add the inspect interface on to this object reference (unless the
// extension code ran first and has already set up the variable)
const inspectorHost = ((_a = (_b = env)['__SEGMENT_INSPECTOR__']) !== null && _a !== void 0 ? _a : (_b['__SEGMENT_INSPECTOR__'] = {}));
const attachInspector = (analytics) => { var _a; return (_a = inspectorHost.attach) === null || _a === void 0 ? void 0 : _a.call(inspectorHost, analytics); };

;// CONCATENATED MODULE: ./src/browser/index.ts
// import { getProcessEnv } from '../lib/get-process-env'

// import { fetch } from '../lib/fetch'





// import { segmentio, SegmentioSettings } from '../plugins/segmentio'

// import { ClassicIntegrationSource } from '../plugins/ajs-destination/types'

// import { Stats } from '../core/stats'

// export function loadCDNSettings(
//   writeKey: string,
//   baseUrl: string
// ): Promise<CDNSettings> {
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
// function hasLegacyDestinations(settings: CDNSettings): boolean {
//   return (
//     getProcessEnv().NODE_ENV !== 'test' &&
//     // just one integration means segmentio
//     Object.keys(settings.integrations).length > 1
//   )
// }
// function hasTsubMiddleware(settings: CDNSettings): boolean {
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
    flushSetAnonymousID(analytics, buffer);
    flushOn(analytics, buffer);
}
/**
 * Finish flushing buffer and cleanup.
 */
async function flushFinalBuffer(analytics, buffer) {
    // Call popSnippetWindowBuffer before each flush task since there may be
    // analytics calls during async function calls.
    await flushAddSourceMiddleware(analytics, buffer);
    flushAnalyticsCallsInNewTask(analytics, buffer);
}
async function registerPlugins(loadSettings, cdnSettings, analytics, options, pluginLikes = [], 
// legacyIntegrationSources: ClassicIntegrationSource[],
preInitBuffer) {
    flushPreBuffer(analytics, preInitBuffer);
    const pluginsFromSettings = pluginLikes === null || pluginLikes === void 0 ? void 0 : pluginLikes.filter((pluginLike) => typeof pluginLike === 'object');
    // const pluginSources = pluginLikes?.filter(
    //   (pluginLike) =>
    //     typeof pluginLike === 'function' &&
    //     typeof pluginLike.pluginName === 'string'
    // ) as PluginFactory[]
    // const tsubMiddleware = hasTsubMiddleware(cdnSettings)
    //   ? await import(
    //       /* webpackChunkName: "tsub-middleware" */ '../plugins/routing-middleware'
    //     ).then((mod) => {
    //       return mod.tsubMiddleware(cdnSettings.middlewareSettings!.routingRules)
    //     })
    //   : undefined
    // const legacyDestinations =
    //   hasLegacyDestinations(cdnSettings) || legacyIntegrationSources.length > 0
    //     ? await import(
    //         /* webpackChunkName: "ajs-destination" */ '../plugins/ajs-destination'
    //       ).then((mod) => {
    //         return mod.ajsDestinations(
    //           writeKey,
    //           cdnSettings,
    //           analytics.integrations,
    //           options,
    //           tsubMiddleware,
    //           legacyIntegrationSources
    //         )
    //       })
    //     : []
    // if (cdnSettings.legacyVideoPluginsEnabled) {
    //   await import(
    //     /* webpackChunkName: "legacyVideos" */ '../plugins/legacy-video-plugins'
    //   ).then((mod) => {
    //     return mod.loadLegacyVideoPlugins(analytics)
    //   })
    // }
    // const schemaFilter = options.plan?.track
    //   ? await import(
    //       /* webpackChunkName: "schemaFilter" */ '../plugins/schema-filter'
    //     ).then((mod) => {
    //       return mod.schemaFilter(options.plan?.track, cdnSettings)
    //     })
    //   : undefined
    const mergedSettings = mergedOptions(cdnSettings, options);
    const remotePlugins = await remoteLoader(loadSettings, cdnSettings, 
    // analytics.integrations,
    mergedSettings).catch(() => []);
    const basePlugins = [
        envEnrichment,
        // ...legacyDestinations,
        ...remotePlugins,
    ];
    // if (schemaFilter) {
    //   basePlugins.push(schemaFilter)
    // }
    // const shouldIgnoreSegmentio =
    //   (options.integrations?.All === false &&
    //     !options.integrations['Segment.io']) ||
    //   (options.integrations && options.integrations['Segment.io'] === false)
    // const shouldIgnoreSegmentio =
    //   (options.integrations?.All === false &&
    //     !options.integrations['Segment.io']) ||
    //   (options.integrations && options.integrations['Segment.io'] === false)
    // if (!shouldIgnoreSegmentio) {
    //   basePlugins.push(
    //     await segmentio(
    //       analytics,
    //       mergedSettings['Segment.io'] as SegmentioSettings,
    //       cdnSettings.integrations
    //     )
    //   )
    // }
    // order is important here, (for example, if there are multiple enrichment plugins, the last registered plugin will have access to the last context.)
    const ctx = await analytics.register(
    // register 'core' plugins and those via destinations
    ...basePlugins, 
    // register user-defined plugins passed into AnalyticsBrowser.load({ plugins: [plugin1, plugin2] }) -- relevant to npm-only
    ...pluginsFromSettings);
    // register user-defined plugins registered via analytics.register()
    await flushRegister(analytics, preInitBuffer);
    // if (
    //   Object.entries(cdnSettings.enabledMiddleware ?? {}).some(
    //     ([, enabled]) => enabled
    //   )
    // ) {
    //   await import(
    //     /* webpackChunkName: "remoteMiddleware" */ '../plugins/remote-middleware'
    //   ).then(async ({ remoteMiddlewares }) => {
    //     const middleware = await remoteMiddlewares(
    //       ctx,
    //       cdnSettings,
    //       options.obfuscate
    //     )
    //     const promises = middleware.map((mdw) =>
    //       analytics.addSourceMiddleware(mdw)
    //     )
    //     return Promise.all(promises)
    //   })
    // }
    return ctx;
}
async function loadAnalytics(settings, options = {}, preInitBuffer) {
    // return no-op analytics instance if disabled
    // if (options.disable === true) {
    //   return [new NullAnalytics(), Context.system()]
    // }
    var _a, _b, _c;
    if (options.globalAnalyticsKey)
        setGlobalAnalyticsKey(options.globalAnalyticsKey);
    // this is an ugly side-effect, but it's for the benefits of the plugins that get their cdn via getCDN()
    if (settings.cdnURL)
        setGlobalCDNUrl(settings.cdnURL);
    if (options.initialPageview) {
        // capture the page context early, so it's always up-to-date
        preInitBuffer.add(new PreInitMethodCall('page', []));
    }
    let cdnSettings = settings.cdnSettings;
    // const cdnURL = settings.cdnURL ?? getCDN()
    // let cdnSettings =
    //   settings.cdnSettings ?? (await loadCDNSettings(settings.writeKey, cdnURL))
    // if (options.updateCDNSettings) {
    //   cdnSettings = options.updateCDNSettings(cdnSettings)
    // }
    // if options.disable is a function, we allow user to disable analytics based on CDN Settings
    // if (typeof options.disable === 'function') {
    //   const disabled = await options.disable(cdnSettings)
    //   if (disabled) {
    //     return [new NullAnalytics(), Context.system()]
    //   }
    // }
    const retryQueue = (_b = (_a = cdnSettings.integrations['Segment.io']) === null || _a === void 0 ? void 0 : _a.retryQueue) !== null && _b !== void 0 ? _b : true;
    options = Object.assign({ retryQueue }, options);
    const analytics = new Analytics(Object.assign(Object.assign({}, settings), { cdnSettings, cdnURL: settings.cdnURL }), options);
    attachInspector(analytics);
    const plugins = (_c = settings.plugins) !== null && _c !== void 0 ? _c : [];
    // const classicIntegrations = settings.classicIntegrations ?? []
    // const segmentLoadOptions = options.integrations?.['Segment.io'] as
    //   | SegmentioSettings
    //   | undefined
    // Stats.initRemoteMetrics({
    //   ...cdnSettings.metrics,
    //   host: segmentLoadOptions?.apiHost ?? cdnSettings.metrics?.host,
    //   protocol: segmentLoadOptions?.protocol,
    // })
    const ctx = await registerPlugins(settings, cdnSettings, analytics, options, plugins, 
    // classicIntegrations,
    preInitBuffer);
    // const search = window.location.search ?? ''
    // const hash = window.location.hash ?? ''
    // const term = search.length ? search : hash.replace(/(?=#).*(?=\?)/, '')
    // if (term.includes('ajs_')) {
    //   await analytics.queryString(term).catch(console.error)
    // }
    analytics.initialized = true;
    analytics.emit('initialize', settings, options);
    await flushFinalBuffer(analytics, preInitBuffer);
    return [analytics, ctx];
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
class AnalyticsBrowser extends AnalyticsBuffered {
    constructor() {
        const { promise: loadStart, resolve: resolveLoadStart } = createDeferred();
        super((buffer) => loadStart.then(([settings, options]) => loadAnalytics(settings, options, buffer)));
        this._resolveLoadStart = (settings, options) => resolveLoadStart([settings, options]);
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
    load(settings, options = {}) {
        this._resolveLoadStart(settings, options);
        return this;
    }
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
    static load(settings, options = {}) {
        return new AnalyticsBrowser().load(settings, options);
    }
    static standalone(settings, options) {
        return AnalyticsBrowser.load(settings, options).then((res) => res[0]);
    }
}

;// CONCATENATED MODULE: ./src/browser/standalone-analytics.ts


// function getWriteKey(): string | undefined {
//   if (embeddedWriteKey()) {
//     return embeddedWriteKey()
//   }
//   const analytics = getGlobalAnalytics()
//   if (analytics?._writeKey) {
//     return analytics._writeKey
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
async function install() {
    var _a, _b, _c, _d;
    // const writeKey = getWriteKey()
    const settings = (_b = (_a = getGlobalAnalytics()) === null || _a === void 0 ? void 0 : _a._loadSettings) !== null && _b !== void 0 ? _b : { writeKey: 'REQUIRED' };
    const options = (_d = (_c = getGlobalAnalytics()) === null || _c === void 0 ? void 0 : _c._loadOptions) !== null && _d !== void 0 ? _d : {};
    // if (!writeKey) {
    //   console.error(
    //     'Failed to load Write Key. Make sure to use the latest version of the Segment snippet, which can be found in your source settings.'
    //   )
    //   return
    // }
    setGlobalAnalytics((await AnalyticsBrowser.standalone(settings, options)));
}

;// CONCATENATED MODULE: ./src/browser/standalone.ts
/* eslint-disable @typescript-eslint/no-floating-promises */
// import { getCDN, setGlobalCDNUrl } from '../lib/parse-cdn'

// if (process.env.IS_WEBPACK_BUILD) {
//   if (process.env.ASSET_PATH) {
//     // @ts-ignore
//     __webpack_public_path__ = process.env.ASSET_PATH
//   } else {
//     const cdn = getCDN()
//     setGlobalCDNUrl(cdn)
// 
//     // @ts-ignore
//     __webpack_public_path__ = cdn
//       ? cdn + '/analytics-next/bundles/'
//       : 'https://cdn.segment.com/analytics-next/bundles/'
//   }
// }
setVersionType('web');

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
install();

}();
window.AnalyticsNext = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=standalone.js.map