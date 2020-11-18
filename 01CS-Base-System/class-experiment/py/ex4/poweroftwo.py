import sys

n = int(sys.argv[1])

str = ''
for i in range(n + 1):
    str += f'{i} {i*2} {i*i}\n'

with open('outfile', 'w', encoding='utf-8') as f:
    f.write(str)
  