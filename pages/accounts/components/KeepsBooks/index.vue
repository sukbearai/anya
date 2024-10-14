<script setup lang="ts">
import { z } from 'zod'
import { format } from 'date-fns'
import { defaultState, typeMenuOpts, categories } from '../../tools/form'
import type { Opt } from '../../tools/types'
import type { FormSubmitEvent } from '#ui/types'

defineProps({
  autoResize: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['onSubmit', 'updateState'])

const state = reactive({ ...defaultState })
const form = ref()

const schema = z.object({
  type: z.object({
    label: z.string(),
    value: z.string()
  }),
  category: z.object({
    label: z.string(),
    value: z.string()
  }),
  name: z.string(),
  amount: z.number(),
  clocking: z.boolean()
})

type Schema = z.output<typeof schema>

watch(() => state.type!, (newType: Opt) => {
  if (newType?.value === 'income') {
    state.category = { label: '收入', value: 'income' }
  }
  else {
    state.category = { label: '', value: '' }
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = {
    type: event.data.type.value,
    category: event.data.category.value,
    name: event.data.name,
    clocking: {
      isClocking: state.clocking,
      date: state.date,
      isFinished: state.clocking ? false : true
    }
  }

  const isIncome = event.data.type.value === 'income'

  emit('onSubmit', { ...data, ...(isIncome ? { income: event.data.amount, expenses: 0 } : { income: 0, expenses: event.data.amount }), state: toRaw(state) })
  // reset form
  // form.value?.clear()
  Object.assign(state, defaultState)
}
</script>

<template>
  <UCard>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-4 mt-4"
      @submit="onSubmit"
    >
      <UFormGroup
        :label="$t('type')"
        name="type"
      >
        <USelectMenu
          v-model="state.type"
          :options="typeMenuOpts"
        >
          <template #option="{ option }">
            {{ $t(option.label) }}
          </template>
        </USelectMenu>
      </UFormGroup>
      <UFormGroup
        v-if="state.type?.value === 'expenses'"
        :label="$t('category')"
        name="category"
      >
        <USelectMenu
          v-model="state.category"
          :options="categories"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('name')"
        name="name"
      >
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup
        :label="$t('amount')"
        name="amount"
      >
        <UInput
          v-model="state.amount"
          type="number"
          step="0.000000001"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('clocking')"
        name="clocking"
      >
        <UToggle v-model="state.clocking" />

        <UPopover
          v-if="state.clocking"
          :popper="{ placement: 'bottom-start' }"
          class="mt-4"
        >
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="format(state.date, 'd MMM, yyy')"
          />

          <template #panel="{ close }">
            <DatePicker
              v-model="state.date"
              is-required
              @close="close"
            />
          </template>
        </UPopover>
      </UFormGroup>

      <UButton type="submit">
        {{ $t('submit') }}
      </UButton>
    </UForm>
  </UCard>
</template>
