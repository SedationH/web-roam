## 读者-写者问题

满足以下规则

1. 读的时候允许其他读入
2. 读和写相互排斥，即读的时候不可写，写的时候不可读
3. 写与写也是互斥的



[代码参考](./ReaderFirst.py)



一个比较重要的理解

我们通过引入Rcount来实现多个读入同时进行，同时又满足读和写的相斥

在对这个临界资源Rcount进行操作的时候，都要先加锁在操作，再去锁

```python
# add read lock
Rmutex.acquire()
global Rcount
if Rcount == 0:
    # add write lock
    Wmutex.acquire()
Rcount += 1
Rmutex.release()

# some action neet TODO

Rmutex.acquire()
Rcount -= 1
if Rcount == 0:
    Wmutex.release()
Rmutex.release()
```



大致说下相关api

Semaphore(int n) 返回一个semaphore

这个实例有

- require & release 方法 对应 书本内容的 wait & signal

- require效果

  - If the internal counter is larger than zero on entry, decrement it by one and return `True` immediately.
  - If the internal counter is zero on entry, block until awoken by a call to `release()`. Once awoken (and the counter is greater than 0), decrement the counter by 1 and return `True`. Exactly one thread will be awoken by each call to `realease()` The order in which threads are awoken should not be relied on.
  - 说白了就是减信号量，没有就等着release唤醒

  