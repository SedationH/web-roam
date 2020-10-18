"use strict";

require("core-js/modules/es.object.entries");

var tony = {
  name: 'Tony Huang',
  age: 18,
  gender: 'male'
};
var entries = Object.entries(tony);
console.log(entries);
