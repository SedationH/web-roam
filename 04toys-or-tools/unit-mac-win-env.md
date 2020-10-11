当前设备

- win10
- mac 16

其实没有太多mac的事情，因为是尽量让win向mac靠拢

## Terminal

使用Git Bash  -> pin to taskbar -> properties -> start in D:\ 

VSCode的终端也要保持统一

ctrl + shift + p -> open user settings ->  想办法打开User setting.json -> add below

```js
    "terminal.integrated.shell.windows": "D:\\pro\\Git\\bin\\bash.exe",
    "git.path": "D:\\pro\\Git\\bin\\git.exe",
    "terminal.integrated.automationShell.linux": ""
```



## [Proxy](https://learnku.com/articles/43765)

> 想要简洁，不想妥协。

绝大多数使用 HTTP 协议的 CLI 应用都支持这两个环境变量，这几乎已经成为了「行业标准」：

```bash
export http_proxy=http://127.0.0.1:8080 https_proxy=$http_proxy all_proxy=socks5://127.0.0.1:1080
```

像 Git over SSH、SCP、SFTP 这类基于 SSH 协议的应用，并不支持以上两个环境变量。不过我们可以修改 SSH 配置文件 ~/.ssh/config 来实现，例如：

```plain
Host github.com
    ProxyCommand /usr/bin/nc -x 127.0.0.1:1080 %h %p
```

以上配置中的 ProxyCommand 只在连接到 github.com 时生效，你可以将 Host github.com 替换成其它 Git 服务商的主机名，也可以替换为 Host *，表示 SSH 到任意主机均生效。但我并不推荐这么做，除非你想 SSH 到自己的服务器时也通过代理。

export 起到导出作为全局变量的效果

万能：软件进行配置 Proxifier（mac & win）

我是这么理解的：科学服务提供监听端口，将收到的数据进行转发，起到加密的效果，我们想要使用其服务，需要将流量发送到这个端口上。

127.0.0.1是软件循环测试端口，刚好达到循环的效果，妙哉。