http://csapp.cs.cmu.edu/3e/home.html



## resource

book http://guanzhou.pub/files/Computer%20System_EN.pdf

video https://www.bilibili.com/video/BV1iW411d7hd?p=5

Course Materials http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/
ppt http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html



## Introduction

http://csapp.cs.cmu.edu/3e/perspective.html

```c
void copyij(long int src[2048][2048], long int dst[2048][2048])
{
  long int i,j;
  for (i = 0; i < 2048; i++)
    for (j = 0; j < 2048; j++)
      dst[i][j] = src[i][j];
}

void copyji(long int src[2048][2048], long int dst[2048][2048])
{
  long int i,j;
  for (j = 0; j < 2048; j++)
    for (i = 0; i < 2048; i++)
      dst[i][j] = src[i][j];
}
```

These programs have identical behavior. They differ only in the order in which the loops are nested. When run on a 2.0 GHz Intel Core i7 Haswell processor,, copyij runs in 4.3 milliseconds, whereas copyji requires 81.8—more than 19 times slower! Due to the ordering of memory accesses, copyij makes much better use of the cache memory system.

![图](http://csapp.cs.cmu.edu/3e/images/mountain3e-labeled.gif)

### Key Points

- The material in this book has direct value for programmers. Students find that it explains many of the mysterious problems they've already encountered, that it helps them write and debug code more efficiently, and that their programs are more reliable and efficient. Even if this is the only systems course they ever take, they will have achieved a higher level of competence than many entry-level programmers.
- The material in this book is unique. Much of it is not presented in any other book or taught in previous courses. Instead, a traditional coverage of systems requires programmers to figure out on their own how the characteristics of the systems they study in builder-centric courses can be exploited to improve their programs. Programmers must struggle through confusing Unix man pages or read advanced systems programming books just to use the simple process control functions provided by Unix.
- The book provides a solid foundation for builder-centric courses. We believe that more advanced systems courses *should* present systems from a builder's perspective. Students will be much better oriented to the needs and constraints of these systems by first studying them from a programmer's perspective. At Carnegie Mellon, our Introduction to Computer Systems course has become a prequisite for courses in both CS and ECE covering: operating systems, networking, compilers, computer graphics, computer architecture, and embedded system design.