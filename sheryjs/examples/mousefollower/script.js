const pane = new tweakpane.Pane({title:'Debug Panel'})
const parm = {
    skew: true,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
}

pane.addBinding(parm,'skew')
pane.addBinding(parm,'duration')

Shery.mouseFollower(parm)