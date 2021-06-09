window.addEventListener('load', function() {
  lazyVideo()
})

function lazyVideo() {
  const videos = Array.from(document.querySelectorAll('video'))
  .map(video => {
    return {
      element: video,
      state: 'needLoading',
      top: video.getBoundingClientRect().top + video.getBoundingClientRect().height + pageYOffset,
      bottom: video.getBoundingClientRect().top + pageYOffset
    }
  })
  videos.forEach(obj => {
    if ( obj.state === 'needLoading' ) {
      obj.element.addEventListener('canplaythrough', playVideo)
    }
    function playVideo() {
      obj.element.play()
      obj.element.removeEventListener('canplaythrough', playVideo)
      obj.state = 'loaded'
    }
  })

  let topScreenBorder = window.pageYOffset
  let bottomScreenBorder = window.pageYOffset + window.innerHeight
  window.addEventListener('scroll', function(e) {
    topScreenBorder = window.pageYOffset
    bottomScreenBorder = window.pageYOffset + window.innerHeight
    controlVideoState()
  })
  window.addEventListener('resize', function(e) {
    videos.forEach(video => {
      video.positionY = video.element.getBoundingClientRect().top + video.element.getBoundingClientRect().height
    })
  })
  controlVideoState()
  function controlVideoState() {
    videos.forEach(video => {
      if (topScreenBorder <= video.top && bottomScreenBorder >= video.bottom) {
        startVideo(video.element)
      } else {
        pauseVideo(video.element)
      }
    })
  }
  function startVideo(video) {
    let HAVE_ENOUGH_DATA = 4
    if (video) {
      if (video.readyState === HAVE_ENOUGH_DATA) {
        if (video.paused) {
          video.play()
          console.log('video continuued')
        }
      } else {
        console.log('video load')
        video.load()
      }
    }
  }
  function pauseVideo(video) {
    if (video) {
      if (!video.paused) {
        video.pause()
        console.log('video paused')
      }
    }
  }
}
