# Floating Circle
A light weight circle-circle collision simulation with visual cues.  
It can dynamically add data at anytime.  
Inspired by Apple Music's introduction scene on iOS.

# Demo 
Try here: https://bofeiw.github.io/floatingCircle

![demo.gif](examples/demo.gif)

# How to use
1. Include `adjustSize.css` in your HTML.
```html
<link rel="stylesheet" href="css/adjustSize.css">
```
2. Include `adjustSize.js` and `anime.min.js` in your HTML.
```html
<script src="js/adjustSize.js"></script>
<script src="js/anime.min.js"></script>
```
3. Create a container and assign an ID: 

```html
<div id="yourID"></div>
```
Note: the `div` will occupy 100% of width and height of its parent, please give it some space! This is essential!
4. Use `add` to dynamically add data!
```html
<script>
    circleManager = new CircleManager('yourID');
    circleManager.add("Hello there!");
    circleManager.add("I'm glad to see you!");
    circleManager.add("How are you?", 1000);
    circleManager.add("This is really a fun demo", 2000);
    circleManager.add("Hope you'll enjoy it!", 5000);
    circleManager.add("Have fun!", 10000);
    circleManager.add("Why are you still there !!!!!!!!!", 20000);
</script>
```
`add` Receive two parameters, the first one is the content of the circle, and the second one is optional, is the delay of the circle to be added, default to 0.

You can also see [this example](examples/helloWorld.html).

# Callback onclick
After creating a CircleManager, you can pass your onclick callback to manager. By default, when a circle is clicked, the content of the circle is logged.
You can change the default behaviour by adding this:
```js
circleManager.onclick = (content) => {
    // this is default onclick but you can always change it
    // do whatever you want with content!
    console.log(content);
}
```
Your callback should receive one parameter, content, which is the string inside the clicked circle.

# Browser support
- Apple Safari: supported
- Google Chrome: supported
- Microsoft Edge: supported
- Microsoft IE: not supported. If you want use it in IE, you need to use [Bable](https://babeljs.io) to translate all js files into compatible versions (i.e. string literals are not supported in IE).
- Other Browsers: to be tested

# TODO
- speed up algorithm (a bit slow when adding lots of circles (around 50))
- add more info to callback (eg. pass some id back)
- hovering on a circle that is surrounded by lots of circles caus-es enlarging animation to be not smooth (around 50)
- add drag effect
- add more callbacks (onempty etc.)
- add radius as a percentage to measure the percentage of each two circles to displace in static collision
- two circles might not fit inside container

# Contribution
You are welcome to contribute! You can consider to kill some TODOs.

# Related projects
Here are some of the projects I tried and are related to this project:
- [Circle collision detection with mouseover effect using D3.js](https://bl.ocks.org/mbostock/3231298)
- [Circle collision with resizeable circle and collapsible content using D3.js](https://github.com/trongthanh/techstack)

# License
["Anti 996" License](LICENSE.txt), do whatever you want if you or your company does not exploit employees
