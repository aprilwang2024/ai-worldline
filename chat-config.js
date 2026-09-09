/*
 * AI 对话框配置 — 站点维护者填写。
 *
 * 留空时对话框仍可打开，访客可以点击面板里的「设置」填入自己的
 * OpenAI 兼容 API（密钥只保存在访客浏览器 localStorage，不会经过本站）。
 * 若站点自行部署了持有密钥的代理（如部署在已有阿里云服务器上的一个
 * 转发端点），把地址填入 endpoint；由服务器保管密钥并限制调用额度。
 */
window.AI_WORLDLINE_CHAT_CONFIG = {
  // OpenAI 兼容的 Chat Completions 地址，例如 "https://api.deepseek.com" 或
  // "https://your-proxy.example.com/v1"（将以 `${endpoint}/chat/completions` 调用）。
  endpoint: "",
  // 默认模型名，例如 "deepseek-chat"。
  model: "",
  // 星空（AI 画布）生成使用的快速非思考模型；留空则回退到上面的 model。
  // 例如阿里云编码套餐网关可用 "qwen3.7-plus"（会自动附带 enable_thinking:false）。
  starModel: "",
  // 必须保持为空：静态文件中的任何密钥都会被访客下载。
  // 访客可在界面配置自己的密钥，共享服务则由服务器代理保管密钥。
  apiKey: "",
};
