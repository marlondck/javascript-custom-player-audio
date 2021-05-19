import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playIconContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const seekSlider = document.getElementById('seek-slider');
const currentTimeContainer = document.getElementById('current-time');

let state = 'play';
// request animation frame
let raf = null;

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

// trocar o texto da duracao no dom
const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
}

// definir a prop max do input range com o valor correto do audio
const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
}

// mostrar o progresso
const showRangeProgress = (rangeInput) => {
  if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});

const displayBufferedAmount = () => {
  const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
  audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
}

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
  raf = requestAnimationFrame(whilePlaying);
}


// Audio carregado
// audio.addEventListener('loadedmetadata', () => {
//   displayAudioDuration(audio.duration);
// });

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
  displayBufferedAmount();
} else {
  audio.addEventListener('loadedmetadata', () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
  });
}

// mostrar o buffer
audio.addEventListener('progress', displayBufferedAmount);

// mostrar em texto o tempo atual
seekSlider.addEventListener('input', () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
});

// tocar a partir de um ponto do range
seekSlider.addEventListener('change', () => {
  audio.currentTime = seekSlider.value;

  if(!audio.paused) {
    requestAnimationFrame(whilePlaying);
  }
});
audio.addEventListener('timeupdate', () => {
  seekSlider.value = Math.floor(audio.currentTime);
});

// Click no botão
playIconContainer.addEventListener('click', () => {
  if(state === 'play') {
    audio.play();
    animation.playSegments([14, 27], true);
    requestAnimationFrame(whilePlaying);
    state = 'pause';
  } else {
    audio.pause();
    animation.playSegments([0, 14], true);
    cancelAnimationFrame(raf);
    state = 'play';
  }
});

