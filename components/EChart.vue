<!--
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-14 12:13:37
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-14 12:33:15
 * @FilePath: /anya/components/Chart.vue
 * @Description: Chart component
-->
<script lang="ts" setup>
import VCharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'

defineProps({
  options: {
    type: Object,
    default() {
      return {}
    }
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
})

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent
])

const renderChart = ref(false)
// wait container expand
nextTick(() => {
  renderChart.value = true
})
</script>

<template>
  <VCharts
    v-if="renderChart"
    :option="options"
    :autoresize="autoResize"
    :style="{ width, height }"
  />
</template>

<style scoped></style>
