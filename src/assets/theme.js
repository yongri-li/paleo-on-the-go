/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/scripts/sections/theme/theme.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/scripts/sections/theme/theme.js":
/*!*********************************************!*\
  !*** ./src/scripts/sections/theme/theme.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @styles/index.scss */ \"./src/styles/index.scss\");\n/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_index_scss__WEBPACK_IMPORTED_MODULE_0__);\n\n\n//# sourceURL=webpack:///./src/scripts/sections/theme/theme.js?");

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\\nModuleBuildError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nSassError: Undefined variable.\\n   ╷\\n34 │   background-color: $color-off-white;\\n   │                     ^^^^^^^^^^^^^^^^\\n   ╵\\n  src/styles/components/_menu.scss 34:21  @import\\n  src/styles/components/index.scss 7:9    @import\\n  /Users/marcwallis/paleo-on-the-go/src/styles/index.scss 5:9                               root stylesheet\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/webpack/lib/NormalModule.js:316:20\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/loader-runner/lib/LoaderRunner.js:367:11\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/loader-runner/lib/LoaderRunner.js:233:18\\n    at context.callback (/Users/marcwallis/paleo-on-the-go/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/sass-loader/dist/index.js:73:7\\n    at Function.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:98996:16)\\n    at render_closure1.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:84511:12)\\n    at _RootZone.runBinary$3$3 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:29540:18)\\n    at _FutureListener.handleError$1 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28062:21)\\n    at _Future__propagateToListeners_handleError.call$0 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28369:49)\\n    at Object._Future__propagateToListeners (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3901:77)\\n    at _Future._completeError$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28215:9)\\n    at _AsyncAwaitCompleter.completeError$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27863:12)\\n    at Object._asyncRethrow (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3704:17)\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:19766:20\\n    at _wrapJsFunctionForAsync_closure.$protected (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3729:15)\\n    at _wrapJsFunctionForAsync_closure.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27882:12)\\n    at _awaitOnObject_closure0.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27876:25)\\n    at _RootZone.runBinary$3$3 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:29540:18)\\n    at _FutureListener.handleError$1 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28062:21)\\n    at _Future__propagateToListeners_handleError.call$0 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28369:49)\\n    at Object._Future__propagateToListeners (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3901:77)\\n    at _Future._completeError$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:28215:9)\\n    at _AsyncAwaitCompleter.completeError$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27863:12)\\n    at Object._asyncRethrow (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3704:17)\\n    at /Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:15273:20\\n    at _wrapJsFunctionForAsync_closure.$protected (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:3729:15)\\n    at _wrapJsFunctionForAsync_closure.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27882:12)\\n    at _awaitOnObject_closure0.call$2 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:27876:25)\\n    at _RootZone.runBinary$3$3 (/Users/marcwallis/paleo-on-the-go/node_modules/node-sass/sass.dart.js:29540:18)\");\n\n//# sourceURL=webpack:///./src/styles/index.scss?");

/***/ })

/******/ });