function parseRem(rem) {
    return Number(rem.replace("rem", ""));
}

function toRem(rem) {
    return rem + 'rem';
}

/*
* Circle: data representation of circle with position and size
* circleElement: the circle element already in DOM
* */
function Circle(content) {
    const HTML = makeCircle(content);
    let xCenter = 0;
    let yCenter = 0;
    let radius = 0;
    let xSpeed = 0;
    let ySpeed = 0;

    HTML.addEventListener('DOMNodeInserted', () => {
        const sideLength = parseRem(HTML.style.width);
        radius = sideLength / 2;
        // HTML.style.visibility = 'hidden';
    });

    function show() {
        HTML.style.visibility = 'visible';
    }

    function collideTo(circle) {
        return collideDistance(circle) > 0;
    }

    function distanceTo(circle) {
        const xDiff = xCenter - circle.xCenter;
        const yDiff = yCenter - circle.yCenter;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    function collideDistance(circle) {
        const sumRadius = radius + circle.radius;
        const distance = distanceTo(circle);
        return sumRadius - distance;
    }

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

function CircleManager(containerID) {
    const container = document.getElementById(containerID);
    const gravity = {
        x: parseRem(container.style.width) / 2,
        y: parseRem(container.style.height) / 2
    };
    const circles = [];
    let circleCount = 0;
    let enableDynamicCollision = true;

    function hasCollision(circle) {
        for (const otherCircle of circles) {
            if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                return true;
            }
        }
        return false;
    }

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

    function getCollision(circle) {
        const collision = [];
        for (const otherCircle of circles) {
            if (circle !== otherCircle && circle.collideTo(otherCircle)) {
                collision.push(otherCircle);
            }
        }
        return collision;
    }

    function randYInsideContainer() {
        const yMax = gravity.y * 2;
        return Math.random() * yMax;
    }

    function add(content) {
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

    function updatePosition() {
        for (const circle of circles) {
            circle.xCenter += circle.xSpeed;
            circle.yCenter += circle.ySpeed;
        }
    }

    function updateSpeed() {
        for (const circle of circles) {
            const xToGravity = gravity.x - circle.xCenter;
            const yToGravity = gravity.y - circle.yCenter;
            const xMinSpeed = xToGravity / 10000;
            const yMinSpeed = yToGravity / 10000;

            // friction
            circle.xSpeed *= 0.98;
            circle.ySpeed *= 0.98;

            circle.xSpeed += xMinSpeed;
            circle.ySpeed += yMinSpeed;

            // add min gravity speed
            // if (Math.abs(circle.xSpeed) < Math.abs(xMinSpeed)) {
            //     circle.xSpeed = xMinSpeed;
            // }
            // if (Math.abs(circle.ySpeed) < Math.abs(yMinSpeed)) {
            //     circle.ySpeed = yMinSpeed;
            // }
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

    (function update() {
        // console.log(1);
        updatePosition();
        updateSpeed();
        resolveCollision();
        setTimeout(update, 1)
    })();

    function disableDynamicCollision() {
        enableDynamicCollision = false;
    }

    return {
        add,
    }
}

circleManager = new CircleManager('container');
circleManager.add("Hfasdgasfb dsaf dasf adsf ad");
circleManager.add("sad asdf  dsaf ");
circleManager.add(" dsaf dasf adsf ad adsf a sd asdf asdf as dfas d");
circleManager.add(" dsaf dasf  asdf asdf as dfas d");
circleManager.add(" dsaf  as dfas d");
circleManager.add(" dsaf dasf adsf ad adsf a sd asdf asdf as dfas d");
circleManager.add(" dsaf dasf ad sd as a asdsf ad adsf a sd asdf asdf as dfas d");
circleManager.add("  dfas d");
circleManager.add(" dsaf dasf ");