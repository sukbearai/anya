export function useTable() {
  const { t } = useI18n()

  const columns = computed(() => [{
    key: 'type',
    label: t('account.col.type')
  }, {
    key: 'name',
    label: t('account.col.name')
  }, {
    key: 'amount',
    label: t('account.col.amount')
  }, {
    key: 'createTime',
    label: t('account.col.createTime')
  }, {
    key: 'timingDate',
    label: t('account.col.timingDate')
  }])

  const defaultChart = computed(() => ({
    title: {
      text: t('account.chart.title'),
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    labelLine: {
      show: false
    },
    label: {
      show: false,
      position: 'center'
    },
    legend: {
      bottom: 15,
      left: 'center',
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: '52%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: [{ name: '', value: '' }],
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        }
      }
    ]
  }))
  return { columns, defaultChart }
}
