// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

@KBD
D=A-1
@MAX_SCREEN_ADDRESS
M=D

(LOOP)

  // 初始化 i
  @SCREEN
  D=A
  @i
  M=D

  // 监听键盘是否有输入
  @KBD
  D=M
  @FILL_BLACK
  D;JNE

  (FILL_WHITE)
    // 循环可行性判断
    @MAX_SCREEN_ADDRESS
    D=M
    @i
    D=M-D
    @LOOP
    D;JGT

    // 进行画图
    @i
    A=M
    M=0

    @i
    M=M+1
    @FILL_WHITE
    0;JMP
  

  // 开始循环画图
  (FILL_BLACK)
    // 循环可行性判断
    @MAX_SCREEN_ADDRESS
    D=M
    @i
    D=M-D
    @LOOP
    D;JGT

    // 进行画图
    @i
    A=M
    M=-1

    @i
    M=M+1
    @FILL_BLACK
    0;JMP
    
  // @LOOP
  // 0;JMP
