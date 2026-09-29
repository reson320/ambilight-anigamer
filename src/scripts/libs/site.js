// Site integration for 巴哈姆特動畫瘋 (https://ani.gamer.com.tw)
//
// The player is a video.js player:
//
// #BH_background                        <- page content (ambient light is prepended here)
//   .container-player(.fullwindow)      <- .fullwindow = theater mode
//     section.player
//       .videoframe(.vjs-fullwindow)
//         #video-container
//           video-js#ani_video.video-js (.vjs-fullscreen)
//             video.vjs-tech            <- object-fit: contain
//             .vjs-control-bar
//               .control-bar-rightbtn   <- settings button is added here
//       .subtitle                       <- danmu list next to the player
// .top_sky                              <- fixed page header

export const SITE_NAME = '動畫瘋';

export const selectors = {
  content: '#BH_background',
  header: '.top_sky',
  playerContainer: '.container-player',
  videoFrame: '.videoframe',
  videoPlayer: '.video-js',
  video: '.video-js video.vjs-tech',
  controlsRight: '.control-bar-rightbtn',
};

export const THEATER_CLASS = 'fullwindow';
export const FULLSCREEN_CLASS = 'vjs-fullscreen';
export const ENDED_CLASS = 'vjs-ended';
export const PLAYING_CLASS = 'vjs-playing';

// Height of the fixed page header, used to detect when the video is scrolled
// behind the header
export const HEADER_HEIGHT = 100;

export const isWatchPageUrl = () =>
  location.pathname.startsWith('/animeVideo.php');

export const getVideoElem = () => document.querySelector(selectors.video);

export const getPlayerContainerElem = (videoElem) =>
  videoElem?.closest(selectors.playerContainer) ?? null;

export const isTheaterView = (videoElem) =>
  !!getPlayerContainerElem(videoElem)?.classList.contains(THEATER_CLASS);

// The video element fills the whole player and letterboxes its content with
// object-fit: contain. Returns the rectangle of the visible video pixels
// relative to the video element.
export const getVideoContentBox = (videoElem) => {
  const width = videoElem.clientWidth;
  const height = videoElem.clientHeight;
  const videoWidth = videoElem.videoWidth;
  const videoHeight = videoElem.videoHeight;
  if (!width || !height || !videoWidth || !videoHeight) {
    return { left: 0, top: 0, width, height };
  }

  const scale = Math.min(width / videoWidth, height / videoHeight);
  const contentWidth = videoWidth * scale;
  const contentHeight = videoHeight * scale;
  return {
    left: (width - contentWidth) / 2,
    top: (height - contentHeight) / 2,
    width: contentWidth,
    height: contentHeight,
  };
};

// Like getBoundingClientRect, but only the visible video pixels
export const getVideoContentClientRect = (videoElem) => {
  const rect = videoElem.getBoundingClientRect();
  const box = getVideoContentBox(videoElem);
  // The rect can be scaled by a transform on the video element
  const scaleX = videoElem.clientWidth ? rect.width / videoElem.clientWidth : 1;
  const scaleY = videoElem.clientHeight
    ? rect.height / videoElem.clientHeight
    : 1;
  return {
    left: rect.left + box.left * scaleX,
    top: rect.top + box.top * scaleY,
    width: box.width * scaleX,
    height: box.height * scaleY,
  };
};
