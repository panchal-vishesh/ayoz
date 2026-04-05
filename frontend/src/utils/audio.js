// Real audio files — hosted on reliable CDNs
const SOUNDS = {
  // Metallic bell — cuts through noise (2km urgent)
  bell: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  // Soft digital pop — like WhatsApp (500m info)
  pop: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  // Short repeating beep — warning (6-min)
  beep: 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
}

function createAudio(src, volume = 1) {
  const audio = new Audio(src)
  audio.volume = volume
  return audio
}

// ─── (1) 2km URGENT — Metallic bell, repeating ───────────────────────────────
export function bellAlert() {
  let stopped = false
  let audio = null
  let timeoutId = null

  function play() {
    if (stopped) return
    audio = createAudio(SOUNDS.bell, 0.9)
    audio.play().catch(() => {})
    audio.onended = () => {
      if (!stopped) timeoutId = setTimeout(play, 800)
    }
  }

  play()

  return () => {
    stopped = true
    clearTimeout(timeoutId)
    if (audio) { audio.pause(); audio.currentTime = 0 }
  }
}

// ─── (2) 500m INFORMATIONAL — Soft pop, once ─────────────────────────────────
export function popAlert() {
  const audio = createAudio(SOUNDS.pop, 0.7)
  audio.play().catch(() => {})
}

// ─── (3) 6-Min WARNING — Repeating beep until stopped ────────────────────────
export function warningBeep() {
  let stopped = false
  let audio = null
  let timeoutId = null

  function play() {
    if (stopped) return
    audio = createAudio(SOUNDS.beep, 0.8)
    audio.play().catch(() => {})
    audio.onended = () => {
      if (!stopped) timeoutId = setTimeout(play, 600)
    }
  }

  play()

  return () => {
    stopped = true
    clearTimeout(timeoutId)
    if (audio) { audio.pause(); audio.currentTime = 0 }
  }
}

// Legacy
export function beep() { popAlert() }
export function startAlertSound() { return bellAlert() }
