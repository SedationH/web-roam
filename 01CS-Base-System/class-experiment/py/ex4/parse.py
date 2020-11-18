# -*- coding: utf-8 -*-
# @Time    : 2020/11/12 8:21 AM
# @Author  : SedationH
# @FileName: parse.py
# @Software: PyCharm
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--foo', help='foo help')
parser.add_argument('--length', help='length help')
args = parser.parse_args()
# parser.print_help()
len = int(args.length)
print(f'length is {len}\nperimeter is {len*4}\narea is {len*len}')
