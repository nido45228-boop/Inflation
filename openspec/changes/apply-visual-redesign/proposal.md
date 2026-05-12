# Proposal: 全面視覺重構 (Apply Visual Redesign)

## Intent (意圖)

目前的「機票價格追蹤器」`index.html` 頁面雖然功能完整（已成功串接後端 SQLite 資料庫並透過 Fetch API 進行非同步數據交換），但其視覺呈現仍處於未經設計的原始狀態。本提案旨在將 `DESIGN.md` 中定義的品牌設計語言，全面應用於此頁面，使其從一個功能原型（prototype）轉變為一個具備一致性、專業感與品牌識別度的產品介面。

## Scope (範圍)

### In Scope (範圍內)

*   **對 `index.html` 的 9 個核心視覺元素進行全面的 CSS 與 HTML 結構調整。**
*   嚴格遵守 `DESIGN.md` 中定義的顏色、字體、間距、按鈕層級與元件樣式。
*   CSS 命名將遵循 BEM (Block Element Modifier) 原則或 `DESIGN.md` 中指定的規範。

### Out of Scope (範圍外)

*   **嚴禁修改任何現有的 JavaScript 邏輯**，特別是 `fetch`/`async`/`await` 相關的數據處理部分。
*   不新增任何額外的功能（例如：使用者認證、數據導出等）。
*   不修改後端 API (`/api/tickets`, `/api/insert`) 的行為或回傳格式。

## Approach (技術實作方法)

1.  **CSS 變數化**: 在 `style.css` 的頂部建立 `:root` 選擇器，將 `DESIGN.md` 中定義的品牌色（如 `--brand-primary`, `--color-text`）、字體（`--font-family-sans`）和間距單位（`--spacing-unit`）定義為 CSS 自訂屬性，以利於統一管理與維護。
2.  **HTML 結構調整**: 為 `index.html` 中的 9 個目標元素（標題、表單、按鈕、表格等）添加符合 BEM 規範的 `class` 名稱，例如 `<button class="btn btn--primary">`。
3.  **樣式覆寫**: 撰寫新的 CSS 規則，針對新添加的 `class` 進行樣式設定，全面覆蓋瀏覽器預設樣式。
4.  **主標題統一**: 將頁面主標題 `<h1>` 的內容統一修改為「雲端機票管家」，並套用 `DESIGN.md` 中指定的標題樣式。
5.  **迭代實作**: 依照 `tasks.md` 中規劃的「視覺骨幹 → 互動元件 → 數據列表」三階段順序進行開發，確保視覺重構過程的系統性。
