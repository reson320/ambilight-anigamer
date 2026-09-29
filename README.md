# 動畫瘋環境光（Ambient light for 動畫瘋）

為[巴哈姆特動畫瘋](https://ani.gamer.com.tw/)的播放器加上向外延伸的環境光（Ambilight），讓畫面顏色自然擴散到播放器周圍，營造沉浸式的觀看體驗。

本專案移植自 Wessel Kroos 的 [Ambient light for YouTube™](https://github.com/WesselKroos/youtube-ambilight)（MIT 授權）。環境光的繪製引擎（WebGL 投影、黑邊偵測、幀同步等）都來自原專案，這個 fork 只把網站整合層改寫成動畫瘋的 video.js 播放器，並把介面翻譯成繁體中文。

## 功能

- 播放器周圍的環境光，支援一般、劇院與全螢幕模式
- 開啟時自動切換成深色主題，並讓播放器周圍的區塊半透明，讓光線透出來
- 播放器控制列上的齒輪按鈕可以調整模糊、擴散範圍、亮度、黑邊移除等設定
- 快速鍵：`G` 開關環境光、`B` 移除上下黑邊、`V` 移除左右黑邊、`H` 放大影片填滿黑邊

## 安裝（開發版）

目前尚未上架商店，請自行建置後以「載入未封裝項目」安裝：

1. 安裝 [Node.js](https://nodejs.org/) 22 以上
2. 在專案資料夾執行：
   ```bash
   npm ci
   npm run build
   ```
3. 開啟 Chrome 或 Edge 的擴充功能頁面（`chrome://extensions` 或 `edge://extensions`）
4. 開啟「開發人員模式」
5. 點選「載入未封裝項目」，選擇專案裡的 `dist` 資料夾
6. 打開動畫瘋任一集播放頁面即可使用

## 開發

| 指令 | 說明 |
| ---- | ---- |
| `npm run build` | 清除並重新建置 `dist/` |
| `npx eslint src/scripts` | 檢查程式碼 |

主要檔案：

- `src/scripts/libs/site.js`：動畫瘋的選擇器與播放器相關工具函式，網站改版時通常只需要改這裡
- `src/scripts/content-main.js`：等待播放器出現後初始化環境光
- `src/scripts/libs/ambientlight.js`：環境光主程式（來自原專案，已改寫網站相關部分）
- `src/scripts/injected.js`：在網頁環境中切換主題與版面
- `src/styles/_anigamer.scss`：動畫瘋頁面融合樣式

### 同步原專案的更新

這個 repo 的 `upstream` remote 指向原專案，可以用下列指令合併原專案的更新：

```bash
git fetch upstream
git merge upstream/develop
```

合併時主要會在 `ambientlight.js`、`settings.js`、`settings-config.js` 與樣式檔發生衝突，網站相關的改動都集中在上述檔案。

## 隱私

這個擴充功能不會收集或傳送任何資料。原專案的 Sentry 錯誤回報已經移除，錯誤只會顯示在瀏覽器主控台，設定只儲存在瀏覽器的擴充功能儲存空間中。

## 問題回報

請到 [Issues](https://github.com/reson320/ambilight-anigamer/issues) 回報問題或提出建議。

## 授權與致謝

- 原專案：[WesselKroos/youtube-ambilight](https://github.com/WesselKroos/youtube-ambilight)，Copyright (c) 2017 Wessel Kroos，MIT 授權，完整授權條款見 [LICENSE](LICENSE)
- 如果喜歡這個效果，也歡迎[贊助原作者](https://ko-fi.com/G2G59EK8L)

本專案與巴哈姆特、YouTube 及 Google 皆無關聯。
