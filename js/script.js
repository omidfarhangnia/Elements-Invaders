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

const mainShipSize = {
    width: 100, 
    halfOfWidth: (100 / 2),
    height: 100,
    halfOfHeight: (100 / 2),
};
const gameContainer = $(".game__container");
const mainShipBulletContainer = $(".main__ship--bullet__container");
mainShipBulletContainer.data("gunLevel", 1);

$('#go__tutorial, #tutorial').click(goToTutorial)

let TutorialAnime = gsap.timeline();

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
        makeGunRightClick();
        TutorialAnime.pause();
    }}, "+=2.5")
    .showText(".tutorial__prag__num9", {duration: .5}, "+=4")
}

let xPos = gsap.quickTo(".main__ship", "x", {duration: .3, ease: "power4.out"}),
    yPos = gsap.quickTo(".main__ship", "y", {duration: .3, ease: "power4.out"})

function makeMovementForShip() {
    // $('.page__tutorial').css("cursor", "none")
    $("body").on("mousemove", (event) => {
        let page__width = window.innerWidth,
            page__height = window.innerHeight

        xPos(gsap.utils.clamp(0, (page__width - mainShipSize.width) , (event.pageX - mainShipSize.halfOfWidth)))
        yPos(gsap.utils.clamp(0, (page__height - mainShipSize.height), (event.pageY - mainShipSize.halfOfHeight)))

        // i used utils.clamp for having a condition for controlling the ship without
        // this condition my ship will gone out of VIEW PORT 
    })
    // $(".page__tutorial").one("mousemove", () => {
    //     TutorialAnime.resume()
    // })
}
makeMovementForShip();

function makeGunRightClick() {
    gameContainer.click(function(event) {

        switch (mainShipBulletContainer.data("gunLevel")) {
            case 1:
              day = "Sunday";
              break;
            case 2:
               day = "Tuesday";
              break;
            case 3:
              day = "Wednesday";
              break;
          }
        mainShipBulletContainer.append()
    })
}
// makeGunRightClick();