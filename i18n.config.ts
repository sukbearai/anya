/*
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-12 14:22:53
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-14 11:17:07
 * @FilePath: /anya/i18n.config.ts
 * @Description: i18n config
 */
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh-hans',
  messages: {
    'zh-hans': {
      contact: '联系我',
      ai: '问AI',
      greeting: '嗨！我是 suk.bear',
      bio: '我是一名Web开发技术员，专攻JavaScript（TypeScript）、Vue3（Nuxt3、uni-app&小程序）和Web性能。',
      savingGreeting: '嗨!',
      savingDesc: '这是一个高效的会计工具，旨在帮助你精确地管理和记录你的支出，从而培养良好的财务管理习惯。',
      income: '收入',
      expenses: '花费',
      balance: '结余',
      keepingBooks: '记账',
      accounts: '账目',
      type: '类型',
      name: '内容',
      amount: '金额',
      clocking: '允许每月自动记账',
      submit: '提交',
      tools: 'AI 应用工具',
      savingsApp: '会计工具',
      filterExpired: '过期',
      filterIsClocking: '月记账',
      IsClocking: '是否打卡',
      IsFinished: '是否完成',
      TimingDate: '每月缴费日期',
      CreateTime: '创建时间',
      welcome: '欢迎访问',
      login_tips: '没有账户？',
      signUp: '注册',
      phone: '手机号',
      pwd: '密码',
      delete: '删除',
      category: '类别',
      login: {
        phone: '手机',
        phonePlaceholder: '请输入手机号',
        password: '密码',
        passwordPlaceholder: '请输入密码',
        btn: '确定',
        nickname: '昵称',
        nicknamePlaceholder: '请输入昵称',
        back: '返回登录',
        submit: '提交',
        error: {
          phone: '请输入正确的电话号码',
          require: {
            phone: '手机号必填',
            password: '密码必填',
            nickname: '昵称必填'
          }
        }
      },
      menu: {
        profile: '个人主页',
        account: '记账本',
        logout: '退出'
      },
      toolBtn: 'AI工具箱',
      account: {
        success: '登记{Date}记账成功，已默认为您开启每月{Day}号一键记账功能，欢迎体验🎉🎉🎉',
        tips: {
          record: `有{Number}条过期记录!`,
          description: '你可以在下面查看',
          btn: '修复它？'
        },
        fix: '您还没有修复到期记录',
        delete: '删除条目成功',
        col: {
          type: '类型',
          name: '名称',
          amount: '金额',
          createTime: '创建时间',
          timingDate: '自动订阅'
        },
        chart: {
          title: '支出',
          category: {
            food: '餐饮',
            transport: '交通',
            accommodation: '住宿',
            communication: '通讯',
            entertainment: '娱乐',
            health: '健康',
            education: '教育',
            shopping: '购物',
            insurance: '保险',
            personalCare: '个人护理',
            giftsDonations: '礼物和捐赠',
            other: '其他'
          }
        }
      }
    },
    'en': {
      contact: 'Contact',
      ai: 'AI',
      greeting: 'Hi! I am suk.bear',
      bio: 'I am a web developer, specializing in JavaScript (TypeScript), Vue3 (Nuxt3, uni-app & wechat-app) and web performance.',
      savingGreeting: 'hi!',
      savingDesc: 'This is a daily accounting tool to help you better manage and record your expenses.',
      income: 'income',
      expenses: 'expenses',
      balance: 'balance',
      keepingBooks: 'keeping books',
      accounts: 'accounts',
      type: 'type',
      name: 'name',
      amount: 'amount',
      clocking: 'allow automatic billing of monthly',
      submit: 'submit',
      tools: 'AI app Tools',
      savingsApp: 'accounting tool',
      filterExpired: 'expired',
      filterIsClocking: '💰/mon',
      IsClocking: 'Is clocking',
      IsFinished: 'Is finished',
      TimingDate: 'monthly payment date',
      CreateTime: 'Create time',
      welcome: 'Welcome back!',
      login_tips: 'Don\'t have an account?',
      signUp: 'Sign up',
      phone: 'phone',
      pwd: 'password',
      delete: 'del',
      category: 'category',
      login: {
        phone: 'phone',
        phonePlaceholder: 'Please enter your phone number',
        password: 'password',
        passwordPlaceholder: 'Please enter your password',
        btn: 'continue',
        nickname: 'Nickname',
        nicknamePlaceholder: 'Please enter your nickname',
        back: 'Back to login',
        submit: 'Continue',
        error: {
          phone: 'Please enter the correct phone number',
          require: {
            phone: 'phone is required',
            password: 'password is required',
            nickname: 'nickname is required'
          }
        }
      },
      menu: {
        profile: 'homepage',
        account: 'account book',
        logout: 'logout'
      },
      toolBtn: 'AI Tools',
      account: {
        success: 'Registration of {Date} account success, has been enabled for you by default monthly {Day} one-click accounting function, welcome to experience🎉🎉🎉',
        tips: {
          record: `There are {Number} expired records!`,
          description: 'You can check it out below. ',
          btn: 'fix it?.'
        },
        fix: 'You have not fixed expired records',
        delete: 'delete success',
        col: {
          type: 'Type',
          name: 'Name',
          amount: 'Amount',
          createTime: 'CreateTime',
          timingDate: 'TimingDate'
        },
        chart: {
          title: 'Expend',
          category: {
            food: 'food',
            transport: 'transport',
            accommodation: 'accommodation',
            communication: 'communication',
            entertainment: 'entertainment',
            health: 'health',
            education: 'education',
            shopping: 'shopping',
            insurance: 'insurance',
            personalCare: 'personalCare',
            giftsDonations: 'giftsDonations',
            other: 'other'
          }
        }
      }
    }
  }
}))
