如何把当前项目变成cli应用, `package.json`中添加

```json
{
  "name": "06cli",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "bin": "cli.js"
}
```

```zsh
$ yarn link
$ which 06cli 
/usr/local/bin/06cli
$ ls -l /usr/local/bin | grep 06cli
lrwxr-xr-x  1 sedationh  admin        55 Oct 19 19:29 06cli -> ../../../Users/sedationh/.config/yarn/link/06cli/cli.js
```

可见通过yarn link 创建了软链接文件



除了了解这些，我们创建的cli.js

```js
$ ll cli.js
-rw-r--r--  1 sedationh  staff     0B Oct 19 20:12 cli.js
```

需改让其可执行

```zsh
$ chmod 775 cli.js; ls -l || grep cli
total 24
-rw-r--r--@ 1 sedationh  staff  594 Oct 19 20:12 README.md
-rwxrwxr-x  1 sedationh  staff   22 Oct 19 20:13 cli.js
-rw-r--r--  1 sedationh  staff  104 Oct 19 19:29 package.json
```

cli.js文件开头添加[Shebang](https://bash.cyberciti.biz/guide/Shebang) 指定进行执行解释器

```js
#! node
```



现在的使用还很简陋，打算研究下webpack再进行整改

留个参考

**[【手把手】15分钟搭一个企业级脚手架](https://juejin.im/post/6844903925666037773#heading-0)**