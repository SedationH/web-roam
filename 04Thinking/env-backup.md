## `zshrc`

```zsh
echo "Welcome to SedationH's ZSH Terminal 😊\n每天都要好心情吖"
export ZSH="/Users/sedationh/.oh-my-zsh"

ZSH_THEME="ys"

plugins=(nvm git)

source $ZSH/oh-my-zsh.sh

alias t="open -a typora"
alias gc="git checkout"
alias lc="code /Users/sedationh/workspace/learn-algorithm"
alias web="code /Users/sedatiaonh/workspace/web-roam"
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
# __conda_setup="$('/Users/sedationh/opt/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
# if [ $? -eq 0 ]; then
#     eval "$__conda_setup"
# else
#     if [ -f "/Users/sedationh/opt/anaconda3/etc/profile.d/conda.sh" ]; then
#         . "/Users/sedationh/opt/anaconda3/etc/profile.d/conda.sh"
#     else
#         export PATH="/Users/sedationh/opt/anaconda3/bin:$PATH"
#     fi
# fi
# unset __conda_setup
# <<< conda initialize <<<

function proxy() {
  export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7891
  echo "Proxy on"
}
function unproxy() {
  unset all_proxy  http_proxy https_proxy # 取消 proxy
  echo "Proxy off"
}

# # 打开命令行自动开启
# proxy

# 取消brew update
export HOMEBREW_NO_AUTO_UPDATE=true
# VSCode PATH
export PATH="/Applications/Visual Studio Code.app/Contents/Resources/app/bin:$PATH"

```

