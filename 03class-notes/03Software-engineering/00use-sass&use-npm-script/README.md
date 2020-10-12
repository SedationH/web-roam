初步体验自动化带来的好处



使用逻辑能力更强大的scss

> Sass is a stylesheet language that’s compiled to CSS. It allows you to use [variables](https://sass-lang.com/documentation/variables), [nested rules](https://sass-lang.com/documentation/style-rules#nesting), [mixins](https://sass-lang.com/documentation/at-rules/mixin), [functions](https://sass-lang.com/documentation/modules), and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.



> Sass supports two different syntaxes. Each one can load the other, so it's up to you and your team which one to choose.
>
> - .scss
> - .sass

更多细节[参看](https://sass-lang.com/)



```zsh
yarn add sass --dev

yarn sass scss/main.scss css/main.css
```



## package script

需求，先要在serve前先执行build,可以add 下面这句在

```json
"scripts": {
    "build": "sass scss/main.scss css/main.css",
    "serve": "browser-sync .",
    "preserve": "yarn build"
  },
```



想要sass 监听文件的变化，可以 watch会阻塞后面的serve，这里需要引入并行

通过npm-run-all来实现



```json
"scripts": {
    "build": "sass scss/main.scss css/main.css --watch",
    "serve": "browser-sync . --files \"css/*.css\"",
    "start": "run-p build serve"
  },
```

这样就完成了修改scss文件，自动更新css文件， borwer-sync自动监听css文件，进行同步的效果。😊

