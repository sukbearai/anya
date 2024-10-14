<!--
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-09 18:53:01
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-13 10:36:02
 * @FilePath: /nuxt-todos-edge/app.vue
 * @Description: app.vue
-->
<script setup>
const { loggedIn } = useUserSession()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/favicon-mi.ico' }]
})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Anya Forger',
  description:
    'You either earn or learn.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<style lang="postcss">
body {
  @apply font-sans text-gray-950 bg-gray-50 dark:bg-gray-950 dark:text-gray-50;
}
</style>
