# Tasks: 全面視覺重構

此任務清單基於 `proposal.md` 的範疇與 `design.md` 的規範，將視覺重構工作拆分為三個階段。

## Phase 1: 視覺骨幹 (Foundation)

- [x] **Task #1: 頁面容器與背景**
    - **Intent:** 建立具備品牌色調與適度留白的數據容器，營造專業穩定的第一印象。
    - **Artifact:** `DESIGN.md` > [佈局規範]
    - **Implementation:**
        - 在 `style.css` 中設定 `body` 的背景色。
        - 新增一個主要的 `div` 容器，並為其設定 `max-width`, `margin`, `padding`。

- [x] **Task #2: H1 主標題 (雲端機票管家)**
    - **Intent:** 將標題改為「雲端機票管家」，並套用專屬字體與間距。
    - **Artifact:** `DESIGN.md` > [標題樣式]
    - **Implementation:**
        - 修改 `index.html` 中的 `<h1>` 內容。
        - 在 `style.css` 中為 `h1` 設定 `font-family`, `font-weight`, `margin-bottom`。

- [x] **Task #9: 數據空狀態 (Empty State)**
    - **Intent:** 當 `air_tickets` table 沒資料時，呈現符合品牌調性的視覺提示。
    - **Artifact:** `DESIGN.md` > [反饋設計]
    - **Implementation:**
        - 在 JavaScript 的 `renderTable` 函式中，增加一個判斷式，當傳入的數據陣列為空時，在 `<tbody>` 中插入一個帶有提示文字的 `<tr>`。
        - 為這個提示 `<tr>` 添加置中與柔和的文字顏色樣式。

## Phase 2: 互動元件 (Interactive Components)

- [x] **Task #3: 機票輸入框 (Input)**
    - **Intent:** 重新設計輸入框外觀，強調輸入時的聚焦感。
    - **Artifact:** `DESIGN.md` > [表單欄位]
    - **Implementation:**
        - 為 `input[type=text]` 和 `input[type=number]` 元素設定統一的 `padding`, `border`, `border-radius`。
        - 新增 `:focus` 偽類樣式，改變其 `border-color`。

- [x] **Task #4: 紀錄新增按鈕 (Submit)**
    - **Intent:** 移除預設樣式，套用品牌主色與 Hover 效果。
    - **Artifact:** `DESIGN.md` > [按鈕層級]
    - **Implementation:**
        - 為提交按鈕添加 `class="btn btn--primary"`。
        - 在 `style.css` 中定義 `.btn` 和 `.btn--primary` 的樣式，包括背景色、文字顏色、`cursor` 和 `:hover` 效果。

- [x] **Task #7: 資料操作按鈕 (Delete/Action)**
    - **Intent:** 重新設計表格內的動作按鈕，確保其易於點擊。
    - **Artifact:** `DESIGN.md` > [輔助元件]
    - **Implementation:**
        - *(備註: 目前 HTML 中尚無刪除按鈕，此為預留任務)*
        - 定義 `.btn--secondary` 或 `.btn--destructive` 的樣式，可能使用透明背景和邊框。

## Phase 3: 數據列表與統計 (Data & Stats)

- [x] **Task #5: 機票數據表格 (Table/List)**
    - **Intent:** 將 `<tr>` 改造成具備間距、框線或條紋背景的優雅列表。
    - **Artifact:** `DESIGN.md` > [列表清單]
    - **Implementation:**
        - 為 `table` 設定 `width: 100%` 和 `border-collapse: collapse`。
        - 為 `th` 和 `td` 設定 `padding` 和 `text-align`。
        - 使用 `tbody tr:nth-child(odd)` 選擇器來實現斑馬紋樣式。

- [x] **Task #8: 數據總結欄 (Summary/Stats)**
    - **Intent:** 為列表下方的數據統計套用品牌指定的字體大小與層級。
    - **Artifact:** `DESIGN.md` > [資訊架構]
    - **Implementation:**
        - *(備註: 目前 HTML 中尚無總結欄，此為預留任務)*
        - 新增一個 `class="summary"` 的元素，並為其設定較小的 `font-size` 和柔和的 `color`。

- [x] **Task #6: 價格標記 (Price Badge/Indicator)**
    - **Intent:** 針對價格欄位，使用品牌定義的顏色或標籤樣式。
    - **Artifact:** `DESIGN.md` > [狀態標籤]
    - **Implementation:**
        - 在 `renderTable` 函式中，為價格 `<td>` 內的數字或文字包裹一個 `<span>` 元素，並給予 `class="badge"`。
        - 在 `style.css` 中為 `.badge` 設定 `background-color`, `padding`, `border-radius`。
        - 考慮為價格欄位 `<td>` 的字體套用等寬字體。
