/*
* util function, parse rem string to number
* */
function parseRem(rem) {
    return Number(rem.replace("rem", ""));
}

/*
* util function, convert rem number to string
* */
function toRem(rem) {
    return rem + 'rem';
}

/*
* Circle: data representation of circle with position and size
* circleElement: the circle element already in DOM
* */
function Circle(content) {
    // DOM element of the circle
    const HTML = makeCircle(content);

    // positions of the circle, in rem
    let xCenter = 0;
    let yCenter = 0;
    let radius = 0;

    // speed of the circle, in rem, per update
    let xSpeed = 0;
    let ySpeed = 0;

    // calculate radius only when it is appended to DOM
    HTML.addEventListener('DOMNodeInserted', () => {
        const sideLength = parseRem(HTML.style.width);
        radius = sideLength / 2;
    });

    // return if this circle collides to given circle
    function collideTo(circle) {
        return collideDistance(circle) > 0;
    }

    // return distance to given circle, in rem
    function distanceTo(circle) {
        const xDiff = xCenter - circle.xCenter;
        const yDiff = yCenter - circle.yCenter;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    // return the collision distance to given circle, in rem
    function collideDistance(circle) {
        const sumRadius = radius + circle.radius;
        const distance = distanceTo(circle);
        return sumRadius - distance;
    }

    // getter, setters, and functions that are exposed to user
    return {
        get content() {
            return content;
        },
        get radius() {
            return radius;
        },
        get xCenter() {
            return xCenter;
        },
        get yCenter() {
            return yCenter;
        },
        get left() {
            return xCenter - radius;
        },
        get top() {
            return yCenter - radius;
        },
        get HTML() {
            return HTML;
        },
        get xSpeed() {
            return xSpeed;
        },
        get ySpeed() {
            return ySpeed;
        },
        set yCenter(number) {
            yCenter = number;
            HTML.style.top = toRem(this.top);
        },
        set xCenter(number) {
            xCenter = number;
            HTML.style.left = toRem(this.left);
        },
        set xSpeed(number) {
            xSpeed = number;
        },
        set ySpeed(number) {
            ySpeed = number;
        },

        collideTo,
        collideDistance,
        distanceTo
    }
}

/*
* CircleManager controls all behaviours of circles
*
* containerID: the id of container in DOM, default to 20rem
* width: width of the container, in rem, default to 20rem
* height: height of the container, in rem
*
* You will need to call 'add' to add circles after create manager
* */
function CircleManager(containerID, height=20, width=20) {
    // style things
    const wrapper = document.getElementById(containerID);
    wrapper.style.width = toRem(width);
    wrapper.style.height = toRem(height);
    wrapper.style.overflow = 'hidden';
    wrapper.style.position = 'relative';

    const container = document.createElement('div');
    container.style.width = toRem(width);
    container.style.height = toRem(height);
    wrapper.appendChild(container);

    // gravity is where to gather circles
    // in this case it is central of container
    const gravity = {
        x: parseRem(container.style.width) / 2,
        y: parseRem(container.style.height) / 2
    };
    const circles = [];
    let circleCount = 0;
    let enableDynamicCollision = true;

    // return if a circle has collision
    function hasCollision(circle) {
        for (const otherCircle of circles) {
            if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                return true;
            }
        }
        return false;
    }

    // return all collision pairs
    function getAllCollision() {
        const collision = [];
        for (const circle of circles) {
            for (const otherCircle of circles) {
                if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                    collision.push([circle, otherCircle]);
                }
            }
        }
        return collision;
    }

    // return circles that collide to the given circle
    function getCollision(circle) {
        const collision = [];
        for (const otherCircle of circles) {
            if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                collision.push(otherCircle);
            }
        }
        return collision;
    }

    // return random y number that is inside container
    function randYInsideContainer() {
        const yMax = gravity.y * 2;
        return Math.random() * yMax;
    }

    // add circle with content, without delay
    // this is private and should be called by 'add'
    function addNoDelay(content) {
        ++circleCount;

        const circle = new Circle(content);

        container.appendChild(circle.HTML);

        // adjust x position in case of overlap, depends on right or left
        let xAdjustFactor;

        const circleWidth = circle.radius * 2;

        if (circleCount % 2) {
            // go right
            circle.xCenter = gravity.x * 2 + circleWidth;
            xAdjustFactor = 1;
        } else {
            // go left
            circle.xCenter = -circleWidth;
            xAdjustFactor = -1;
        }
        circle.yCenter = randYInsideContainer();

        circles.push(circle);
        while (hasCollision(circle)) {
            circle.yCenter = randYInsideContainer();
            circle.xCenter += xAdjustFactor * circleWidth;
        }
        const xToGravity = gravity.x - circle.xCenter;
        const yToGravity = gravity.y - circle.yCenter;
        const xMinSpeed = xToGravity / 200;
        const yMinSpeed = yToGravity / 200;
        circle.xSpeed = xMinSpeed;
        circle.ySpeed = yMinSpeed;

        setTimeout(disableDynamicCollision, 3000);
    }

    // add a circle to container with delay
    // content: the string displayed inside circle
    // delay: add to container after delay, in milliseconds, default to 0
    function add(content, delay = 0) {
        setTimeout(() => addNoDelay(content), delay);
    }

    // update all circle positions
    function updatePosition() {
        for (const circle of circles) {
            circle.xCenter += circle.xSpeed;
            circle.yCenter += circle.ySpeed;
        }
    }

    // update all circle speed
    function updateSpeed() {
        for (const circle of circles) {
            const xToGravity = gravity.x - circle.xCenter;
            const yToGravity = gravity.y - circle.yCenter;

            // friction
            circle.xSpeed *= 0.98;
            circle.ySpeed *= 0.98;

            // ensure it does not stop moving before reaching gravity
            circle.xSpeed += xToGravity / 10000;
            circle.ySpeed += yToGravity / 10000;
        }
    }

    // function to resolve all collisions
    // ref: https://github.com/OneLoneCoder/videos/blob/d4cf430f9d49217c6d51e880514c146c20802d6e/OneLoneCoder_Balls1.cpp#L198
    function resolveCollision() {
        // Static collisions, i.e. overlap
        const collisionPairs = [];
        for (const circle of circles) {
            for (const otherCircle of circles) {
                if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                    // Collision has occured
                    collisionPairs.push([circle, otherCircle]);

                    // Distance between ball centers
                    const distance = circle.distanceTo(otherCircle);

                    // Calculate displacement required
                    const distanceOverlap = -0.5 * circle.collideDistance(otherCircle);

                    // Displace Current Ball away from collision
                    circle.xCenter -= distanceOverlap * (circle.xCenter - otherCircle.xCenter) / distance;
                    circle.yCenter -= distanceOverlap * (circle.yCenter - otherCircle.yCenter) / distance;

                    // Displace Target Ball away from collision
                    otherCircle.xCenter += distanceOverlap * (circle.xCenter - otherCircle.xCenter) / distance;
                    otherCircle.yCenter += distanceOverlap * (circle.yCenter - otherCircle.yCenter) / distance;
                }
            }
        }

        // Now work out dynamic collisions
        // dynamic collision is great before circles gathered together
        // but it causes chaos after that
        // it could be disabled by setting enableDynamicCollision to false
        // typically set to false after 2 - 5 seconds of first adding circles
        if (enableDynamicCollision) {
            for (const collisionPair of collisionPairs) {
                // circle 1 and circle 2
                const c1 = collisionPair[0];
                const c2 = collisionPair[1];

                // Distance between balls
                const distance = c1.distanceTo(c2);

                // Normal
                const nx = (c2.xCenter - c1.xCenter) / distance;
                const ny = (c2.yCenter - c1.yCenter) / distance;

                // Tangent
                const tx = -ny;
                const ty = nx;

                // Dot Product Tangent
                const dpTan1 = c1.xSpeed * tx + c1.ySpeed * ty;
                const dpTan2 = c2.xSpeed * tx + c2.ySpeed * ty;

                // Dot Product Normal
                const dpNorm1 = c1.xSpeed * nx + c1.ySpeed * ny;
                const dpNorm2 = c2.xSpeed * nx + c2.ySpeed * ny;

                // Conservation of momentum in 1D
                const m1 = (dpNorm1 * (c1.radius - c2.radius) + 2 * c2.radius * dpNorm2) / (c1.radius + c2.radius);
                const m2 = (dpNorm2 * (c2.radius - c1.radius) + 2 * c1.radius * dpNorm1) / (c1.radius + c2.radius);

                // Update ball velocities
                c1.xSpeed = tx * dpTan1 + nx * m1;
                c1.ySpeed = ty * dpTan1 + ny * m1;
                c2.xSpeed = tx * dpTan2 + nx * m2;
                c2.ySpeed = ty * dpTan2 + ny * m2;
            }
        }
    }

    // update all circles, it is self start when manager is created
    (function update() {
        updatePosition();
        updateSpeed();
        resolveCollision();
        setTimeout(update, 1)
    })();

    // dynamic collision can be disabled by calling this function
    function disableDynamicCollision() {
        enableDynamicCollision = false;
    }

    // functions that is exposed to user
    return {
        add,
    }
}
