const scribble = require('scribbletune')

let perc = scribble.clip({
  note: ['c3'],
  pattern: 'x--xx-x--x-x--x'
})

scribble.midi(perc)