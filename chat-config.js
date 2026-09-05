/*
 * AI 对话框配置 — 站点维护者填写。
 *
 * 留空时对话框仍可打开，访客可以点击面板里的「设置」填入自己的
 * OpenAI 兼容 API（密钥只保存在访客浏览器 localStorage，不会经过本站）。
 * 若站点自行部署了持有密钥的代理（如部署在已有阿里云服务器上的一个
 * 转发端点），把地址填入 endpoint 并留空 apiKeyField，即可对所有访客开箱即用。
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
  // 可选：随站点内置的密钥。仅当你部署的是私有代理、且该地址不会泄露时才填写；
  // 公共站点请保持为空，让访客在界面里填自己的密钥。
  apiKey: "",
};
