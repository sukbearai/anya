interface AccessTokenResponse {
  access_token: string
  expires_in: number
}

interface CustomError {
  code: string
  data: string
  errorMsg: string
}

interface AcodeRes {
  errcode: number
  errmsg: string
  resp_data: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const { device_id } = getQuery(event)

  const ACCESSSTOKENPOSTBODY = {
    grant_type: 'client_credential',
    appid: config.appid,
    secret: config.secret
  }

  const ACODEPOSTBODY = { device_id }

  // const { access_token }: { access_token: string } = await $fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`)

  const accessTokenRes: AccessTokenResponse = await $fetch(
    `https://api.weixin.qq.com/cgi-bin/stable_token`,
    {
      method: 'POST',
      contentType: 'application/json',
      body: ACCESSSTOKENPOSTBODY
    }
  )

  if (accessTokenRes.access_token) {
    const acodeRes: AcodeRes = await $fetch(
      `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${accessTokenRes.access_token}&env=${config.cbEnv}&name=wxacode`,
      {
        method: 'POST',
        contentType: 'application/json',
        body: ACODEPOSTBODY
      }
    )

    if (acodeRes.errcode === 0) {
      return JSON.parse(acodeRes.resp_data)
    }
    else {
      return createCustomError('call acode function error.')
    }
  }
  else {
    return createCustomError('get access_token error.')
  }
})

function createCustomError(errorMsg: string): CustomError {
  return {
    code: '500',
    data: '',
    errorMsg: errorMsg
  }
}
