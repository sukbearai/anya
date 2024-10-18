<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable no-empty -->
<script setup>
const colorMode = useColorMode()
const { locale, setLocale,t } = useI18n()
const isOpen = ref(false)
const prompt = ref('')
const loading = ref(false)
const reply = ref('')
const lastPrompt = ref('')
const model = ref('qwen2.5-72b-instruct')
const models = ref([])

const markdownit = window.markdownit
const hljs = window.hljs


const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">'
          + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          + '</code></pre>'
      }
      catch (__) {}
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

const { copy, copied } = useClipboard({ reply })

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

function toggleLanguage() {
  setLocale(locale.value === 'en' ? 'zh-hans' : 'en')
}

async function onSubmit() {
  const res = await fetchChatCompletions()
  reply.value = res.choices[0].message.content
}

const debouncedOnSubmit = useDebounceFn(onSubmit, 300)

async function fetchAIModelsList() {
  const url = 'https://ai.sukbearai.xyz/v1/models'

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-88888888'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  }
  catch (e) {
    window.console.log(e instanceof Error ? e.message : 'An unknown error occurred')
  }
}

onMounted(async () => {
  const res = await fetchAIModelsList()
  models.value = res.data.map(el => el.id)

  hljs.highlightAll()
})

const md2html = computed(() => {
  return md.render(reply.value)
})

function onCopyText() {
  const html = md.render(reply.value)
  const el = document.createElement('div')
  el.innerHTML = html
  const text = el.textContent || el.innerText
  copy(text)
}

async function fetchChatCompletions() {
  const url = 'https://ai.sukbearai.xyz/v1/chat/completions'

  const payload = {
    model: model.value,
    messages: [
      {
        role: 'user',
        content: prompt.value
      }
    ]
  }

  try {
    loading.value = true
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-88888888'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  }
  catch (e) {
    window.console.log(e instanceof Error ? e.message : 'An unknown error occurred')
  }
  finally {
    loading.value = false
    lastPrompt.value = prompt.value
    prompt.value = ''
  }
}
</script>

<template>
  <div>
    <UContainer class="min-h-screen flex flex-col justify-center pt-4">
      <div class="mb-2 flex items-center justify-end w-full">
        <UButton
          square
          variant="ghost"
          color="black"
          :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          @click="toggleColorMode"
        />
        <UButton
          square
          variant="ghost"
          color="black"
          icon="i-heroicons-language"
          @click="toggleLanguage"
        />
      </div>
      <NuxtPage />
      <footer class="text-center mt-2">
        <div>
          <NuxtLink
            href="https://github.com/sukbearai"
            target="_blank"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            GitHub
          </NuxtLink>
          ·
          <NuxtLink
            href="https://twitter.com/sukbearai"
            target="_blank"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Twitter
          </NuxtLink>
          ·
          <span
            class="text-sm text-gray-500 hover:text-gray-700"
            @click="isOpen = true"
          >
            {{ t('ai') }}
          </span>
          .
          <a
            class="text-sm text-gray-500 hover:text-gray-700"
            target="_blank"
            href="mailto:suk.bear.suwu@gmail.com"
          >
            {{ t('contact') }}
          </a>
        </div>
      </footer>
    </UContainer>
    <UNotifications />
    <UModal v-model="isOpen">
      <div class="p-4">
        <div class="dark:text-gray-400 text-gray-500 pb-4 text-sm flex justify-between items-center">
          <div>嗨👀，你有什么想要问的？</div>
          <USelect
            v-if="models.length"
            v-model="model"
            :options="models"
            disabled
          />
        </div>
        <div
          v-if="reply"
          class="dark:text-gray-400 text-gray-500 pb-4 text-sm"
        >
          用户：{{ lastPrompt }}
        </div>
        <div
          v-if="reply"
          class="dark:text-gray-400 text-gray-500 pb-4 text-sm flex flex-col"
        >
          AI: <span v-html="md2html" /> <UIcon
            v-if="!copied"
            name="i-heroicons-document-duplicate"
            class="w-5 h-5 mt-2"
            @click="onCopyText"
          />
          <span
            v-else
            class="mt-2 text-sm"
          >已复制</span>
        </div>
        <UInput
          v-model="prompt"
          name="prompt"
          placeholder="说点什么..."
          icon="i-heroicons-magnifying-glass-20-solid"
          autocomplete="off"
          :loading="loading"
          :focus="false"
          :autofocus="false"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              v-show="prompt !== ''"
              color="gray"
              variant="link"
              label="发送"
              :padded="false"
              :disabled="loading"
              @click="debouncedOnSubmit"
            />
          </template>
        </UInput>
      </div>
    </UModal>
  </div>
</template>
