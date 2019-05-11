# Floating Circle
A light weight circle-circle collision simulation with visual cues.  
It can dynamically add data at anytime.  
Inspired by Apple Music's introduction scene on iOS.

# Demo 
Try here: 

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

# TODO

# Contribution
You are welcome to contribute!

# License
["Anti 996" License](LICENSE.txt), do whatever you want if you or your company does not exploit employees
