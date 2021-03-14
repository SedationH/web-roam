## [The difference between rest parameters and the `arguments` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters#the_difference_between_rest_parameters_and_the_arguments_object)

There are three main differences between rest parameters and the [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) object:

- The `arguments` object is **not a real array**, while rest parameters are [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) instances, meaning methods like [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) or [`pop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) can be applied on it directly;
- The `arguments` object has additional functionality specific to itself (like the `callee` property).
- The `...restParam` bundles all the extra parameters into a single array, therefore it does not contain any named argument defined **before** the `...restParam`. Whereas the `arguments` object contains all of the parameters -- including all of the stuff in the `...restParam` -- **un**bundled.

