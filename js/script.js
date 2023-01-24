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
            onStart: config.onStart,
            ease: "expo.out",
        })
    },
    extendTimeline: true
})

gsap.registerEffect({
    name: "orderAnime",
    effect: (target, config) => {
        return gsap.to(target,{
            opacity: 0,
            duration: .5,
            repeat: -1,
            yoyo: true,
            id: config.id
        })
    },
    extendTimeline: true
});

const mainShipSize = {
    width: 100, 
    halfOfWidth: (100 / 2),
    height: 100,
    halfOfHeight: (100 / 2),
};

const mainShipBulletContainer = $(".main__ship--bullet__container");
const mainShipBlasterContainer = $(".main__ship--blaster__container");
mainShipBulletContainer.data("gunLevel", 3);
var BulletId = 1,
    BlasterId = 1,
    isBlasterReady = true,
    RightClickTimeOut = 0,
    RightClickSetInterval = 0;

$('#go__tutorial, #tutorial').click(goToTutorial)

let TutorialAnime = gsap.timeline().timeScale(11);

goToTutorial()
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
    // i want to hide my wish
    .showText(".tutorial__prag__num2", {duration: .5}, "+=1")
    .showText(".tutorial__prag__num3", {duration: .5}, "+=2.5")
    .fromTo(".main__ship", {
        y: window.innerHeight,
        x: (window.innerWidth / 2) - mainShipSize.halfOfWidth
    },{
        duration: 1.3,
        y: "-=500",
        ease: "back.out(.6)"
    })
    .showText(".tutorial__prag__num4", {duration: .5}, "+=1")
    .showText(".tutorial__prag__num5", {duration: .5}, "+=2.5")
    .showText(".tutorial__prag__num6", {duration: .5, onComplete: function() {
        makeMovementForShip();
        TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num6 .order", {id: "prag__6__order"})
    }}, "+=2.5")
    .showText(".tutorial__prag__num7", {duration: .5, onStart: function() {
        gsap.getById("prag__6__order").seek(0).kill();
    }}, "+=2")
    .showText(".tutorial__prag__num8", {duration: .5, onComplete: function() {
        makeGunReady();
        TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num8 .order", {id: "prag__8__order"})
    }}, "+=2.5")
    .showText(".tutorial__prag__num9", {duration: .5, onComplete: function() {
        makeBlasterReady()
        TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num9 .order", {id: "prag__9__order"})
    }, onStart: function() {
        gsap.getById("prag__8__order").seek(0).kill()
    }}, "+=3")
    .showText(".tutorial__prag__num10", {duration: .5, onComplete: function(){    
        gsap.effects.orderAnime(".tutorial__prag__num10 .order", {id: "prag__10__order"})
    }, onStart: function(){
        gsap.getById("prag__9__order").seek(0).kill()
    }}, "+=3")
}

let xPos = gsap.quickTo(".main__ship", "x", {duration: .3, ease: "power4.out"}),
    yPos = gsap.quickTo(".main__ship", "y", {duration: .3, ease: "power4.out"})

function makeMovementForShip() {
    // $('.page__tutorial').css("cursor", "none")
    $(".page__tutorial").on("mousemove", (event) => {
        let page__width = window.innerWidth,
            page__height = window.innerHeight

        xPos(gsap.utils.clamp(0, (page__width - mainShipSize.width) , (event.pageX - mainShipSize.halfOfWidth)))
        yPos(gsap.utils.clamp(0, (page__height - mainShipSize.height), (event.pageY - mainShipSize.halfOfHeight)))

        // i used utils.clamp for having a condition for controlling the ship without
        // this condition my ship will gone out of VIEW PORT 
    })
    $(".page__tutorial").one("mousemove", () => {
        TutorialAnime.resume()
    })
}

function makeBlasterReady() {
    $("body").on("keydown", function(event) {
        if(event.originalEvent.code === "Space"){
            blasterShoot()
        }
    })

    $("body").one("keydown", function(event) {
        if(event.originalEvent.code === "Space"){
            TutorialAnime.resume()
        }
    }) 
}

function blasterShoot() {
    if(isBlasterReady !== true) return;

    let BlastersId = giveCurrentId(BlasterId);

    putBlasters(BlastersId)

    addAnimeToBlaster(BlastersId);

    BlasterId++;
}

function addAnimeToBlaster(id) {
    gsap.to(`.mainShip__blaster[id="${id}"]`, {
        x: 1000,
        duration: .55,
        onComplete: () => {
            $(`.mainShip__blaster[id="${id}"]`).remove();
        }
    })
}

function putBlasters(id) {
    let $blaster1 = $(`<div class="mainShip__blaster mainShip__blaster--num--1"></div>`).attr("id", id);
    let $blaster2 = $(`<div class="mainShip__blaster mainShip__blaster--num--2"></div>`).attr("id", id);
    mainShipBlasterContainer.append([$blaster1, $blaster2])
}

function makeGunReady() {
    $("body").on({
        "click": bulletShoot,
        // "mousedown" : function() {
        //     timeOutId = setTimeout(function() {
        //         RightClickSetInterval = setInterval(() => {
        //             bulletShoot()
        //         }, 100);
        //     }, 500)
        // },
        // "mouseup click" : function() {
        //     clearTimeout(timeOutId);
        //     clearTimeout(RightClickSetInterval);
        // }
    })

    $(".page__tutorial").one("click", () => {
        TutorialAnime.resume()
    })
}

function bulletShoot() {
    let BulletsId = giveCurrentId(BulletId);
    
    if(mainShipBulletContainer.data("gunLevel") >= 1){
        putFirstBullet(BulletsId)
        if(mainShipBulletContainer.data("gunLevel") >= 2){
            putSecondBullet(BulletsId)
            if(mainShipBulletContainer.data("gunLevel") === 3){
                putThirdBullet(BulletsId)
            }
        }
    }

    addAnimeToBullet(BulletsId)

    BulletId++;
}

function giveCurrentId(customId) {
    let idLength = `${customId}`.length,
    customIdContainer = customId;
    for(var i = 0; i < (9 - idLength); i++){
        customIdContainer = "0" + customIdContainer
    }
    return customIdContainer;
}

function putFirstBullet(id) {
    let $bullet1 = $(`<div class="mainShip__bullet mainShip__bullet--num--1"></div>`);
    $bullet1.attr("id", id)
    mainShipBulletContainer.append($bullet1)
}

function putSecondBullet(id) {
    let $bullet2 = $(`<div class="mainShip__bullet mainShip__bullet--num--2"></div>`);
    $bullet2.attr("id", id)
    mainShipBulletContainer.append($bullet2)
}

function putThirdBullet(id) {
    let $bullet3 = $(`<div class="mainShip__bullet mainShip__bullet--num--3"></div>`);
    $bullet3.attr("id", id)
    mainShipBulletContainer.append($bullet3)
}

function addAnimeToBullet(id) {
    gsap.to(`.mainShip__bullet[id="${id}"]`, {
        x: 1000,
        duration: .55,
        onComplete: () => {
            $(`.mainShip__bullet[id="${id}"]`).remove();
        }
    })
}