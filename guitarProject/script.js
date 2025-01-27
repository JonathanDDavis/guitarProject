const volume = document.getElementById('volume')
const bass = document.getElementById('bass')
const mid = document.getElementById('mid')
const treble = document.getElementById('treble')
const visualizer = document.getElementById('visualizer')

const context = new AudioContext()
const analyserNode = new AnalyerNode(context, { fftSize: 256 })

setupContext()
drawVisualizer()

async function setupContext() {
  const guitar = await getGuitar()
  if (context.state === 'suspended') {
    await context.resume()
  }
  const source = context.createMediaSource(guitar)
  source
  .connect(analyserNode)
  .connect(context.destination)
}

function getGuitar() {
  return navigator.mediaDevices.gerUserMedia({
    audio: {
      exhoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency; 0
    }
  })
}

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer)
  
  const bufferLength = analyserNode.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyserNode.getByteFrequencyData(dataArray)
  const width = visualizer.width
  const height = visualizer.height
  const barWidth = width / bufferLength
  
  const canvasContext = visualizer.getContext('2d')
  canvasContext.clearRect(0, 0, width, height)
  
  dataArray.forEach((item, index) => {
    const y = item/ 255 * height / 2
    const x = barWidth * index
    
    canvasContext.fillStyle = 'rgb(0, 0, 0)'
    canvasContext.fillRect(x, height - y, barWidth, y)
  })
}