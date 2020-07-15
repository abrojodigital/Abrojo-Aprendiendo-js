const scribble = require('scribbletune')

let perc = scribble.clip({
  notes: ['c2'],
  pattern: 'x-x-x--x'
})

scribble.midi(perc)