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

const mainShipBulletContainer = $(".main__ship--bullet__container");
mainShipBulletContainer.data("gunLevel", 3);
var id = 1,
    RightClickTimeOut = 0,
    RightClickSetInterval = 0;

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
    $("body").on("click", bulletShoot)
    $("body").on("mousedown", function() {
        timeOutId = setTimeout(function() {
            RightClickSetInterval = setInterval(() => {
                bulletShoot()
            }, 100);
        }, 500)
    }).on("mouseup click", function() {
        clearTimeout(timeOutId);
        clearTimeout(RightClickSetInterval);
    })
}
makeGunRightClick()

function bulletShoot() {
    let BulletsId = giveBulletsId();
    
    if(mainShipBulletContainer.data("gunLevel") >= 1){
        firstGunShoot(BulletsId)
        if(mainShipBulletContainer.data("gunLevel") >= 2){
            secondGunShoot(BulletsId)
            if(mainShipBulletContainer.data("gunLevel") === 3){
                thirdGunShoot(BulletsId)
            }
        }
    }

    addAnimeToBullet(BulletsId)

    id++;
}

function giveBulletsId() {
    let idLength = `${id}`.length,
    BulletId = id;
    for(var i = 0; i < (9 - idLength); i++){
        BulletId = "0" + BulletId
    }
    return BulletId;
}

function firstGunShoot(id) {
    let $bullet1 = $(`<div class="mainShip__bullet mainShip__bullet--num--1"></div>`);
    $bullet1.attr("id", id)
    mainShipBulletContainer.append($bullet1)
}

function secondGunShoot(id) {
    let $bullet2 = $(`<div class="mainShip__bullet mainShip__bullet--num--2"></div>`);
    $bullet2.attr("id", id)
    mainShipBulletContainer.append($bullet2)
}

function thirdGunShoot(id) {
    let $bullet3 = $(`<div class="mainShip__bullet mainShip__bullet--num--3"></div>`);
    $bullet3.attr("id", id)
    mainShipBulletContainer.append($bullet3)
}

function addAnimeToBullet(id) {
    $(`.mainShip__bullet[id="${id}"]`)
    gsap.set(`.mainShip__bullet[id="${id}"]`, {position: "fixed"});
    gsap.to(`.mainShip__bullet[id="${id}"]`, {
        x: 1000,
        duration: .55,
        onComplete: () => {
            $(`.mainShip__bullet[id="${id}"]`).remove();
        }
    })
}