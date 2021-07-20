如何把

build deploy这个过程给自动化

使用 Github Actions

坑走了一天，大致记录一下



原理解释

[how SSH Public Key Authentication Work?](https://www.linode.com/docs/guides/use-public-key-authentication-with-ssh/)



## 1. 配置服务器

Actions与服务器通过ssh进行文件传输，需要搭建认证机制



服务器生成key pairs

```shell
cd /root/.ssh
ssh-keygen -m PEM -t rsa -b 4096
```

get

```js
root@iZuf60u2i6tgtln2ae0bssZ:~/.ssh# ll
total 16
drwx------  2 root root 4096 May 29 21:18 ./
drwx------ 10 root root 4096 May 29 21:01 ../
-rw-------  1 root roost 3247 May 29 21:18 blog
-rw-r--r--  1 root root  754 May 29 21:18 blog.pub
```

```shell
cat blog.pub > authorized_keys
```



## 2. 配置项目

```yml
# This is a basic workflow to help you get started with Actions

name: deploy

# Controls when the action will run.
on:
  # Triggers the workflow on push or pull request events but only for the master branch
  push:
    branches: [master]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2

      - name: Install Node.js
        uses: actions/setup-node@v1
        with:
          node-version: "v14.17.0"
          
      - run: npm install
      - run: npm run build

      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-rltgoDzvO --delete"
          SOURCE: "public/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: root
          TARGET: /root/web/blog

```

集合项目实际需求进行配置



两个secrets还需要配置

## 3. 配置Github

Setting > Secrets



1中生成的密钥blog （private...

![image-20210529215545949](http://picbed.sedationh.cn/image-20210529215545949.png)

