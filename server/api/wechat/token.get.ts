export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const credentialRes = await $fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`)

  return credentialRes
})
