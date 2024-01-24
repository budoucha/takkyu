new p5(p => {
    let hasHit, hasFell, isLocked;
    let hitSound, fallSound;
    let norm_max;

    p.preload = () => {
        hitSound = p.loadSound("assets/table-tennis-ball.mp3");
        fallSound = p.loadSound("assets/table-tennis-ball_fall.mp3");
        hitSound.setVolume(1.0);
        hitSound.playMode('sustain');
        fallSound.setVolume(1.0);
        fallSound.playMode('restart');
    }

    p.setup = () => {
        p.pixelDensity(1);
        p.outputVolume(1.0);

        hasHit = false;
        hasFell = false;
        isLocked = false;
        norm_max = 0;
    }

    p.draw = () => {
        const acceleration_norm = p.sqrt(p.sq(p.accelerationZ) + p.sq(p.accelerationX) + p.sq(p.accelerationY));
        norm_max = (norm_max < acceleration_norm) ? acceleration_norm : norm_max;

        if (p.accelerationZ > 45 || (p.accelerationZ > 30 && acceleration_norm > 50)) {
            if (!hasHit) {
                hitBall();
                hasHit = true;
                isLocked = true;
                setTimeout(unlock, 400);
            }
        }
        else {
            if (isLocked == false) {
                hasHit = false;
            }
        }
    }

    hitBall = () => {
        hitSound.setVolume(1.0);
        hitSound.play();
        const vib = () => { window.navigator.vibrate(60); }
        setTimeout(vib, 75);
        setTimeout(bounce, 400);
        setTimeout(checkFall, 900);
        hasFell = false;
        fallSound.stop(); //stop even in playing
    }

    bounce = () => {
        hitSound.setVolume(0.4);
        hitSound.play();
        hasFell = true;
    }

    checkFall = () => {
        if (hasFell) {
            fallSound.setVolume(1.0);
            fallSound.play();
        }
    }

    unlock = () => {
        isLocked = false;
    }

    p.mousePressed = () => {
        const h1 = document.querySelector('h1');
        document.querySelector('p.start').style.visibility = "hidden";
        if (p.accelerationZ == 0) {
            hitBall();
        }
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
});
