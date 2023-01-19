// register change page effect
gsap.registerEffect({
    name: "changePage",
    effect: (targets) => {
        return gsap.timeline().fromTo(".meteorite__image__container", {
            left: "110%"
        },{
            left: "-110%",
            duration: 8,
            ease: "none"
        }).fromTo(targets, {
            left: "100%"
        },{
            left: "0",
            duration: 4,
            ease: "none"
        }, "-=7")
    },
    extendTimeline: true
})

$('#go__tutorial, #tutorial').click(goToTutorial)
function goToTutorial() {
    let TutorialAnime = gsap.timeline();
    TutorialAnime
    .changePage(".page__tutorial")
}