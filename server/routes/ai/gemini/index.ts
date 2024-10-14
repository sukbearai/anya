import { Readable } from 'node:stream'
import { Gemini } from '../model'

export default eventHandler((event) => {
  const config = useRuntimeConfig(event)
  const gemini = new Gemini({ project: config.geminiProjectId, textModel: 'gemini-1.0-pro' })
  setResponseHeader(event, 'Content-Type', 'text/event-stream;charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')
  setResponseHeader(event, 'Transfer-Encoding', 'chunked')

  return new Promise((resolve, reject) => {
    const geminiStream = Readable.from(gemini.streamGenerateContent('👋你好'))
    sendStream(event, geminiStream)
    geminiStream.on('end', () => {
      console.log('geminiStream end')
      resolve('success')
    })
    geminiStream.on('error', (e) => {
      console.log('geminiStream error')
      reject(e)
    })
    event.node.req.on('close', () => {
      console.log('connection closed')
      resolve('success')
    })
  })
})
