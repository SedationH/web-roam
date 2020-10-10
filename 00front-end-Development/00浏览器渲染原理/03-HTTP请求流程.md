# HTTP请求流程：为什么很多站点第二次打开速度会很快？



HTTP协议，是建立在TCP链接基础之上的。HTTP是一种允许**浏览器向服务器获取资源的协议**，是Web的基础，通常由浏览器发起请求，用来获取不同类型的文件，例如 HTML 文件、CSS 文件、JavaScript 文件、图片、视频等。此外，**HTTP 也是浏览器使用最广的协议**。



![image-20200522143635363](http://picbed.sedationh.cn/image-20200522143635363.png)



## 流程详解

1. 构建请求

浏览器构建请求行信息，准备发起网络请求

```
GET / HTTP1.1
```

2. 查找缓存
   1. DNS缓存
   2. 页面缓存

在真正的发起网络请求之前，浏览器会先在浏览器缓存里查询是否有要请求的文件

**浏览器缓存是一种在本地保存资源副本，以便下次请求直接使用的技术**

3. 准备IP和端口

**浏览器使用HTTP协议作为应用层协议，封装请求的文本信息，并使用TCP/IP作为传输层协议将它发到网络上。**

所以在建立HTTP链接之前，先要与TCP/IP与服务建立连接(IP主机TCP端口)。

由于IP地址是数字标示，难以记忆，所以出现了DNS(Domain Name System)“**域名系统**”来提供IP与地址的映射

如`sedationh.cn` `http://175.24.15.102/`

解决了IP的问题，接下来就需要获取端口号了。通常情况下，如果 URL 没有特别指明端口号，那么 HTTP 协议默认是 80 端口。

4. 等待TCP队列

Chrome 有个机制，同一个域名同时最多只能建立 6 个 TCP 连接。

5. 建立TCP连接
6. 发送HTTP请求

如访问`www.baidu.com`

有如下request headers产生

```
GET / HTTP/1.1
Host: www.baidu.com
Connection: keep-alive
sec-ch-ua: "\\Not\"A;Brand";v="99", "Chromium";v="84", "Google Chrome";v="84"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.13 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7
Cookie: BIDUPSID=9F957F9319F0370AA8CF6CB274ED7D20; PSTM=1589946253; BAIDUID=9F957F9319F0370AC0A361BC9E65018D:FG=1; BD_UPN=123253; COOKIE_SESSION=2_0_2_0_4_1_1_0_2_1_3_0_160_0_0_0_1590030842_0_1590032854%7C4%230_0_1590032854%7C1; BDRCVFR[S_ukKV6dOkf]=mk3SLVN4HKm; BD_HOME=1; H_PS_PSSID=1458_31672_21120

[＜request-body＞
```

第一行是请求行

包括了 **请求方法、请求 URI（Uniform Resource Identifier）和 HTTP 版本协议**。

另外一个常用的请求方法是**POST**，它用于发送一些数据给服务器，比如登录一个网站，就需要通过 POST 方法把用户信息发送给服务器。如果使用 POST 方法，那么浏览器还要准备数据给服务器，这里准备的数据是通过**请求体**来发送。

在浏览器发送请求行命令之后，还要以**请求头**形式发送其他一些信息，把浏览器的一些基础信息告诉服务器。比如包含了浏览器所使用的操作系统、浏览器内核等信息，以及当前请求的域名信息、浏览器端的 Cookie 信息，等等。



7. 服务端处理请求
8. 服务端响应请求

```
HTTP/1.1 200 OK
Bdpagetype: 1
Bdqid: 0xcfdafa41003c2dc9
Cache-Control: private
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Fri, 22 May 2020 07:06:15 GMT
Expires: Fri, 22 May 2020 07:06:13 GMT
Server: BWS/1.1
Set-Cookie: BDSVRTM=0; path=/
Set-Cookie: BD_HOME=1; path=/
Set-Cookie: H_PS_PSSID=1458_31672_21120_31111_31463_30823; path=/; domain=.baidu.com
Strict-Transport-Security: max-age=172800
Traceid: 1590131175054633908214977558667857767881
X-Ua-Compatible: IE=Edge,chrome=1
Transfer-Encoding: chunked

[＜request-body＞
```

第一行是响应行

包括了 协议版本和状态码



但并不是所有的请求都可以被服务器处理的，那么一些无法处理或者处理出错的信息，怎么办呢？服务器会通过请求行的**状态码**来告诉浏览器它的处理结果，比如：

- 最常用的状态码是 200，表示处理成功；
- 如果没有找到页面，则会返回**404**。

随后，正如浏览器会随同请求发送请求头一样，服务器也会随同响应向浏览器发送**响应头**。响应头包含了服务器自身的一些信息，比如服务器生成返回数据的时间、返回的数据类型（JSON、HTML、流媒体等类型），以及服务器要在客户端保存的 Cookie 等信息。

发送完响应头后，服务器就可以继续发送**响应体**的数据，通常，响应体就包含了 HTML 的实际内容。

[关于请求、响应报文的具体格式](https://www.cnblogs.com/biyeymyhjob/archive/2012/07/28/2612910.html)

9. 断开TCP链接

   ​	正常响应完就断开了，但是如果响应体中有`Connection: keep-alive`

那么 TCP 连接在发送后将仍然保持打开状态，这样浏览器就可以继续通过同一个 TCP 连接发送请求。**保持 TCP 连接可以省去下次请求时需要建立连接的时间，提升资源加载速度**。比如，一个 Web 页面中内嵌的图片就都来自同一个 Web 站点，如果初始化了一个持久连接，你就可以复用该连接，以请求其他资源，而不需要重新再建立新的 TCP 连接。

​			重定向(`-I`表示只需要获取响应头和响应行数据)

```bash
➜ curl -I geekbang.org

HTTP/1.1 301 Moved Permanently
Date: Fri, 22 May 2020 07:47:49 GMT
Content-Type: text/html
Content-Length: 182
Connection: keep-alive
Location: https://www.geekbang.org/
```

也可能会重定向改变链接协议 如吧http变为https

四次挥手断开TCP链接



## 常见问题

通过对以上HTTP请求和响应流程的了解，一些问题可以去思考了



### 为什么很多站点第二次打开速度会很快？



缓存

- DNS
- 页面资源缓存

![image-20200522155033637](http://picbed.sedationh.cn/image-20200522155033637.png)

通过响应头中的`Cache-Control`字段来控制资源缓冲

`Cache-Control:Max-age=2000`



当再次发送请求的时候，会产生两种情况

1. 没过期，直接返回缓存资源
2. 但如果缓存过期了，浏览器则会继续发起网络请求，并且在**HTTP 请求头**中带上：`If-None-Match:"4f80f-13c-3a1xb12a"`。服务器收到请求头后，会根据 If-None-Match 的值来判断请求的资源是否有更新。
   1. 如果没有更新，就返回 304 状态码，相当于服务器告诉浏览器：“这个缓存可以继续使用，这次就不重复发送数据给你了。”
   2. 如果资源有更新，服务器就直接返回最新资源给浏览器。



### 如何保持登陆状态

第一次登陆成功后，服务器通过`SetCookie:uid=3431uad`让浏览器保存cookie到本地

下次再访问页面的时候，请求体中就携带`Cookie:uid=3431uad`服务器会请求报文中的cookie值返回对应用户的页面