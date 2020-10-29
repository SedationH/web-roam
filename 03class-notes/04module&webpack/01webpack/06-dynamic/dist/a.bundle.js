(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _common_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _common_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_common_global_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _posts_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _posts_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_posts_css__WEBPACK_IMPORTED_MODULE_2__);




/* harmony default export */ __webpack_exports__["default"] = (() => {
  const posts = document.createElement('div')
  posts.className = 'posts'

  posts.innerHTML = '<h2>Posts</h2>'

  Object(_common_fetch__WEBPACK_IMPORTED_MODULE_0__["default"])('/posts').then(data => {
    data.forEach(item => {
      const article = document.createElement('article')
      article.className = 'post'

      const h3 = document.createElement('h3')
      h3.textContent = item.title
      article.appendChild(h3)

      const paragraph = document.createElement('p')
      paragraph.textContent = item.body
      article.appendChild(paragraph)

      posts.appendChild(article)
    })
  })

  return posts
});


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(4);
            var content = __webpack_require__(8);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".post + .post {\n  border-top: 1px solid #eee;\n}\n\n.post h2 {\n  margin-bottom: 0;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ })

}]);