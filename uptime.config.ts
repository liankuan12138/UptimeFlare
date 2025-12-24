/**
 * UptimeFlare 完整功能配置文件 (全中文注释版)
 * 建议在修改前先阅读对应字段的说明
 */

// 导入类型定义，请勿修改此行
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

/**
 * 1. 页面配置 (PageConfig)
 * 用于自定义状态页的前端显示效果、分组和品牌。
 */
const pageConfig: PageConfig = {
  // 状态页的标题
  title: "Liankuan 的服务器监控站",
  
  // 顶栏链接：highlight 设置为 true 会显示为高亮按钮
  links: [
    { link: 'https://github.com/your-username', label: 'GitHub' },
    { link: 'https://blog.yourdomain.com/', label: '我的博客' },
    { link: 'mailto:me@yourdomain.com', label: '联系我', highlight: true },
  ],

  // [重要] 监控项分组：如果不配置此项，所有监控将显示在一个长列表中
  // 只有在下面分组中列出的 id 才会显示在页面上，没列出的只会在后台运行
  group: {
    '核心服务 (Public)': ['bitsflow_slc_ssh'],
    '私有节点 (Private)': [],
  },

  // [可选] 网站图标与 Logo 链接，默认使用系统图标
  // favicon: 'https://example.com/favicon.ico',
  // logo: 'https://example.com/logo.svg',

  // [可选] 维护计划相关显示设置
  maintenances: {
    // 尚未开始的维护任务在页面上显示的颜色（默认 gray）
    upcomingColor: 'gray',
  },

  // [可选] 自定义页脚 HTML：可以放备案号、版权声明或统计脚本
  // customFooter: '<p>© 2025 Liankuan. All rights reserved.</p>',
}

/**
 * 2. Worker 核心配置 (WorkerConfig)
 * 控制监控频率、安全校验、探测节点及告警逻辑。
 */
const workerConfig: WorkerConfig = {
  // [性能优化] 写入 KV 数据库的冷却时间（分钟）。
  // 除非状态发生变化，否则每隔 N 分钟才更新一次数据库，默认 3。
  kvWriteCooldownMinutes: 3,

  // [安全] 状态页访问密码：取消注释并修改为 `用户名:密码` 格式即可开启
  // passwordProtection: 'admin:password123',

  // 监控项定义
  monitors: [
    // HTTP 监控示例（适用于网站、API）
    {
      id: 'main_website',
      name: '我的主站',
      method: 'GET',
      target: 'https://example.com',
      tooltip: '主域名的运行状态',
      statusPageLink: 'https://example.com',
      // 是否在页面上隐藏该项的延迟曲线图
      hideLatencyChart: false,
      // 期望的状态码，不符合则报警
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Uptimeflare-Monitor',
      },
      // 响应中必须包含的关键词，否则报警
      responseKeyword: 'Welcome',
      // [核心功能] 指定检测点：使用 globalping 服务从香港探测
      // 解决 CF 自身线路波动导致的误报
      checkProxy: 'globalping://HK/1',
      // 如果指定的代理检测点挂了，是否回退到本地(CF节点)进行探测
      checkProxyFallback: true,
    },

    // TCP 监控示例（适用于服务器、数据库、SSH）
    {
      id: 'bitsflow_slc_ssh',
      name: 'BitsflowSLC',
      method: 'TCP_PING',
      target: '104.129.32.92:20201', // 替换为你真实的 IP 和端口
      tooltip: 'SSH 连通性监控',
      timeout: 5000,
      // 如果你的 IP 经常被墙，可以尝试从国内/近场探测点探测
      checkProxy: 'globalping://HK/3',
    },
  ],

  // 告警通知设置
  notification: {
    // Webhook 配置（以 Telegram 为例）
    webhook: {
      url: 'https://api.telegram.org/bot<TOKEN>/sendMessage',
      method: 'POST',
      // 编码方式，Telegram 推荐 json
      payloadType: 'json',
      payload: {
        chat_id: 12345678,
        text: '$MSG', // $MSG 会自动替换为报警内容
      },
      timeout: 10000,
    },
    timeZone: 'Asia/Shanghai',
    // 告警宽限期：连续失败 N 分钟后才发送告警消息（非常重要，建议设为 3-5）
    gracePeriod: 5,
    // [可选] 哪些 id 的监控项不需要发送告警消息
    skipNotificationIds: ['test_server_tcp'],
    // [可选] 如果故障原因发生变化（如从 502 变成 504），是否不再发送额外通知
    skipErrorChangeNotification: true,
  },

  // 回调函数：当状态发生变化时执行自定义 TypeScript 代码
  callbacks: {
    // 状态变化回调（从 Up 到 Down 或反之）
    onStatusChange: async (env, monitor, isUp, timeIncidentStart, timeNow, reason) => {
      // 你可以在这里写代码，比如当服务挂掉时调用另外一个 API 自动重启服务器
    },
    // 持续故障回调：只要故障没恢复，每 1 分钟执行一次
    onIncident: async (env, monitor, timeIncidentStart, timeNow, reason) => {
      // 适合用于高频监控或紧急日志记录
    },
  },
}

/**
 * 3. 维护计划配置 (MaintenanceConfig)
 * 在此定义服务器维护时间，期间会自动静默告警并在页面展示公告。
 */
const maintenances: MaintenanceConfig[] = [
  // 静态维护任务
  {
    monitors: ['main_website'],
    title: '系统升级公告',
    body: '我们正在进行数据库迁移，期间主站可能无法访问。',
    start: '2025-05-01T00:00:00+08:00',
    end: '2025-05-01T04:00:00+08:00',
    color: 'blue',
  },

  // 动态生成维护任务（代码演示：每月 15 号自动生成一个维护周期）
  ...(function () {
    const schedules = []
    const today = new Date()
    for (let i = -1; i <= 1; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 15)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      schedules.push({
        title: `${year}/${parseInt(month)} - 每月例行巡检`,
        monitors: ['main_website'],
        body: '每月自动维护计划。',
        start: `${year}-${month}-15T02:00:00.000+08:00`,
        end: `${year}-${month}-15T04:00:00.000+08:00`,
      })
    }
    return schedules
  })(),
]

// 导出配置，请勿编辑此行
export { maintenances, pageConfig, workerConfig }
