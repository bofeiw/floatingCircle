circleManager = new CircleManager('circles');
circleManager.add("Hello there!");
circleManager.add("I'm glad to see you!");
circleManager.add("How are you?", 1000);
circleManager.add("This is really a fun demo", 2000);
circleManager.add("Hope you'll enjoy it!", 5000);
circleManager.add("Have fun!", 10000);
circleManager.add("Why are you still there !!!!!!!!!", 20000);

document.getElementById('button').onclick = () => {
    const input = document.getElementById('input');
    const text = input.value;
    input.value = "";
    if (text) {
        circleManager.add(text);
    }
}