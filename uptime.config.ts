// 这是一个简化的快速启动配置文件示例
// 一些不常用的功能在此处被省略或注释掉了
// 如需查看完整功能的示例，请参考 `uptime.config.full.ts`

// 请勿编辑此行
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

/**
 * 1. 页面配置 (pageConfig)
 * 作用：控制状态页的前端展示界面。
 */
const pageConfig: PageConfig = {
  // 状态页的标题（显示在浏览器标签和页面顶部）
  title: "我的服务器状态页",
  // 显示在页面顶部的链接，设置 `highlight: true` 会以高亮按钮形式显示
  links: [
    { link: 'https://github.com/你的用户名', label: 'GitHub' },
    { link: 'https://blog.example.com/', label: '个人博客' },
    { link: 'mailto:admin@example.com', label: '联系我', highlight: true },
  ],
}

/**
 * 2. Worker 核心配置 (workerConfig)
 * 作用：定义监控逻辑、探测目标以及告警通知。
 */
const workerConfig: WorkerConfig = {
  // 在此定义所有的监控项
  monitors: [
    // 示例：HTTP 监控项（用于监控网站或 API）
    {
      // [必填] 唯一 ID。如果修改此 ID，该项的监控历史记录将会丢失
      id: 'my_website_monitor',
      // [必填] 状态页显示的名称及告警消息中的名称
      name: '我的个人主页',
      // [必填] HTTP 请求方法
      method: 'GET',
      // [必填] 目标 URL
      target: 'https://example.com',
      // [可选] 状态页上鼠标悬停时显示的提示文字
      tooltip: '主站运行状态监控',
      // [可选] 状态页上点击该监控项后跳转的链接
      statusPageLink: 'https://example.com',
      // [可选] 允许的 HTTP 响应状态码数组，默认为 2xx
      expectedCodes: [200],
      // [可选] 超时时间（毫秒），默认为 10000 (10秒)
      timeout: 10000,
      // [可选] 发送请求时携带的请求头
      headers: {
        'User-Agent': 'Uptimeflare',
        Authorization: 'Bearer YOUR_TOKEN_HERE',
      },
      // [可选] 响应中必须包含此关键词才视为正常运行
      // responseKeyword: 'success',
      // [可选] 响应中若包含此关键词则视为宕机
      // responseForbiddenKeyword: 'Internal Server Error',
    },
    
    // 示例：TCP 监控项（用于监控服务器端口，如 SSH、数据库等）
    {
      id: 'ssh_monitor',
      name: '我的服务器 SSH',
      // TCP 监控必须使用 TCP_PING
      method: 'TCP_PING',
      // 目标格式为 host:port（例如你的 IP:22）
      target: '123.789.789.789:22',
      tooltip: '服务器 SSH 连通性监控',
      timeout: 5000,
    },
  ],

  // [可选] 通知设置
  notification: {
    // [可选] Webhook 告警设置，若不配置则不发送通知
    webhook: {
      // [必填] Webhook 地址（例如 Telegram Bot API）
      url: 'https://api.telegram.org/bot<你的机器人TOKEN>/sendMessage',
      // [必填] 编码格式：'param', 'json' 或 'x-www-form-urlencoded'
      // Telegram 推荐使用 json 或 x-www-form-urlencoded
      payloadType: 'json',
      // [必填] 发送的内容。$MSG 会被自动替换为具体的告警文案
      payload: {
        chat_id: 12345678, // 你的 TG 用户 ID
        text: '$MSG',
      },
      // 调用 Webhook 的超时时间，默认 5000
      timeout: 10000,
    },
    // [可选] 通知消息中的时区，默认为 "Etc/GMT"
    timeZone: 'Asia/Shanghai',
    // [可选] 告警宽限期（分钟）
    // 只有当服务连续宕机 N 次后才发送通知，防止网络瞬间波动导致的骚扰
    gracePeriod: 5,
  },
}

/**
 * 3. 维护计划配置 (maintenances)
 * 作用：在服务器升级或维护期间关闭告警并在页面显示公告。
 */
const maintenances: MaintenanceConfig[] = [
  {
    // [可选] 受此维护影响的监控项 ID 列表
    monitors: ['my_website_monitor', 'ssh_monitor'],
    // 维护标题
    title: '服务器例行维护',
    // 维护详情描述，会显示在状态页顶部
    body: '我们正在进行系统升级，期间服务可能会短暂不可用',
    // 维护开始时间 (ISO 8601 格式)
    start: '2025-01-01T00:00:00+08:00',
    // [可选] 结束时间。若不填则视为无限期维护中
    end: '2025-01-01T02:00:00+08:00',
    // 提示条的颜色，可选：'blue', 'yellow', 'red', 'gray'
    color: 'blue',
  },
]

// 请勿编辑此行
export { maintenances, pageConfig, workerConfig }
