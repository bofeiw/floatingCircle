"use strict";

/*
* Adjust the size of a circle (div) so that the contained text (span)
* is perfectly fit inside the circle.
* The algorithm uses a binary search, so it wont be that slow.
* Don't forget to add CSS to html! It is very important!
*
* circle: the id of circle in DOM or circle HTML Node
* */
function adjustSize(circle) {
    // all the units are in rem
    // following two variables are customisable

    // minimum radius of circle
    let minRadius = 1;

    // more iteration, more accurate, slower
    const maxIteration = 200;

    // following are not customisable
    console.log(typeof circle);
    if (typeof circle === 'string') {
        // find circle by given circle ID
        // otherwise it need to be a circle
        circle = document.getElementById(circle);
    }
    const text = circle.children[0];
    console.log(circle.children[0]);

    let maxRadius = 10;

    // find a rough max bound for maximum radius that fit the text
    while (true) {
        // update DOM size
        const sideLength = (2 * maxRadius) + 'rem';
        circle.style.width = sideLength;
        circle.style.height = sideLength;
        circle.style.borderRadius = maxRadius + 'rem';

        const circleBottom = circle.offsetTop + circle.offsetHeight;
        const textTop = text.offsetTop;
        const textBottom = text.offsetTop + text.offsetHeight;
        // text is completely inside circle in DOM
        const isSizeFit = textTop < circleBottom && textBottom < circleBottom;
        if (isSizeFit) {
            break;
        } else {
            maxRadius *= 2;
        }
    }

    let iterationCount = 0;

    // do iterations to find a fit in a binary search manner
    while (true) {
        // update DOM size
        const currentRadius = (maxRadius + minRadius) / 2;
        const sideLength = (2 * currentRadius) + 'rem';
        circle.style.width = sideLength;
        circle.style.height = sideLength;
        circle.style.borderRadius = currentRadius + 'rem';

        const circleBottom = circle.offsetHeight;
        const textTop = text.offsetTop;
        const textBottom = text.offsetTop + text.offsetHeight;
        // text is completely inside circle in DOM
        const isSizeFit = textTop < circleBottom && textBottom < circleBottom;
        if (isSizeFit) {
            if (iterationCount > maxIteration) {
                // fit and accurate enough, stop
                break;
            } else {
                // fit but can be more small, decrease max
                maxRadius = currentRadius;
            }
        } else {
            // too small, increase min
            minRadius = currentRadius;
        }
        ++iterationCount;
    }
}

/*
* Make a circle wrapping the content.
* You can append to your HTML whenever you want!
*
* content: the text to show in the circle
* return: HTML Node of the circle
* */
function makeCircle(content) {
    // create elements
    const circle = document.createElement('div');
    const text = document.createElement('span');

    circle.classList.add('circle');
    circle.appendChild(text);
    text.innerHTML = content;

    // when circle is appended to HTML, adjust its size
    circle.addEventListener('DOMNodeInserted', () => adjustSize(circle));
    return circle;
}