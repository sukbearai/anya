/*
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-09 18:53:01
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-13 10:36:48
 * @FilePath: /anya/app.config.ts
 * @Description: nuxt ui config
 */
export default defineAppConfig({
  ui: {
    primary: 'emerald',
    container: {
      constrained: 'max-w-2xl'
    },
    card: {
      header: {
        base: 'flex flex-wrap items-center justify-between'
      },
      body: {
        base: 'space-y-4'
      }
    },
    dropdown: {
      width: 'w-full',
      popper: {
        strategy: 'absolute'
      }
    },
    notifications: {
      position: 'top-0 bottom-auto'
    }
  }
})
