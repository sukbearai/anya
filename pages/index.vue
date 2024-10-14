<script setup lang="ts">
import type { MaybeElement } from '@vueuse/core'

const target = ref(null)
const { isOutside, elementHeight, elementWidth, elementX, elementY } = useMouseInElement(target)
const mode = useColorMode()
const colorMode = useColorMode()
const avatarEL = shallowRef<MaybeElement>()
const textEL = shallowRef<MaybeElement>()
const widgetEL = shallowRef<MaybeElement>()
const translate3d = ref(`translate3d(0px, 0px, 0px)`)
const isDartMode = computed(() => colorMode.preference === 'dark')
// const { data, close, event } = useEventSource('/ai/gemini', ['end'])
// const prompt = ref('')

// watch(event, (newEvent) => {
//   if (newEvent === 'end')
//     close()
// })

// watch(data, (newData) => {
//   if (newData && newData.trim() !== 'close') {
//     console.log(newData.trim())
//     prompt.value += newData
//   }
// })

const {
  play: avatarPlay
} = useAnimate(
  avatarEL,
  [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ],
  {
    duration: 300,
    iterations: 1,
    direction: 'alternate',
    easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)'
  }
)

const {
  play: textPaly,
  finish: textFinish
} = useAnimate(
  textEL,
  [
    { clipPath: 'circle(20% at 0% 30%)' },
    { clipPath: 'circle(20% at 50% 80%)' },
    { clipPath: 'circle(20% at 100% 30%)' }
  ],
  {
    duration: 3000,
    iterations: 2,
    direction: 'alternate',
    easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)'
  }
)

useAnimate(
  widgetEL,
  [
    { transform: 'translateX(0) rotate(-90deg)' },
    { transform: 'translateX(10px) rotate(-90deg)' },
    { transform: 'translateX(0) rotate(-90deg)' }
  ],
  {
    immediate: true,
    iterations: Infinity,
    duration: 3000,
    direction: 'alternate',
    easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)'
  }
)

const calculateTranslate3d = (x: number, y: number) => {
  const offsetX = (x - elementWidth.value / 2) / (elementWidth.value / 2) * 12
  const offsetY = (y - elementHeight.value / 2) / (elementHeight.value / 2) * 12

  const limitedX = offsetX > 0 ? Math.min(offsetX, 12) : Math.max(offsetX, -12)
  const limitedY = offsetY > 0 ? Math.min(offsetY, 12) : Math.max(offsetY, -12)

  return `translate3d(${limitedX}px, ${limitedY}px, 0px)`
}

watch([elementX, elementY, isOutside], ([newX, newY, newIsOutside]) => {
  if (!newIsOutside) {
    translate3d.value = calculateTranslate3d(newX, newY)
  }
  else {
    translate3d.value = `translate3d(0px, 0px, 0px)`
  }
})

watch(() => mode.value, (newValue) => {
  if (newValue === 'dark') {
    textPaly()
  }
  else {
    textFinish()
  }
})
</script>

<template>
  <UContainer>
    <div class="content">
      <!-- <div
        v-if="prompt"
        class="py-4"
      >
        {{ prompt }}
      </div> -->
      <div class="user-info">
        <UAvatar
          ref="avatarEL"
          src="/avatar.jpeg"
          size="3xl"
          alt="Avatar"
          img-class="text-center"
          @click="avatarPlay"
        />
        <div class="flex items-center">
          <div
            v-show="isDartMode"
            ref="widgetEL"
            class="widget"
          >
            <img
              class="w-full h-full"
              src="/widget.png"
              alt="widget"
            >
          </div>
          <p class="bio">
            {{ $t('greeting') }}
          </p>
        </div>
        <p
          ref="textEL"
          class="introduce"
        >
          {{ $t('bio') }}
        </p>
      </div>
    </div>
  </UContainer>
</template>

<style lang="postcss">
.user-info {
  @apply flex flex-col items-center;
}

.bio {
  @apply text-xl font-bold;
}

.skills {
  @apply w-full relative transition-all duration-200 ease-in;
}

.stage {
  @apply transform translate-x-0 translate-y-0 rotate-[0.0001deg] flex items-center flex-col;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.sprite {
  @apply relative left-0 top-0 transition-all duration-75 ease-in;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.widget {
  @apply w-[40px] h-[40px] -rotate-90 mr-4;
}
</style>
