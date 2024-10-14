import type { AccountsState, Opt } from '../types'

export const defaultState: AccountsState = {
  type: undefined,
  category: undefined,
  name: undefined,
  amount: undefined,
  clocking: false,
  date: new Date()
}

export const categories: Opt[] = [
  { label: '餐饮', value: 'food' },
  { label: '交通', value: 'transport' },
  { label: '住宿', value: 'accommodation' },
  { label: '通讯', value: 'communication' },
  { label: '娱乐', value: 'entertainment' },
  { label: '健康', value: 'health' },
  { label: '教育', value: 'education' },
  { label: '购物', value: 'shopping' },
  { label: '保险', value: 'insurance' },
  { label: '个人护理', value: 'personalCare' },
  { label: '礼物和捐赠', value: 'giftsDonations' },
  { label: '其他', value: 'other' }
]

export const typeMenuOpts = [
  { label: 'income', value: 'income' },
  { label: 'expenses', value: 'expenses' }
]
