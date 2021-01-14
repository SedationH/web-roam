# -*- coding: utf-8 -*-
# @Time    : 2020/10/27 10:30 AM
# @Author  : SedationH
# @FileName: ReaderFirst.py
# @Software: PyCharm
import time
import threading
from threading import Semaphore


def get_int_current_time():
    return (int(time.strftime('%S')) + 60 * int(time.strftime('%M'))) - start


def loop(times):
    while times != 0:
        print(get_int_current_time() - start)
        time.sleep(1)
        times -= 1


def reader(i, sleept, start_time):
    time.sleep(start_time)
    print(f'时间：{get_int_current_time()} idx: {i} is waiting to read')
    # add read lock
    Rmutex.acquire()
    global Rcount
    if Rcount == 0:
        # add write lock
        Wmutex.acquire()
    Rcount += 1
    Rmutex.release()
    print(f'时间：{get_int_current_time()} idx: {i} is reading')
    time.sleep(sleept)
    print(f'时间：{get_int_current_time()} idx: {i} has finished reading')
    Rmutex.acquire()
    Rcount -= 1
    if Rcount == 0:
        Wmutex.release()
    Rmutex.release()


def writer(i, sleept, start_sleep):
    time.sleep(start_sleep)
    print(f'时间: {get_int_current_time()} idx: {i} is waiting to write')
    Wmutex.acquire()
    print(f'时间: {get_int_current_time()} idx: {i} is writing')
    time.sleep(sleept)
    print(f'时间： {get_int_current_time()} idx: {i} has finished writing')
    Wmutex.release()


start = (int(time.strftime('%S')) + 60 * int(time.strftime('%M')))
Wmutex = Semaphore(1)
Rmutex = Semaphore(1)
Rcount = 0


if __name__ == '__main__':
    idx = []
    rw_list = []
    start_time = []
    continue_time = []

    with open('read', 'r') as f:
        data = f.readlines()
        for x in data:
            x = x[:-1].split(sep=' ')
            idx.append(int(x[0]))
            rw_list.append(x[1])
            start_time.append(int(x[2]))
            continue_time.append(int(x[3]))

    print(f'所有线程开始启动 当前时刻：{get_int_current_time()}')
    for i in range(len(rw_list)):
        print(f'时间： {get_int_current_time()} idx:{idx[i]} 开始线程执行')
        if rw_list[i] == 'R':
            t = threading.Thread(
                target=reader,
                args=(
                    idx[i], continue_time[i], start_time[i]
                )
            )
            t.start()
        else:
            t = threading.Thread(
                target=writer,
                args=(
                    idx[i], continue_time[i], start_time[i]
                )
            )
            t.start()