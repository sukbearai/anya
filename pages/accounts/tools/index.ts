export const useCategories = () => {
  const { t } = useI18n()

  const categories = computed(() => ([
    { label: t('account.chart.category.food'), value: 'food' },
    { label: t('account.chart.category.transport'), value: 'transport' },
    { label: t('account.chart.category.accommodation'), value: 'accommodation' },
    { label: t('account.chart.category.communication'), value: 'communication' },
    { label: t('account.chart.category.entertainment'), value: 'entertainment' },
    { label: t('account.chart.category.health'), value: 'health' },
    { label: t('account.chart.category.education'), value: 'education' },
    { label: t('account.chart.category.shopping'), value: 'shopping' },
    { label: t('account.chart.category.insurance'), value: 'insurance' },
    { label: t('account.chart.category.personalCare'), value: 'personalCare' },
    { label: t('account.chart.category.giftsDonations'), value: 'giftsDonations' },
    { label: t('account.chart.category.other'), value: 'other' }
  ]))

  return { categories }
}
