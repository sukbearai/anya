import type {
  GenerativeModel } from '@google-cloud/vertexai'
import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} from '@google-cloud/vertexai'

interface GeminiConfig {
  project: string
  textModel: string
}

export class Gemini {
  vertexAI: VertexAI
  generativeModel: GenerativeModel

  constructor(config: GeminiConfig) {
    this.vertexAI = new VertexAI({ project: config.project, location: 'us-central1' })

    this.generativeModel = this.vertexAI.getGenerativeModel({
      model: config.textModel,
      // The following parameters are optional
      // They can also be passed to individual content generation requests
      safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
      generationConfig: { maxOutputTokens: 1000 }
    })
  }

  async * streamGenerateContent(prompt: string) {
    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    }
    const streamingResult = await this.generativeModel.generateContentStream(request)
    let i = 0
    for await (const item of streamingResult.stream) {
      console.log('stream chunk: ', JSON.stringify(item))
      yield `event: message\ndata: ${item.candidates && item.candidates[0].content.parts[0].text}\nid: ${i}\n\n`
      i++
    }
    await streamingResult.response
    // console.log('aggregated response: ', JSON.stringify(aggregatedResponse))

    yield `event: end\ndata: close\n\n`

    return 'success'
  }
}
