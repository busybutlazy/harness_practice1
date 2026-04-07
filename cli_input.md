使用 `$scaffold-fullstack`。

在這個 repo 中建立一個最小化的全端 Todo List 示範專案，並以 Docker 作為執行方式。

啟動 3 個子代理，並等待它們全部完成：
1. frontend-agent
   - 在 `frontend/` 底下建立最小化的 React UI
   - 列出 tasks
   - 新增 task
   - 切換 task 的完成狀態
   - 切換 task 的關注／釘選狀態
   - 將已釘選的 task 顯示在最上方
   - 保持 UI 精簡、對初學者友善

2. backend-agent
   - 在 `backend/` 底下建立最小化的 FastAPI 應用
   - 僅使用記憶體內儲存
   - 提供以下 API：
     - `GET /api/tasks`
     - `POST /api/tasks`
     - `POST /api/tasks/{id}/toggle`
     - `POST /api/tasks/{id}/pin`
   - 每個 task 至少包含：
     - `id`
     - `title`
     - `completed`
     - `pinned`
   - 撰寫最小可行的 Docker 相關檔案，使前後端可啟動

3. reviewer-agent
   - 驗證 API 規格是否與前端使用方式一致
   - 驗證檔案結構是否精簡
   - 驗證 Docker 執行命令是否正確
   - 驗證前後端都可正常啟動

限制：
- 不使用資料庫
- 不加入驗證機制
- 必須使用 Docker
- 不使用 CSS 框架
- 保持程式碼對初學者友善
- 除非原本就有，否則不要加入 TypeScript

完成條件：
- 前端與後端都能成功執行
- 前端可以列出、新增、切換完成狀態、切換釘選狀態
- 已釘選任務會顯示在最上方
- API 規格一致
- 回傳已變更的檔案、Docker 執行命令與已知限制