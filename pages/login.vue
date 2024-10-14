<script setup lang="ts">
import type { FormError } from '#ui/types'

type FormState = 'login' | 'register' | 'forgot-password'

const { t } = useI18n()

interface FormData {
  phone?: string
  password?: string
  nickname?: string
  [key: string]: string | undefined
}

definePageMeta({
  layout: false
})

const toast = useToast()
const supabase = useSupabaseClient()
const formState = ref<FormState>('login')
const formError = ref('')

const defaultFields = [
  {
    name: 'phone',
    label: t('login.phone'),
    type: 'number',
    placeholder: t('login.phonePlaceholder')
  },
  {
    name: 'password',
    label: t('login.password'),
    type: 'password',
    placeholder: t('login.passwordPlaceholder')
  }
]

const fields = ref([...defaultFields])

watch(formState, (newFormState) => {
  if (formError.value) formError.value = ''

  if (newFormState === 'register') {
    fields.value.unshift({
      name: 'nickname',
      label: t('login.nickname'),
      type: 'text',
      placeholder: t('login.nicknamePlaceholder')
    })
  }
  else if (newFormState === 'forgot-password') {
    fields.value = [{
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password'
    }]
  }
  else {
    fields.value = [...defaultFields]
  }
})

const validate = (state: FormData) => {
  const errors: FormError[] = []
  // if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  // if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email)) errors.push({ path: 'email', message: 'Invalid email' })
  if (!state.phone) errors.push({ path: 'phone', message: t('login.error.require.phone') })
  if (!/^\d{7,15}$/.test(state.phone!)) errors.push({ path: 'phone', message: t('login.error.phone') })
  if (!state.password) errors.push({ path: 'password', message: t('login.error.require.password') })
  if (formState.value === 'register') {
    if (!state.nickname) errors.push({ path: 'nickname', message: t('login.error.require.nickname') })
  }

  return errors
}

async function onSubmit(formData: FormData) {
  if (formState.value === 'register') {
    const { data, error } = await onRegister(formData)
    if (error)
      formError.value = error.message
    else
      if (data) {
        formError.value = ''
        formState.value = 'login'
        toast.add({ title: 'register success!' })
      }
  }
  else {
    const { data, error } = await onLogin(formData)
    if (error)
      formError.value = error.message
    else
      if (data)
        navigateTo('/')
  }
}

async function onRegister(formData: FormData) {
  const { data, error } = await supabase.auth.signUp({
    phone: '' + formData.phone,
    password: formData.password!,
    options: {
      data: { nickname: formData.nickname, income: 0, expenses: 0, balance: 0, histories: [] }
    }
  })

  return { data, error }
}

async function onLogin(formData: FormData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: '' + formData.phone,
    password: formData.password!
  })

  return { data, error }
}
</script>

<template>
  <UContainer>
    <UCard class="max-w-sm w-full mt-4">
      <UAuthForm
        :fields="fields"
        :validate="validate"
        :providers="[]"
        :title="$t('welcome')"
        align="top"
        icon="i-heroicons-lock-closed"
        :ui="{ base: 'text-center', footer: 'text-center' }"
        :submit-button="{ label: t('login.submit') }"
        @submit="onSubmit"
      >
        <template #description>
          <div v-if="formState === 'login'">
            {{ $t('login_tips') }} <UButton
              variant="link"
              @click="formState = 'register'"
            >
              {{ $t('signUp') }}
            </UButton>
          </div>
          <div
            v-else
            @click="formState = 'login'"
          >
            <UButton
              variant="link"
              @click="formState = 'login'"
            >
              {{ $t('login.back') }}
            </UButton>
          </div>
        </template>

        <!-- <template #password-hint>
          <UButton v-if="formState !== 'forgot-password'" variant="link" class="text-primary font-medium" @click="formState = 'forgot-password'">Forgot password?</UButton>
        </template> -->
        <template #validation>
          <UAlert
            v-if="formError"
            color="red"
            icon="i-heroicons-information-circle-20-solid"
            :title="formError"
          />
        </template>
      </UAuthForm>
    </UCard>
  </UContainer>
</template>
