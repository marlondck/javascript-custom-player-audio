import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playIconContainer = document.getElementById('play-icon');
const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');

let state = 'play';

// Animarion
const animation = lottieWeb.loadAnimation({
  container: playIconContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Demo Animation",
});

animation.goToAndStop(14, true);


// Util para formatação do tempo
const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

//
const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
}

// Audio carregado
audio.addEventListener('loadedmetadata', () => {
  displayAudioDuration(audio.duration);
});

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
if (audio.readyState > 0) {
  displayDuration();
} else {
  audio.addEventListener('loadedmetadata', () => {
    displayDuration();
  });
}


// Click no botão
playIconContainer.addEventListener('click', () => {
  if(state === 'play') {
    animation.playSegments([14, 27], true);
    state = 'pause';
  } else {
    animation.playSegments([0, 14], true);
    state = 'play';
  }
});