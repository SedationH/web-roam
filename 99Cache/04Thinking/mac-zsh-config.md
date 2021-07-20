[Starting with macOS Catalina, your Mac uses zsh as the default login shell and interactive shell.](https://support.apple.com/en-us/HT208050)

很多时候的工作都在操作命令行，好好研究下，更好的利用。

## shell

bash 还是 zsh 都是[shell](https://en.wikipedia.org/wiki/Shell_(computing)#Microsoft_Windows)，

> In [computing](https://en.wikipedia.org/wiki/Computing), a **shell** is a [user interface](https://en.wikipedia.org/wiki/User_interface) for access to an [operating system](https://en.wikipedia.org/wiki/Operating_system)'s services. In general, operating system shells use either a [command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) (CLI) or [graphical user interface](https://en.wikipedia.org/wiki/Graphical_user_interface) (GUI), depending on a computer's role and particular operation. It is named a shell because it is the outermost layer around the operating system.[[1\]](https://en.wikipedia.org/wiki/Shell_(computing)#cite_note-Economist-1) [[2\]](https://en.wikipedia.org/wiki/Shell_(computing)#cite_note-JargonFile-2)

**What is iTerm2?**

iTerm2 is a replacement for Terminal and the successor to iTerm. It works on Macs with macOS 10.12 or newer. iTerm2 brings the terminal into the modern age with features you never knew you always wanted.

iTerm2是一个用于操作shell应用，类似于系统自带的`Terminal.app`

## config files

经常使用`~/.zshrc`来配置文件，然而背后的还有好多其他的配置文件

参考[macOS 中 zsh 配置文件及其加载顺序](https://wangxiz.site/blog/posts/zsh-startup-and-shotdown-files/)

 根据shell使用特点的不同，文件加载顺序不一样

### login shell

简单来说，就是以登录模式使用shell

当我们打开 macOS 自带的 Terminal.app 或者 iTerm.app 时, 可以看到最上面会显示一行:

```
Last login: Sat Nov 23 09:41:50 on ttys001
```

在一个 login shell 中运行 `zsh` 命令, 打开的是一个 non-login shell;
在一个 login shell 中运行 `zsh -l` 命令, 打开的也是一个 login shell.

通过以下命令可以检测当前 shell 是否为 login shell:

```
$ echo $0
-zsh # "-" is the first character. Therefore, this is a login shell.

$ echo $0
zsh  # "-" is NOT the first character. Therefore, this is NOT a login shell.
```

### interactive shell

打开iTerm使用的shell模式就是interactive shell

interactive shell 相比 login shell 更容易理解一些, 直观上来说就是用户可以与之直接交互的 shell 实例.

### 具体文件

|    all users    |     user      | L-I shell | NL-I shell | NL-NI shell |
| :-------------: | :-----------: | :-------: | :--------: | :---------: |
|  `/etc/zshenv`  |  `~/.zshenv`  |     √     |     √      |      √      |
| `/etc/zprofile` | `~/.zprofile` |     √     |     x      |      x      |
|  `/etc/zshrc`   |  `~/.zshrc`   |     √     |     √      |      x      |
|  `/etc/zlogin`  |  `~/.zlogin`  |     √     |     x      |      x      |
| `/etc/zlogout`  | `~/.zlogout`  |     √     |     x      |      x      |

其中 (N)L shell 表示 (non-)login shell, (N)I shell 表示 (non-)interactive shell.

可以看到, `/etc/zshenv` 和 `~/.zshenv` 中的配置在所有场景中都会起作用. 因此在配置这两个文件的时候, 我们应当慎重一些, 以免其中的配置在某些场景下应用时出现问题.

另外, 我们还可以看到, `zprofile` 和 `zlogin` 都是用于 login shell 的. 但是为什么会有两类文件呢? 这是因为 `zlogin` 是对 ksh 的 `login` 文件的模拟, 而 `zprofile` 则是对 bash 的 `profile` 文件的模拟.

### 加载顺序

```
# zsh 启动时加载
/etc/zshenv   # 所有 zsh 实例启动时都会加载
~/.zshenv     # 所有 zsh 实例启动时都会加载
/etc/zprofile # 当前 shell 为 login shell 时才会加载
 ｜- /etc/paths
 ｜- /etc/paths.d/
~/.zprofile   # 当前 shell 为 login shell 时才会加载
/etc/zshrc    # 当前 shell 为 interactive shell 时才会加载
~/.zshrc      # 当前 shell 为 interactive shell 时才会加载
/etc/zlogin   # 当前 shell 为 login shell 时才会加载
~/.zlogin     # 当前 shell 为 login shell 时才会加载

# zsh 退出时加载
~/.zlogout    # 正常退出 login shell 时才会加载
/etc/zlogout  # 正常退出 login shell 时才会加载
```



## 实际使用

个人觉得login的特性我现在基本用不到，为了提高加载速度，可以将zsh打开的时候通过非login 模式打开 "iTerm2 -> Preference -> Profiles -> General -> Comman -> /bin/zsh"



最近发现使用非login模式打开brew命令使用不了了，还不明白为什么，留个坑