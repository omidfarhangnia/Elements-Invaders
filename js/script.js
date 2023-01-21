// register change page effect
gsap.registerEffect({
    name: "changePage",
    effect: (targets) => {
        return gsap.timeline().fromTo(".meteorite__image__container", {
            left: "110%"
        },{
            left: "-110%",
            duration: 4,
            ease: "linear",
            delay: 1
        }).fromTo(targets, {
            left: "100%"
        },{
            left: "0",
            duration: 2,
            ease: "linear",
        }, "-=3.5")
    },
    extendTimeline: true
})

gsap.registerEffect({
    name: "showText",
    effect: (targets, config) => {
        return gsap.fromTo(targets, {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: config.duration,
            onComplete: config.onComplete,
            ease: "expo.out",
        })
    },
    extendTimeline: true
})

const gameContainer = $(".game__container");
const mainShipRifleBullet = $("<div class='main__ship--rifleBullet'></div>");
const mainShipBlasterBullet = $("<div class='main__ship--blasterBullet'></div>");

$('#go__tutorial, #tutorial').click(goToTutorial)

let TutorialAnime = gsap.timeline().timeScale(15);

function goToTutorial() {
    TutorialAnime
    .changePage(".page__tutorial")
    .showText(".tutorial__headers", {duration: .5}, "+=1")
    .showText(".tutorial__prag__num1", {duration: .5}, "+=2")
    .to(".tutorial__prag__num1", {
        x: -50,
        duration: 1,
        opacity: 0
    }, "+=2")
    .showText(".tutorial__prag__num2", {duration: .5}, "+=1")
    .showText(".tutorial__prag__num3", {duration: .5}, "+=2.5")
    .fromTo(".main__ship", {
        y: window.innerHeight + 300,
        x: (window.innerWidth / 2) - 120
    },{
        y: "-=600",
        duration: 1.3,
        ease: "back.out(.6)"
    },)
    .showText(".tutorial__prag__num4", {duration: .5}, "+=2.5")
    .showText(".tutorial__prag__num5", {duration: .5}, "+=2.5")
    .showText(".tutorial__prag__num6", {duration: .5, onComplete: function() {
        makeMovementForShip();
        TutorialAnime.pause();
    }}, "+=2.5")
    .showText(".tutorial__prag__num7", {duration: .5}, "+=4")
    .showText(".tutorial__prag__num8", {duration: .5, onComplete: function() {
        // makeGunRightClick();
        TutorialAnime.pause();
    }}, "+=2.5")
}

// goToTutorial();

let xPos = gsap.quickTo(".main__ship", "x", {duration: .3, ease: "power4.out"}),
    yPos = gsap.quickTo(".main__ship", "y", {duration: .3, ease: "power4.out"})

function makeMovementForShip() {
    $('.page__tutorial').css("cursor", "none")
    $("body").on("mousemove", (event) => {
        xPos(event.pageX - 120)
        yPos(event.pageY - 120)
    })
    $(".page__tutorial").one("mousemove", () => {
        TutorialAnime.resume()
    })
}

function makeGunRightClick() {
    gameContainer.click(function(event) {
        mainShipBullet.position(event.pageX, event.pageY)
        gameContainer.append(mainShipBullet);
    })
}


makeGunRightClick();