import { supportsColorMix, supportsWebGL } from './generic';
import { getBrowser } from './utils';

const SettingsConfig = [
  {
    type: 'section',
    label: '設定',
    name: 'sectionSettingsCollapsed',
    default: true,
  },
  {
    name: 'advancedSettings',
    label: '進階設定',
    type: 'checkbox',
    default: false,
  },
  {
    type: 'section',
    label: '統計資訊',
    name: 'sectionStatsCollapsed',
    default: true,
    advanced: true,
  },
  {
    name: 'showFPS',
    label: '幀率',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showFrametimes',
    label: '幀時間圖表',
    description: '耗用：CPU',
    questionMark: {
      title:
        '測得的螢幕幀率並不代表實際效能，因為測量本身會額外耗用 CPU。\n不過這項統計可以幫助排查其他問題。',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showResolutions',
    label: '解析度與繪製時間',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'showBarDetectionStats',
    label: '黑邊偵測',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '品質',
    name: 'sectionQualityPerformanceCollapsed',
    default: true,
  },
  {
    name: 'webGL',
    label: 'WebGL 渲染器（較省電）',
    description: '變更後會重新載入網頁',
    type: 'checkbox',
    default: true,
  },
  {
    name: 'resolution',
    label: '解析度',
    type: 'list',
    default: 100,
    unit: '%',
    valuePoints: (() => {
      const points = [6.25];
      while (points[points.length - 1] < 400) {
        points.push(points[points.length - 1] * 2);
      }
      return points;
    })(),
    manualinput: false,
  },
  {
    name: 'framerateLimit',
    label: '幀率上限（每秒）',
    type: 'list',
    default: 60,
    min: 0,
    max: 60,
    step: 1,
  },
  {
    name: 'frameSync',
    label: '同步方式',
    questionMark: {
      title:
        '要花多少資源讓環境光與影片畫面同步。\n\n解碼幀率：CPU 與 GPU 用量最低。\n可能會掉幀或延遲。\n\n螢幕幀率：CPU 與 GPU 用量最高。\n在高更新率螢幕（120Hz 以上）或高於 1080p 的影片上仍可能延遲。\n\n影片幀率：CPU 與 GPU 用量最低。\n使用最新的瀏覽器技術讓畫面保持同步。',
    },
    type: 'list',
    default: 2,
    min: 0,
    max: 2,
    step: 1,
    snapPoints: [
      { value: 0, label: '解碼' },
      { value: 1, label: '螢幕' },
      { value: 2, label: '影片' },
    ],
    manualinput: false,
    advanced: true,
    experimental: true,
  },
  {
    name: 'prioritizePageLoadSpeed',
    label: '優先網頁載入速度',
    description: '網頁載入完成後才載入環境光',
    type: 'checkbox',
    default: true,
  },
  {
    name: 'debandingBlendMode',
    label: '去色帶最佳化對象',
    questionMark: {
      title:
        '一般混合模式適合修正 LCD 螢幕暗部的色帶。\nOLED 螢幕建議使用「疊加」混合模式以保留純黑。',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 1,
    step: 1,
    snapPoints: [
      { value: 0, label: 'LCD（一般）' },
      { value: 1, label: 'OLED（疊加）' },
    ],
    manualinput: false,
    advanced: true,
    new: true,
  },
  {
    type: 'section',
    label: '頁首',
    name: 'sectionOtherPageHeaderCollapsed',
    default: true,
  },
  {
    name: 'hideHeader',
    label: '自動隱藏頁首',
    description: '滑鼠移到頁首時才顯示',
    type: 'checkbox',
    default: false,
  },
  {
    name: 'headerShadowSize',
    label: '陰影大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerShadowOpacity',
    label: '陰影不透明度',
    type: 'list',
    default: 30,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerImagesOpacity',
    label: '圖片不透明度',
    type: 'list',
    default: 100,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'headerFillOpacity',
    label: '背景不透明度',
    description: '只在向下捲動後生效',
    type: 'list',
    default: 100,
    min: -100,
    max: 100,
    step: 0.1,
    advanced: true,
  },

  {
    type: 'section',
    label: '頁面內容',
    name: 'sectionOtherPageContentCollapsed',
    default: true,
  },
  {
    name: 'surroundingContentShadowSize',
    label: '陰影大小',
    type: 'list',
    default: 15,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentShadowOpacity',
    label: '陰影不透明度',
    type: 'list',
    default: 30,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentTextAndBtnOnly',
    label: '只在文字與按鈕加上陰影',
    description: '減少捲動與影片卡頓',
    type: 'checkbox',
    advanced: true,
    default: true,
  },
  {
    name: 'surroundingContentImagesOpacity',
    label: '圖片不透明度',
    type: 'list',
    default: 100,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'surroundingContentFillOpacity',
    label: '按鈕與區塊背景不透明度',
    type: 'list',
    default: 10,
    min: -100,
    max: 100,
    step: 0.1,
  },
  {
    name: 'pageBackgroundGreyness',
    label: '背景灰度',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'hideDanmuList',
    label: '隱藏彈幕列表',
    description: '讓播放器右側也透出環境光',
    type: 'checkbox',
    default: false,
  },
  {
    name: 'hideScrollbar',
    label: '隱藏捲軸',
    type: 'checkbox',
    advanced: true,
    default: false,
  },
  {
    type: 'section',
    label: '影片',
    name: 'sectionVideoResizingCollapsed',
    default: true,
  },
  {
    name: 'videoScale.SMALL',
    label: '大小（一般模式）',
    type: 'list',
    default: 100,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'videoScale.THEATER',
    label: '大小（劇院模式）',
    description: '縮小影片讓四周露出環境光',
    type: 'list',
    default: 85,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'videoScale.FULLSCREEN',
    label: '大小（全螢幕）',
    type: 'list',
    default: 100,
    min: 25,
    max: 200,
    step: 0.1,
    new: true,
  },
  {
    name: 'fullscreenBarsEnabled',
    label: '全螢幕時黑邊顯示環境光',
    description:
      '螢幕比例與影片不同時（例如 21:9 螢幕），讓影片旁的黑邊也亮起環境光',
    type: 'checkbox',
    default: true,
    new: true,
  },
  {
    name: 'videoShadowSize',
    label: '陰影大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'videoShadowOpacity',
    label: '陰影不透明度',
    type: 'list',
    default: 50,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'chromiumBugVideoJitterWorkaround',
    label: '影片抖動修正',
    description: '耗用：CPU 與 GPU',
    questionMark: {
      title:
        'Chromium 的一個錯誤會讓影片在更新率高於 60Hz 的螢幕上抖動。\n這個修正會強制瀏覽器以螢幕的更新率執行來避免抖動。\n點擊問號查看這個 Chromium 錯誤的詳細資訊（英文）。',
      href: 'https://github.com/WesselKroos/youtube-ambilight/issues/166',
    },
    type: 'checkbox',
    default: false, // Should not be enabled by default because it also adds CPU & GPU overhead on 60Hz displays. (60Hz+ detection keeps toggling between off/on when VRR is enabled in the OS.)
    advanced: true,
  },
  {
    name: 'chromiumDirectVideoOverlayWorkaround',
    label: '影片破圖修正',
    description: '使用 NVIDIA RTX 影片超解析度（VSR）時\n必須關閉這個修正',
    questionMark: {
      title: `當影片使用硬體加速覆蓋層（MPO）時，
這個修正可以解決幾種破圖或錯誤，
例如隨機出現黑白方塊、閃爍或影片被壓扁。

點擊問號查看這些問題的詳細資訊（英文）。`,
      href: 'https://github.com/WesselKroos/youtube-ambilight/blob/master/TROUBLESHOOT.md#3-nvidia-rtx-video-super-resolution-vsr--nvidia-rtx-video-hdr-does-not-work',
    },
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '移除黑邊與色邊',
    name: 'sectionHorizontalBarsCollapsed',
    default: true,
  },
  {
    name: 'detectHorizontalBarSizeEnabled',
    label: '移除上下黑邊',
    description: '耗用：CPU',
    type: 'checkbox',
    default: false,
    defaultKey: 'B',
  },
  {
    name: 'detectVerticalBarSizeEnabled',
    label: '移除左右黑邊',
    description: '耗用：CPU',
    type: 'checkbox',
    default: false,
    defaultKey: 'V',
  },
  {
    name: 'detectColoredHorizontalBarSizeEnabled',
    label: '偵測：也移除彩色邊',
    type: 'checkbox',
    default: false,
  },
  {
    name: 'detectHorizontalBarSizeOffsetPercentage',
    label: '偵測：偏移',
    type: 'list',
    default: 0,
    min: -5,
    max: 5,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'barSizeDetectionAverageHistorySize',
    label: '偵測：平均幀數',
    questionMark: {
      title:
        '用多少幀畫面來計算平均黑邊大小。\n幀數越少偵測越快，\n但誤判也會增加。',
    },
    type: 'list',
    default: 4,
    min: 1,
    max: 30,
    step: 1,
    advanced: true,
  },
  {
    name: 'barSizeDetectionAllowedElementsPercentage',
    label: '偵測：確定度門檻',
    questionMark: {
      title:
        '10% 時只會移除明確的黑邊。\n百分比越高，越能移除帶有少量元素的黑邊。\n再更高時可能會裁切到畫面中央的方形元素。',
    },
    type: 'list',
    default: 20,
    min: 10,
    max: 90,
    step: 10,
    // advanced: true,
  },
  {
    name: 'barSizeDetectionAllowedUnevenBarsPercentage',
    label: '偵測：不對稱門檻',
    questionMark: {
      title:
        '百分比越高，越能偵測上下不對稱的黑邊，\n例如上方黑邊比下方小。\n但百分比太高也會增加把直線物體誤判為黑邊的風險。',
    },
    type: 'list',
    default: 10,
    min: 1,
    max: 50,
    step: 1,
    advanced: true,
    new: true,
  },
  {
    name: 'horizontalBarsClipPercentage',
    label: '上下黑邊大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 40,
    step: 0.1,
    snapPoints: [
      { value: 8.7, label: 8 },
      { value: 12.3, label: 12, flip: true },
      { value: 13.5, label: 13 },
    ],
    advanced: true,
  },
  {
    name: 'verticalBarsClipPercentage',
    label: '左右黑邊大小',
    type: 'list',
    default: 0,
    min: 0,
    max: 40,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'horizontalBarsClipPercentageReset',
    label: '換下一集時重設黑邊',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'detectVideoFillScaleEnabled',
    label: '放大影片填滿移除的黑邊',
    type: 'checkbox',
    default: false,
    defaultKey: 'H',
  },
  {
    type: 'section',
    label: '濾鏡',
    name: 'sectionImageAdjustmentCollapsed',
    default: true,
  },
  {
    name: 'brightness',
    label: '亮度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
  },
  {
    name: 'contrast',
    label: '對比',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    advanced: true,
  },
  {
    name: 'vibrance',
    label: '色彩鮮豔度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 0.1,
  },
  {
    name: 'saturation',
    label: '飽和度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
  },
  {
    type: 'section',
    label: 'HDR 濾鏡',
    name: 'sectionHdrImageAdjustmentCollapsed',
    default: false,
    hdr: true,
  },
  {
    name: 'hdrBrightness',
    label: '亮度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    name: 'hdrContrast',
    label: '對比',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    name: 'hdrSaturation',
    label: '飽和度',
    type: 'list',
    default: 100,
    min: 0,
    max: 200,
    step: 1,
    hdr: true,
  },
  {
    type: 'section',
    label: '方向',
    name: 'sectionDirectionsCollapsed',
    default: true,
    advanced: true,
  },
  {
    name: 'directionTopEnabled',
    label: '上',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionRightEnabled',
    label: '右',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionBottomEnabled',
    label: '下',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    name: 'directionLeftEnabled',
    label: '左',
    type: 'checkbox',
    default: true,
    advanced: true,
  },
  {
    type: 'section',
    label: '環境光',
    name: 'sectionAmbientlightCollapsed',
    default: false,
  },
  {
    name: 'blur2',
    label: '模糊',
    description: '耗用：GPU 記憶體',
    type: 'list',
    default: 20,
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    name: 'edge',
    label: '邊緣大小',
    description: '把模糊調到 0% 更容易看出變化',
    type: 'list',
    default: 12,
    min: 2,
    max: 50,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'spread',
    label: '擴散範圍',
    description: '耗用：GPU',
    type: 'list',
    default: 50,
    min: 0,
    max: 400,
    step: 0.1,
  },
  {
    name: 'spreadFadeStart',
    label: '擴散淡出起點',
    type: 'list',
    default: 15,
    min: -50,
    max: 100,
    step: 0.1,
    advanced: true,
  },
  {
    name: 'spreadFadeCurve',
    label: '擴散淡出曲線',
    description: '把模糊調到 0% 更容易看出變化',
    type: 'list',
    default: 35,
    min: 1,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'debandingStrength',
    label: '去色帶（雜訊）',
    questionMark: {
      title:
        '點擊查看雜訊／抖色（dithering）的說明（英文）。\n提示：OLED 螢幕可以把「品質 > 去色帶最佳化對象」設為「OLED」以保留純黑。',
      href: 'https://www.lifewire.com/what-is-dithering-4686105',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'frameFading',
    label: '淡入時間',
    description: '耗用：GPU 記憶體',
    questionMark: {
      title: '環境光變化時的淡入淡出時間',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 21.2, // 15 seconds
    step: 0.02,
    manualinput: false,
  },
  {
    name: 'flickerReduction',
    label: '減少閃爍',
    questionMark: {
      title: '限制環境光亮度變化的速度來減少閃爍',
    },
    type: 'list',
    default: 0,
    min: 0,
    max: 100,
    step: 1,
    manualinput: false,
    advanced: true,
  },
  {
    name: 'frameBlending',
    label: '平滑動態（幀混合）',
    questionMark: {
      title: '點擊查看幀混合的說明（英文）',
      href: 'https://www.youtube.com/watch?v=m_wfO4fvH8M&t=81s',
    },
    description: '耗用：GPU',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    name: 'frameBlendingSmoothness',
    label: '平滑動態強度',
    type: 'list',
    default: 80,
    min: 0,
    max: 100,
    step: 1,
    advanced: true,
  },
  {
    name: 'fixedPosition',
    label: '固定位置',
    description: '忽略網頁的捲動位置',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '檢視模式',
    name: 'sectionViewsCollapsed',
    default: false,
  },
  {
    name: 'enableInViews',
    label: '啟用於',
    type: 'list',
    manualinput: false,
    default: 0,
    min: 0,
    max: 5,
    step: 1,
    snapPoints: [
      { value: 0, label: '全部' },
      { value: 1, label: '一般' },
      { value: 2, hiddenLabel: '一般與劇院' },
      { value: 3, label: '劇院' },
      { value: 4, hiddenLabel: '劇院與全螢幕' },
      { value: 5, label: '全螢幕' },
    ],
  },
  {
    name: 'enableInPictureInPicture',
    label: '子母畫面',
    type: 'checkbox',
    default: false,
    advanced: true,
  },
  {
    type: 'section',
    label: '一般',
    name: 'sectionGeneralCollapsed',
    default: false,
  },
  {
    name: 'theme',
    label: '主題',
    type: 'list',
    manualinput: false,
    default: 1,
    min: -1,
    max: 1,
    step: 1,
    snapPoints: [
      { value: -1, label: '淺色' },
      { value: 0, label: '預設' },
      { value: 1, label: '深色' },
    ],
  },
  {
    name: 'enabled',
    label: '啟用環境光',
    type: 'checkbox',
    default: true,
    defaultKey: 'G',
  },
];

export const WebGLOnlySettings = [
  'resolution',
  'vibrance',
  'frameFading',
  'flickerReduction',
  'fixedPosition',
  'chromiumBugVideoJitterWorkaround',
];

let prepared = false;
export const prepareSettingsConfigOnce = () => {
  if (prepared) return;

  const settingsToRemove = [];
  for (const setting of SettingsConfig) {
    if (supportsWebGL()) {
      if (setting.name === 'resolution' && getBrowser() === 'Firefox') {
        setting.default = 50;
      }
    } else {
      if (WebGLOnlySettings.includes(setting.name)) {
        settingsToRemove.push(setting.name);
      }
      if (['webGL'].includes(setting.name)) {
        setting.default = false;
        setting.disabled = '瀏覽器已停用 WebGL。';
      }
    }

    if (setting.name === 'frameSync') {
      if (!HTMLVideoElement.prototype.requestVideoFrameCallback) {
        setting.max = 1;
        setting.default = 0;
      } else if (getBrowser() === 'Firefox') {
        // FireFox workaround: requestVideoFrameCallback is limited to 24fps. Use decoded video frames by default instead
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1935256
        setting.default = 0;
      }
    }
  }

  if (!supportsColorMix()) {
    settingsToRemove.push('pageBackgroundGreyness');
  }

  for (const settingName of settingsToRemove) {
    const settingIndex = SettingsConfig.findIndex(
      (setting) => setting.name === settingName
    );
    SettingsConfig.splice(settingIndex, 1);
  }

  prepared = true;
};

export default SettingsConfig;
