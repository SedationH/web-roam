参考

https://juejin.cn/book/6844733763675488269/section/6844733763788767239

https://www.cxymsg.com/guide/http.html

云息 01-计算机网络



东西有些多，感觉自己只能记住个大概

就简单写吧



## [UDP 与 TCP 的区别是什么？](https://searchnetworking.techtarget.com/definition/UDP-User-Datagram-Protocol#:~:text=UDP%20(User%20Datagram%20Protocol)%20is,provided%20by%20the%20receiving%20party.)

Transimition Control Protocol

- It is a connection-oriented protocol. 
  - 需要三次握手和四次挥手的链接建立与消除工作
- 需要分包数据再组合
- 滑动窗口算法下的拥塞控制
- 保证不丢失（可靠，确认收到） 
- 按顺序



User Datagram Protocol

- 无连接
- TCP有的我没有
- 快



## HTTP是啥

一个应用层协议，用来传输hypermedia documents, such as HTML. 

It was designed for communication between web browsers and web servers, but it can also be used for other purposes.

 HTTP follows a classical [client-server model](https://en.wikipedia.org/wiki/Client–server_model), with a client opening a connection to make a request, then waiting until it receives a response. HTTP is a [stateless protocol](https://en.wikipedia.org/wiki/Stateless_protocol), meaning that the server does not keep any data (state) between two requests. 

> In addition to the client–server model, [distributed computing](https://en.wikipedia.org/wiki/Distributed_computing) applications often use the [peer-to-peer](https://en.wikipedia.org/wiki/Peer-to-peer) (P2P) application architecture.

从设计上来看，是一种separation of concerns

C 专注于展示

S 专注于处理数据



## HTTP有哪些方法？

1. GET 请求服务器的资源
   1. 无副作用 幂等 在强调服务器所有的资源数量是否改变
2. OPTIONS 获取目录资源所支持的通讯选项
3. POST 向服务器发送数据
4. PUT 新增资源 修改资源
   1. 相对于POST 通常用于单一资源，覆盖式修改
5. PATCH 对资源进行部分修改
   1. 但一资源 局部更新
6. TRACE 显示服务器收到的请求，用于测试



## HTTP的报文格式和内容

请求报文

1. 请求行
2. 请求头部
3. 空行
4. 请求体

![2019-06-14-11-24-10](http://picbed.sedationh.cn/6bb3600c998901243aa7b3934e5c7ffc.png)



请求报文

对应的

1. 响应行
2. 响应头
3. 空行
4. 响应体

![2019-06-14-11-37-02](http://picbed.sedationh.cn/1b6f58868e31fb23d0688b8ca0ca619f.png)



## HTTP的常见部首

- 通用部首
  - Cache-Control 控制缓存 ✨
  - Connection 连接管理、逐条首部 ✨
- 请求部首
  - Accept 客户端或者代理能够处理的媒体类型 ✨
  - Host 请求资源所在服务器 ✨
  - User-Agent 客户端程序信息 ✨
- 响应首部
  - Location 令客户端重定向的URI ✨
  - Server 服务器的信息 ✨



还有一些涉及缓存的 下述



## HTTP状态码

- **1xx**: 表示目前是协议处理的中间状态，还需要后续操作。
- **2xx**: 表示成功状态。
- **3xx**: 重定向状态，资源位置发生变动，需要重新请求。
  - TODO 需要理解一些缓存知识
- **4xx**: 客户端错误
  - 400 报文有语法错误
  - 401 unauthorized 未认证
  - 403 服务器拒绝
  - 404 没找到
- **5xx**: 服务器端发生错误。

### 

## keep-alive是干嘛的？

HTTP/1.0 中 每一次的HTTP请求都要走一遍TCP的建立和取消过程，对C/S都是一种资源浪费

[参看](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection#directives)

```plain
Connection: keep-alive
Connection: close
```

 If the value sent is `keep-alive`, the connection is persistent and not closed, allowing for subsequent requests to the same server to be done.



## HTTPS是啥？

**Hypertext Transfer Protocol Secure** (**HTTPS**) is an extension of the [Hypertext Transfer Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) (HTTP). It is used for [secure communication](https://en.wikipedia.org/wiki/Secure_communications) over a [computer network](https://en.wikipedia.org/wiki/Network_operating_system), and is widely used on the Internet.[[1\]](https://en.wikipedia.org/wiki/HTTPS#cite_note-1)[[2\]](https://en.wikipedia.org/wiki/HTTPS#cite_note-2) In HTTPS, the [communication protocol](https://en.wikipedia.org/wiki/Communication_protocol) is encrypted using [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) or, formerly, Secure Sockets Layer (SSL). The protocol is therefore also referred to as **HTTP over TLS**,[[3\]](https://en.wikipedia.org/wiki/HTTPS#cite_note-3) or **HTTP over SSL**.



这里涉及到一些安全问题

TODO



## HTTP2 较于 HTTP1.x有什么优势和特点

- 头部压缩
  - 只发送差异数据，而不是全部发送，从而减少头部的信息量
- 服务器推送
- 多路复用
  - HTTP 1.x 中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8个的TCP链接请求限制。
  - 通过查看HTTP/2请求与HTTP/1.x请求的瀑布流可以发现，HTTP/1.x连接存在严重的头阻塞问题，每个时刻最多只可能有6条请求在6条连接上执行，而HTTP/2采用多条请求复用一个连接的机制，同一时刻可以接收到的请求数不受连接数的限制，能更加充分地利用网络带宽。



