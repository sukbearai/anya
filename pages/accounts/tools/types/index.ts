export interface AccountsState {
  type: undefined | Opt
  category: undefined | Opt
  name: undefined | string
  amount: undefined | number
  clocking: boolean
  date: Date
}

export type AccountsFormData = { income: number, expenses: number, type: string, category: string, name: string, clocking: { isClocking: boolean, date: Date, isFinished: boolean, historyDate?: Date }, state?: AccountsState }
export type Opt = { label: string, value: string }
export type Select = { label: string, key: string }

export interface HistoryItem {
  id?: string | number
  amount: number
  category: string
  clocking: {
    date: Date
    isClocking: boolean
    isFinished: boolean
    historyDate?: Date
  }
  createTime: Date
  name: string
  type: string
  uuid: string
}

export type Histories = HistoryItem[]

interface CountItem {
  count: number
  amount: number
  name: string
}

export type Counts = Record<string, CountItem>
