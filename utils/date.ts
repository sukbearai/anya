/*
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-13 17:18:34
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-14 06:53:49
 * @FilePath: /anya/utils/date.ts
 * @Description: date utils
 */
export const checkExpireDate = (date: Date) => {
  const t = new Date()
  t.setHours(0, 0, 0, 0)

  const clockingDate = new Date(date)
  clockingDate.setHours(0, 0, 0, 0)

  return clockingDate.getTime() <= t.getTime()
}
