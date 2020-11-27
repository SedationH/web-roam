## .c文件是如何通过转换最终执行的？

```zsh
$ gcc 1-start
$ ./a.out 1 2 3
4
./a.out
1
2
3
```

gcc is not really the compiler, but rather the program called a “compiler driver”; thus it coordinates the many steps of the compilation. Usually there are four to five steps. First, gcc will execute cpp, the C preprocessor, to process certain directives (such as #define and #include). The program cpp is just a source-to-source translator, so its end-product is still just source code (i.e., a C file). Then the real compilation will begin, usually a command called cc1. This will transform source-level C code into low-level assembly code, specific to the host machine. The assembler as will then be executed, generating object code (bits and things thatmachines can really understand), and finally the link-editor (or linker) ld will put it all together into a final executable program. Fortunately(!), for most purposes, you can blithely be unaware of how gcc works, and just use it with the proper flags. The result of your compilation above is an executable, named (by default) a.out.

```zsh
$ ./a.out
```

就可以执行文件了

简单来说 gcc是一个大集合 执行流程如下

cpp -> cc1 -> assembler -> ld

