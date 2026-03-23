export function beep() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext

  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.frequency.value = 880
  oscillator.type = 'square'
  gain.gain.value = 0.2
  oscillator.start()

  setTimeout(() => {
    oscillator.stop()
    ctx.close()
  }, 360)
}
