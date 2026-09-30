# 動畫瘋環境光（Ambient light for 動畫瘋）

為[巴哈姆特動畫瘋](https://ani.gamer.com.tw/)的播放器加上向外延伸的環境光（Ambilight），讓畫面顏色自然擴散到播放器周圍，營造沉浸式的觀看體驗。

本專案移植自 Wessel Kroos 的 [Ambient light for YouTube™](https://github.com/WesselKroos/youtube-ambilight)（MIT 授權）。環境光的繪製引擎（WebGL 投影、黑邊偵測、幀同步等）都來自原專案，這個專案只把網站整合層改寫成動畫瘋的 video.js 播放器，並把介面翻譯成繁體中文。

## 功能

- 播放器周圍的環境光，支援一般、劇院與全螢幕模式
- 開啟時自動切換成深色主題，並讓播放器周圍的區塊半透明，讓光線透出來
- 播放器控制列上的齒輪按鈕可以調整模糊、擴散範圍、亮度、黑邊移除等設定
- 快速鍵：`G` 開關環境光、`B` 移除上下黑邊、`V` 移除左右黑邊、`H` 放大影片填滿黑邊

## 安裝教學

目前沒有上架 Chrome 線上應用程式商店，需要手動安裝，大約 3 分鐘。支援 **Chrome** 與 **Edge** 電腦版。

### 1. 下載

1. 打開 [最新版本頁面](https://github.com/reson320/ambilight-anigamer/releases/latest)
2. 在「Assets」底下點 `ambilight-anigamer-v版本號.zip` 下載
3. 在下載的 zip 檔上按右鍵 →「解壓縮全部」，會得到一個 `ambilight-anigamer` 資料夾
4. 把這個資料夾放到不會被刪掉的地方，例如「文件」。**之後不要刪除或移動它**，刪掉的話擴充功能就會失效

### 2. 安裝到瀏覽器

1. 在網址列輸入 `chrome://extensions` 後按 Enter（Edge 請輸入 `edge://extensions`）
2. 打開右上角的「**開發人員模式**」開關（Edge 在左側選單下方）
3. 按左上角出現的「**載入未封裝項目**」
4. 選擇剛剛解壓縮的 `ambilight-anigamer` 資料夾（要選到裡面有 `manifest.json` 的那一層），按「選擇資料夾」
5. 清單中出現「動畫瘋環境光」就安裝完成了。可以點右上角的拼圖圖示，把它釘選到工具列

### 3. 開始使用

打開動畫瘋任一集播放頁面，開始播放後播放器周圍就會出現環境光。

- 播放器控制列右側有一個帶「AL」標記的齒輪按鈕，可以調整亮度、模糊、擴散範圍等
- 快速鍵 `G` 可以隨時開關環境光
- 劇院模式（`T`）會把影片縮小一點，讓四周露出光；大小可在設定「影片 > 大小（劇院模式）」調整

### 更新到新版本

1. 從 [最新版本頁面](https://github.com/reson320/ambilight-anigamer/releases/latest) 下載新的 zip 並解壓縮
2. 用新資料夾的內容**覆蓋**原本的 `ambilight-anigamer` 資料夾
3. 到 `chrome://extensions`，在「動畫瘋環境光」上按重新載入（圓形箭頭）圖示，再重新整理動畫瘋網頁

設定會保留，不需要重新調整。

### 常見問題

- **Chrome 跳出「停用開發人員模式擴充功能」的提醒？** 這是手動安裝的擴充功能都會出現的提醒，按關閉即可，不要按停用。
- **沒看到齒輪按鈕？** 重新整理動畫瘋網頁；還是沒有的話，到 `chrome://extensions` 確認擴充功能是開啟的。
- **畫面變卡？** 在設定把「環境光 > 擴散範圍」調低，或到「品質」降低解析度。
- **想暫時關掉？** 按 `G`，或在 `chrome://extensions` 把開關關閉。
- **遇到問題？** 到 [Issues](https://github.com/reson320/ambilight-anigamer/issues/new/choose) 回報，附上截圖會更好處理。

## 開發

自行建置：安裝 [Node.js](https://nodejs.org/) 22 以上，執行 `npm ci` 與 `npm run build`，再用「載入未封裝項目」載入 `dist` 資料夾。


| 指令 | 說明 |
| ---- | ---- |
| `npm run build` | 清除並重新建置 `dist/` |
| `npx eslint src/scripts` | 檢查程式碼 |

### 發布新版本

1. 修改 `package.json` 的 `version`（例如 `0.2.0`）並合併到 `main`
2. 在 `main` 上建立對應的 tag 並推上去：`git tag v0.2.0 && git push origin v0.2.0`
3. GitHub Actions 會自動 build、打包成 zip 並建立 Release

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
