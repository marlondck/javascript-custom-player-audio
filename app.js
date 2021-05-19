import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playIconContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const seekSlider = document.getElementById('seek-slider');
const currentTimeContainer = document.getElementById('current-time');

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
});
audio.addEventListener('timeupdate', () => {
  seekSlider.value = Math.floor(audio.currentTime);
});

// Click no botão
playIconContainer.addEventListener('click', () => {
  if(state === 'play') {
    audio.play();
    animation.playSegments([14, 27], true);
    state = 'pause';
  } else {
    audio.pause();
    animation.playSegments([0, 14], true);
    state = 'play';
  }
});

