<script setup lang="ts">
import { evaluate } from 'mathjs'
import { format } from 'date-fns'
import type { HistoryItem, Counts } from '../../tools/types'
import { useTable } from '../../tools/table'
import { useCategories } from '../../tools'

type TRableRow = ReturnType<typeof mapHistories>
type Row = TRableRow[0]

const { categories } = useCategories()

const { locale, t } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const userHistories = computed(() => user.value?.user_metadata.histories || [])
const selectedRows = ref<TRableRow>([])
const filterExpired = ref(false)
const filterIsClocking = ref(false)
const page = ref(1)
const pageCount = 10
const { columns, defaultChart } = useTable()
const chartOpt = ref({ ...defaultChart.value })

const paginationTotal = computed(() => {
  const histories = user.value?.user_metadata.histories || []
  return filterHistories(histories, filterExpired.value, filterIsClocking.value).length
})

watch(paginationTotal, () => {
  page.value = 1
})

function countCategories(history: HistoryItem[]) {
  const counts: Counts = {}

  const filterHistories = history.filter(item => item.category !== 'income')

  for (const record of filterHistories) {
    // skip unrealized cost
    if (!checkExpireDate(record.clocking?.historyDate || record.clocking.date))
      continue

    if (counts[record.category]) {
      counts[record.category].count += 1
      counts[record.category].amount += record.amount
    }
    else {
      counts[record.category] = { count: 1, amount: record.amount, name: categories.value.find(item => item.value === record.category)?.label as string }
    }
  }

  const result = []
  for (const key in counts) {
    result.push({ name: counts[key].name, value: counts[key].amount.toFixed(2) })
  }

  return result
}

// count categories
watch(userHistories, (newVal) => {
  chartOpt.value.series[0].data = countCategories(newVal)
}, { immediate: true })

watch(locale, () => {
  chartOpt.value.series[0].data = countCategories(userHistories.value)
  chartOpt.value.title.text = t('account.chart.title')
})

// check expire rows
const filterExpireDateRows = computed(() => {
  return userHistories.value?.filter((item: HistoryItem) => item.clocking?.isClocking && !item.clocking?.isFinished && checkExpireDate(item.clocking.date)) || []
})

const filterIsClockingDataRow = computed(() => {
  return userHistories.value?.filter((item: HistoryItem) => item.clocking?.isClocking) || []
})

// table rows
const filteredRows = computed(() => {
  // filter rows
  const data = !filterExpired.value
    ? (filterIsClocking.value
        ? [...filterIsClockingDataRow.value]
        : [...userHistories.value])
    : (filterIsClocking.value
        ? [...filterIsClockingDataRow.value.filter((item: HistoryItem) => checkExpireDate(item.clocking.date))]
        : [...filterExpireDateRows.value])

  return mapHistories(data).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

function onSelectRow(row: Row) {
  const index = selectedRows.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  }
  else {
    selectedRows.value.splice(index, 1)
  }
}

// recalculate accounts
function recalculateFromHistoryReturnPayload(histories: HistoryItem[]) {
  const { income, expenses, balance } = calculateIncomeAndExpenses(histories)

  return {
    income,
    expenses,
    balance,
    histories: histories
  }
}

async function onDelete() {
  if (!selectedRows.value.length) return

  if (filterExpireDateRows.value.length) {
    toast.add({ title: t('account.fix'), color: 'red' })
    return
  }

  const filterHistories = userHistories.value.filter((item: HistoryItem) => !selectedRows.value.some(row => item.uuid === row.id))

  const payload = recalculateFromHistoryReturnPayload(filterHistories)

  const { data, error } = await supabase.auth.updateUser({
    data: payload
  })

  if (error) {
    toast.add({ title: error.message, color: 'red' })
  }
  else if (data) {
    toast.add({ title: t('account.delete'), color: 'green' })
  }

  selectedRows.value = []
}

function filterHistories(histories: HistoryItem[], isExpired: boolean, isClocking: boolean) {
  return histories.filter((history: HistoryItem) => {
    let valid = true
    if (isExpired) {
      valid = valid && history.clocking?.isClocking && !history.clocking?.isFinished && checkExpireDate(history.clocking?.date)
    }
    if (isClocking) {
      valid = valid && history.clocking?.isClocking
    }
    return valid
  })
}

function mapHistories(histories: HistoryItem[]) {
  return histories.map((item: HistoryItem) => {
    // remove clocking field and format date
    return {
      type: item.type,
      name: item.name,
      amount: item.amount.toFixed(2),
      isClocking: item.clocking?.isClocking ? '✅' : '❌',
      isFinished: item.clocking?.isFinished ? '✅' : '❌',
      timingDate: item.clocking?.isClocking ? format(item.clocking.date, 'd MMM, yyy') : '❌',
      createTime: format(item.createTime, 'd MMM, yyy'),
      id: item.uuid
    }
  })
}

function calculateIncomeAndExpenses(histories: HistoryItem[]) {
  let totalIncome = 0
  let totalExpenses = 0

  for (const bill of histories) {
    // historyDate is auto fix generated date
    if (!checkExpireDate(bill.clocking?.historyDate || bill.clocking.date)) {
      continue
    }

    if (bill.type === 'income') {
      totalIncome = evaluate(`${totalIncome} + ${bill.amount}`)
    }
    else {
      totalExpenses = evaluate(`${totalExpenses} + ${bill.amount}`)
    }
  }

  return {
    income: totalIncome,
    expenses: totalExpenses,
    balance: evaluate(`${totalIncome} - ${totalExpenses}`)
  }
}
</script>

<template>
  <UCard>
    <div class="flex flex-col px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 items-center">
      <EChart
        v-if="filteredRows.length"
        height="358px"
        width="358px"
        :option="chartOpt"
      />
      <div class="flex items-center">
        <UCheckbox
          v-model="filterExpired"
          name="filter"
          :label="$t('filterExpired')"
        />
        <UCheckbox
          v-model="filterIsClocking"
          name="filter"
          :label="$t('filterIsClocking')"
          class="ml-4"
        />
        <div
          class="ml-4 flex items-center cursor-pointer"
          @click="onDelete"
        >
          <UIcon
            class="text-gray-700 dark:text-gray-200"
            name="i-heroicons-trash"
          />
          <span class="ml-2 font-medium text-gray-700 dark:text-gray-200 text-sm">{{ $t('delete') }}</span>
        </div>
      </div>
    </div>
    <UTable
      v-model="selectedRows"
      :columns="columns"
      :rows="filteredRows"
      @select="onSelectRow"
    />
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="paginationTotal"
      />
    </div>
  </UCard>
</template>
