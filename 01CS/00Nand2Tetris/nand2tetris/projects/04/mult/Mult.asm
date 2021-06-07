// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.

// Analyse
// R1*R2 可以理解为 times * value
// 即 times 个 value相加

// use some variables to save process value
// more readale
@i
M=1

@R2
M=0

(LOOP)
  // 循环判断逻辑
  @i
  D=M
  @R0
  D=D-M;
  @ENd
  D;JGT
  
  // 计算
  @R2
  D=M
  @R1
  D=D+M
  // 写回
  @R2
  M=D

  // 更改 i
  @i
  D=M+1
  @i
  M=D

  @LOOP
  0;JMP

(END)
  @END
  0;JMP


