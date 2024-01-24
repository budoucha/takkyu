new p5(p => {
    let hasFell, isLocked;
    let hitSound, fallSound;
    let norm_max;

    p.preload = () => {
        hitSound = p.loadSound("assets/table-tennis-ball.mp3");
        fallSound = p.loadSound("assets/table-tennis-ball_fall.mp3");
        bombSound = p.loadSound("assets/explosion.mp3");
        hitSound.setVolume(1.0);
        hitSound.playMode('sustain');
        fallSound.setVolume(1.0);
        fallSound.playMode('restart');
        bombSound.setVolume(1.0);
        bombSound.playMode('sustain');
    }

    p.setup = () => {
        p.pixelDensity(1);
        p.outputVolume(1.0);

        hasFell = false;
        isLocked = false;
        norm_max = 0;
    }

    p.draw = () => {
        const acceleration_norm = p.sqrt(p.sq(p.accelerationZ) + p.sq(p.accelerationX) + p.sq(p.accelerationY));
        norm_max = (norm_max < acceleration_norm) ? acceleration_norm : norm_max;

        const hitConditions = [
            p.accelerationZ > 90 && acceleration_norm > 120, // フォアハンド
            Math.abs(p.accelerationX) > 80 && acceleration_norm > 140,
            p.accelerationZ < -80 && acceleration_norm > 140// バックハンド
        ];

        // hit
        if (!isLocked && hitConditions.some(cond => cond)) {
            hitBall();
            isLocked = true;
            setTimeout(unlock, 600);
            if (p.accelerationZ > 150 &&acceleration_norm > 216) {
                smash();
            }
        }
    }

    hitBall = () => {
        hitSound.setVolume(1.0);
        hitSound.play();
        setTimeout(vib(60), 75);
        setTimeout(bounce, 400);
        setTimeout(checkFall, 900);
        hasFell = false;
        fallSound.stop(); //cancel fall at hit
    }

    smash = () => {
        bombSound.setVolume(1.0);
        bombSound.play();
        vib(800)
    }

    vib = (duration) => {
        window.navigator.vibrate(0);
        window.navigator.vibrate(duration);
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
});
