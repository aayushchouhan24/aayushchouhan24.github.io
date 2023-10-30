const imageInput = document.querySelector(".image input")
const audioInput = document.querySelector(".audio input")

const imageDisplay = document.querySelector(".imagesteg .head img")
const audioDisplay = document.querySelector(".audiosteg .head img")

const imageSecret = document.querySelector(".imagesteg .head p")
const audioSecret = document.querySelector(".audiosteg .head p")



let img = null
let audio = null


document.querySelector('.encrypt-image').addEventListener('click', () => {
  if (!img) alert('Please select an image file.', 'warning')
  else {
    try {
      Stego.encodeImage_LSB(img.src, document.querySelector(".imagesteg .text-input").value, img => {
        imageDisplay.src = img
        imageDisplay.style.opacity = '1'
        imageSecret.style.opacity = '0'
        imageSecret.textContent = ''
        alert("Your secrete message encoded successfully", 'success')
      })
    } catch (error) {
      alert("Encoding unsuccessfully", 'danger')
      console.log(error)
    }
  }
})

document.querySelector('.decrypt-image').addEventListener('click', () => {
  if (!img) alert('Please select an image file.', 'warning')
  else
    try {
      Stego.decodeImage_LSB(img.src, x => {
        imageSecret.textContent = x
        imageSecret.style.opacity = '1'
        imageDisplay.style.opacity = '0'
        alert("Your secret message decoded successfully", 'success')
      })
    }
    catch (error) {
      alert("Decoding unsuccessfully", 'danger')
      console.log(error)
    }
})

imageInput.addEventListener('change', () => {
  img = document.querySelector(".image img")
  img.src = URL.createObjectURL(imageInput.files[0])
  img.style.display = 'block  '
  document.querySelector('.imagesteg').classList.add('activeImage')
})

document.querySelector('.encrypt-audio').addEventListener('click', () => {
  if (!audio) alert('Please select an audio file.', 'warning')
  else
    try {
      Stego.encodeAudio_LSB(audio, document.querySelector(".audiosteg .text-input").value, x => {
        audioElement(x)
        audioDisplay.style.opacity = '1'
        audioSecret.style.opacity = '0'
        audioSecret.textContent = ''
        alert("Your secrete message encoded successfully", 'success')
      })
    } catch (error) {
      alert("Encoding unsuccessfully", 'danger')
      console.log(error)
    }
})

document.querySelector('.decrypt-audio').addEventListener('click', () => {
  if (!audio) alert('Please select an audio file.', 'warning')
  else try {
    Stego.decodeAudio_LSB(audio, x => {
      audioDisplay.style.opacity = '0'
      audioSecret.style.opacity = '1'
      audioSecret.textContent = x
    })
  }
  catch (error) {
    alert("Decoding unsuccessfully", 'danger')
    console.log(error)
  }
})

audioInput.addEventListener('change', () => {
  const audioFile = audioInput.files[0]
  const reader = new FileReader()
  reader.onload = e => audio = e.target.result
  reader.readAsArrayBuffer(audioFile)
  document.querySelector('.audiosteg').classList.add('encodeAudio')
  audioDisplay.style.opacity = '1'
  audioSecret.style.opacity = '0'
  audioSecret.textContent = ''
})

dragElement(document.querySelector('.imagesteg'), document.querySelector('.imagesteg h2'))
dragElement(document.querySelector('.audiosteg'), document.querySelector('.audiosteg h2'))


function audioElement(src) {
  document.querySelector('.audiosteg').classList.add('activeAudio')
  document.querySelector('.audiosteg').classList.remove('encodeAudio')
  document.querySelector("audio").src = src
}

function dragElement(element, trigger) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
  if (document.getElementById(element.id + "header")) document.getElementById(element.id + "header").onmousedown = dragMouseDown
  else trigger.onmousedown = dragMouseDown

  function dragMouseDown(e) {
    e = e || event
    e.preventDefault()
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || event
    e.preventDefault()
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    element.style.top = (element.offsetTop - pos2) + "px"
    element.style.left = (element.offsetLeft - pos1) + "px"
  }

  function closeDragElement() {
    document.onmouseup = null
    document.onmousemove = null
  }
}

function alert(message, type = 'info', duration = 4000) {
  const alert = document.createElement('div')
  alert.classList.add('alert', `alert-${type}`)

  const icon = document.createElement('span')
  icon.classList.add('icon')
  const iconClass = {
    'default': 'fa-superpowers',
    'success': 'fa-check',
    'warning': 'fa-exclamation-triangle',
    'danger': 'fa-close',
    'info': 'fa-info'
  }[type]
  icon.innerHTML = `<i class="fa ${iconClass}"></i>`

  const text = document.createElement('div')
  text.classList.add('text')
  text.innerHTML = `
      <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
      <p>${message}</p>
  `

  const closeButton = document.createElement('button')
  closeButton.classList.add('close')
  closeButton.innerHTML = '<i class="fa fa-close"></i>'

  alert.appendChild(icon)
  alert.appendChild(text)
  alert.appendChild(closeButton)

  closeButton.addEventListener('click', close)

  setTimeout(close, duration)

  function close() {
    alert.classList.add('close')
    alert.addEventListener('transitionend', function (event) {
      if (event.propertyName === 'transform') {
        alert.remove()
      }
    })
  }

  document.body.appendChild(alert)
}