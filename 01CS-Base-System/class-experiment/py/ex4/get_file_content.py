import sys

filename = sys.argv[1]

print('Firts')
f = open(filename, 'r', encoding='utf-8')
for line in f:
    print(line)
f.close()

print('Second')
with open(filename, 'r', encoding='utf-8') as f:
    for line in f:
        print(line)
