原文🔗

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/) tip: interactive



## digest



**Debounce** and **throttle** are two similar (but different!) techniques to control how many times we allow a function to be executed over time.



That way the handler is not coupled to the event. With this simple technique, we can avoid ruining the user experience.



Use debounce, throttle and `requestAnimationFrame` to optimize your event handlers. Each technique is slightly different, but all three of them are useful and complement each other.



In summary:



- **debounce:** Grouping a sudden burst of events (like keystrokes) into a single one.
- 

- **throttle:** Guaranteeing a constant flow of executions every X milliseconds. Like checking every 200ms your scroll position to trigger a CSS animation.
- 

- **requestAnimationFrame:** a throttle alternative. When your function recalculates and renders elements on screen and you want to guarantee smooth changes or animations. Note: no IE9 support.



## 一些好的参考

[JS中的debounce与throttle](https://juejin.im/post/6844903760334946312)

