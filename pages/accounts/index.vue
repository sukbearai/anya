<script setup lang="ts">
import { evaluate } from 'mathjs'
import { format } from 'date-fns'
import KeepsBooks from './components/KeepsBooks/index.vue'
import AccountsItems from './components/AccountsItems/index.vue'
import type { AccountsFormData, HistoryItem } from './tools/types'
import { defaultState } from './tools/form'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const nickname = computed(() => user.value?.user_metadata.nickname)
const userIncome = computed(() => user.value?.user_metadata.income)
const userExpenses = computed(() => user.value?.user_metadata.expenses)
const userBalance = computed(() => user.value?.user_metadata.balance)
const userHistories = computed(() => user.value?.user_metadata.histories)
const { t } = useI18n()

const state = reactive({ ...defaultState })
const tabOpts = ref([{
  label: t('keepingBooks')
}, {
  label: t('accounts')
}])

// check expire rows
const filterExpireDateRows = computed(() => {
  return userHistories.value?.filter((item: HistoryItem) => item.clocking?.isClocking && !item.clocking?.isFinished && checkExpireDate(item.clocking.date)) || []
})

const expireDateRowsLabel = computed(() => t('account.tips.record', { Number: filterExpireDateRows.value.length }))

async function updateUserBill(formData: AccountsFormData, { autoFix = false }: { autoFix?: boolean } = {}) {
  const { state: newState } = formData
  Object.assign(state, newState)

  const income = state.clocking ? userIncome.value : evaluate(`${userIncome.value} + ${formData.income}`)
  const expenses = state.clocking ? userExpenses.value : evaluate(`${userExpenses.value} + ${formData.expenses}`)
  const balance = evaluate(`${income} - ${expenses}`)

  const payload = {
    income,
    expenses,
    balance,
    histories: getHistories(autoFix, formData)
  }

  // update user info
  const { data, error } = await supabase.auth.updateUser({
    data: payload
  })

  if (error) {
    toast.add({ title: error.message, color: 'red' })
  }
  else if (data) {
    if (state.clocking) {
      toast.add({ title: t('account.success', { Date: format(state.date, 'd MMM'), Day: format(state.date, 'd MMM') }) })
    }
    // reset form
    Object.assign(state, defaultState)
  }
}

// add history item
const createHistoryItem = (formData: AccountsFormData) => ({
  uuid: generateUUID(),
  category: formData.category,
  type: formData.type,
  name: formData.name,
  amount: formData.income || formData.expenses,
  clocking: formData.clocking,
  createTime: new Date()
})

// get histories data
const getHistories = (autoFix: boolean, formData: AccountsFormData) => {
  if (autoFix) {
    const uuidsToExclude = filterExpireDateRows.value.map((item: HistoryItem) => item.uuid)
    const filteredHistories = userHistories.value.filter((item: HistoryItem) => !uuidsToExclude.includes(item.uuid))
    return filteredHistories.concat(createHistoryItem(formData))
  }
  else {
    return userHistories.value.concat(createHistoryItem(formData))
  }
}

// auto fix expire date rows and update next month date
async function onAutoFix() {
  for (const item of filterExpireDateRows.value) {
    const nextMonthDate = new Date(item.clocking.date)
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)

    await updateUserBill({
      income: item.type === 'income' ? item.amount : 0,
      expenses: item.type === 'expenses' ? item.amount : 0,
      type: item.type,
      name: item.name,
      category: item.category,
      clocking: {
        isClocking: item.clocking.isClocking,
        date: nextMonthDate,
        historyDate: item.clocking.date,
        isFinished: false // auto fix in next month to reset isFinished
      }
    }, { autoFix: true })
  }
}
</script>

<template>
  <div class="mt-2">
    <UCard>
      <UAlert
        v-if="filterExpireDateRows.length"
        class="my-2"
        icon="i-heroicons-exclamation-triangle-16-solid"
        color="red"
        :title="expireDateRowsLabel"
      >
        <template #description>
          {{ $t('account.tips.description') }} <UButton
            variant="ghost"
            @click="onAutoFix"
          >
            {{ $t('account.tips.btn') }}
          </UButton>
        </template>
      </UAlert>
      <div>{{ $t('savingGreeting') }} <span class="ml-2">🤨{{ nickname }}</span></div>
      <div class="text-sm mt-4">
        {{ $t('savingDesc') }}
      </div>
      <div class="text-xs mt-4 flex flex-col">
        <div>
          💵 {{ $t('income') }}: {{ userIncome?.toFixed(2) }} 📱 {{ $t('expenses') }}: {{ userExpenses?.toFixed(2)
          }}
        </div>
        <div class="mt-2">
          💰 {{ $t('balance') }}: {{ userBalance?.toFixed(2) }}
        </div>
      </div>
    </UCard>
    <UTabs
      :items="tabOpts"
      class="w-full mt-4"
      :default-index="0"
    >
      <template #default="{ index }">
        {{ $t(`${index === 0 ? 'keepingBooks' : 'accounts'}`) }}
      </template>
      <template #item="{ index }">
        <KeepsBooks
          v-if="index === 0"
          class="mt-4"
          @on-submit="updateUserBill"
        />
        <AccountsItems
          v-if="index === 1"
          class="mt-4"
        />
      </template>
    </UTabs>
  </div>
</template>
