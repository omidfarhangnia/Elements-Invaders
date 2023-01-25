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

const mainShipBulletContainer = $(".main__ship--bullet__container");
const mainShipBlasterContainer = $(".main__ship--blaster__container");

var blaster__num = 1,
    rifle__num = 1,  
    RightClickTimeOut = 0,
    RightClickSetInterval = 0,
    blasterCountingSituation = false,
    isFuelEndless = true;

$('#go__tutorial, #tutorial').click(goToTutorial)

const mainShipSize = {
    width: 100, 
    halfOfWidth: (100 / 2),
    height: 100,
    halfOfHeight: (100 / 2),
};

function idMaker(num) {
    let idLength = `${num}`.length,
    numContainer = num;
    for(var i = 0; i < (9 - idLength); i++){
        numContainer = "0" + numContainer
    }
    return numContainer;
}

let xPos = gsap.quickTo(".main__ship", "x", {duration: .3, ease: "power4.out"}),
    yPos = gsap.quickTo(".main__ship", "y", {duration: .3, ease: "power4.out"});

let TutorialAnime = gsap.timeline();

class mainShipRifle {
    constructor (level, BulletsId, isFuelEndless) {
        this.level = level;
        this.BulletsId = BulletsId;
        this.isFuelEndless = isFuelEndless;
    }
    fireRifle() {
        let fuelContainerHeight = 262.5;
        let fuelContainer = $(".current__fuel__level");
        if(this.isFuelEndless === false){
            let currentFuelLevel = fuelContainer.height();
            let newFuelLevel = currentFuelLevel + (fuelContainerHeight / 100 * 2);
            let newPercent = currentFuelLevel / fuelContainerHeight * 100;
            console.log(currentFuelLevel)
            if(newPercent >= 25){
                fuelContainer.css("background", `#ffe436`);
                if(newPercent >= 50){
                    fuelContainer.css("background", `#ff721b`);
                    if(newPercent >= 75){
                        fuelContainer.css("background", `#ff4c12`);
                        if(newPercent >= 100){
                            fuelContainer.css({"background": `#FF0000`});
                            return;
                        }
                    }
                }
            }
            fuelContainer.css("height", `${newFuelLevel}px`);
        }

        let currentBulletsId = idMaker(this.BulletsId);
    
        if(this.level >= 1){
            let $bullet1 = $(`<div class="mainShip__bullet mainShip__bullet--num--1"></div>`);
            $bullet1.attr("id", currentBulletsId)
            mainShipBulletContainer.append($bullet1)
            
            if(this.level >= 2){
                let $bullet2 = $(`<div class="mainShip__bullet mainShip__bullet--num--2"></div>`);
                $bullet2.attr("id", currentBulletsId)
                mainShipBulletContainer.append($bullet2)
                
                if(this.level === 3){
                    let $bullet3 = $(`<div class="mainShip__bullet mainShip__bullet--num--3"></div>`);
                    $bullet3.attr("id", currentBulletsId)
                    mainShipBulletContainer.append($bullet3)
                }
            }
        }
        
        gsap.to(`.mainShip__bullet[id="${currentBulletsId}"]`, {
            x: 1000,
            duration: .55,
            onComplete: () => {
                $(`.mainShip__bullet[id="${currentBulletsId}"]`).remove();
            }
        })
        
    }
}

class mainShipBlaster {
    constructor(isBlasterReady, blastersId, isCountingActive, allowableBlasterNumber) {
        this.isBlasterReady = isBlasterReady;
        this.blastersId = blastersId;
        this.isCountingActive = isCountingActive;
        this.allowableBlasterNumber = allowableBlasterNumber;
    }
    fireBlaster() {
        if(this.isBlasterReady !== true) return;

        if(this.isCountingActive === true){  
            if(this.allowableBlasterNumber < this.blastersId){
                $(".main__ship__blasterData").addClass("blasterAlarm")
                return;
            }else{
                $(".blaster__num .num").text(`${this.allowableBlasterNumber - this.blastersId}`)
            }
        }

        let currentBlastersId = idMaker(this.blastersId);
        let $blaster1 = $(`<div class="mainShip__blaster mainShip__blaster--num--1"></div>`).attr("id", currentBlastersId);
        let $blaster2 = $(`<div class="mainShip__blaster mainShip__blaster--num--2"></div>`).attr("id", currentBlastersId);
        mainShipBlasterContainer.append([$blaster1, $blaster2])

        gsap.to(`.mainShip__blaster[id="${currentBlastersId}"]`, {
            x: 1000,
            duration: .55,
            onComplete: () => {
                $(`.mainShip__blaster[id="${currentBlastersId}"]`).remove();
            }
        })
    }
}

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
        shipMovement()
        // TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num6 .order", {id: "prag__6__order"})
    }}, "+=2.5")
    .showText(".tutorial__prag__num7", {duration: .5, onStart: function() {
        gsap.getById("prag__6__order").seek(0).kill();
    }}, "+=2")
    .showText(".tutorial__prag__num8", {duration: .5, onComplete: function() {
        makeRifleReady();
        // TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num8 .order", {id: "prag__8__order"})
    }}, "+=2.5")
    .showText(".tutorial__prag__num9", {duration: .5, onComplete: function() {
        makeBlasterReady();
        // TutorialAnime.pause();
        gsap.effects.orderAnime(".tutorial__prag__num9 .order", {id: "prag__9__order"})
    }, onStart: function() {
        gsap.getById("prag__8__order").seek(0).kill()
    }}, "+=3")
    .showText(".tutorial__prag__num10", {duration: .5, onStart: function(){
        gsap.getById("prag__9__order").seek(0).kill()
    }}, "+=3")
    .to(".main__ship__fuelData", {
        right: "0",
        duration: .5,
        ease: "power4.out",
        onStart: fuelContainerIsReady,
    }, "showShipDataContainer")
    .to(".main__ship__blasterData", {
        left: "0",
        duration: .5,
        ease: "power4.out",
        onStart: blasterCounterIsReady,
    }, "showShipDataContainer")

    // .to(".tutorial__texts", {
    //     y: -50,
    //     opacity: 0,
    //     stagger: .1,
    //     ease: "linear"
    // }, "+=3")

    TutorialAnime.progress(1)
}

function makeRifleReady() {
    $("body").on({
        "click": function() {
            let rifle = new mainShipRifle(3, rifle__num, isFuelEndless);
            rifle.fireRifle();
            rifle__num++;
        },
        "mousedown" : function() {
            timeOutId = setTimeout(function() {
                RightClickSetInterval = setInterval(() => {
                    let rifle = new mainShipRifle(3, rifle__num, isFuelEndless);
                    rifle.fireRifle();
                    rifle__num++;
                }, 100);
            }, 500)
        },
        "mouseup" : function() {
            clearTimeout(timeOutId);
            clearTimeout(RightClickSetInterval);
        }
    })

    $(".page__tutorial").one("click", () => {
        TutorialAnime.resume()
    })
}

function makeBlasterReady() {
    $("body").on("keydown", function(event) {
        if(event.originalEvent.code === "Space"){
            let blaster = new mainShipBlaster(true, blaster__num, isCountingActive, 30);
            blaster.fireBlaster();
            blaster__num++;
        }
    })

    $("body").one("keydown", function(event) {
        if(event.originalEvent.code === "Space"){
            TutorialAnime.resume()
        }
    }) 
};

function shipMovement() {
    $('.page__tutorial').css("cursor", "none")
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

function blasterCounterIsReady() {
    isCountingActive = true;
}

function fuelContainerIsReady() {
    isFuelEndless = false;
}