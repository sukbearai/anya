/*
 * @Author: suk.bear suk.bear.suwu@gmail.com
 * @Date: 2024-05-13 18:00:44
 * @LastEditors: suk.bear suk.bear.suwu@gmail.com
 * @LastEditTime: 2024-05-13 18:00:50
 * @FilePath: /anya/utils/uuid.ts
 * @Description: uuid utils
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
