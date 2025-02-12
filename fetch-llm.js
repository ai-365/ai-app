// *********************
// fetch-llm请求大模型
// 需要的参数： 
// 1、输入框：用于获取问题
// 2、答案元素，将大模型返回的内容填充进答案
// 获取API Key（请确保此密钥安全）
async function fetchLLM(inputNode, answerNode) {
    const apiKey = 'sk-107e5aa6bb7f493897cbda772484166d';

    // 请求的 API URL
    const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

    const 请求头 = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    })
    // 定义或更新请求体
    const 请求体 = {
        model: "qwen-plus",
        messages: [
            { role: "system", content: "你是一个智能助理" },
            { role: "user", content: inputNode.value }
        ],
        stream: true,
        stream_options: { include_usage: true },
    }

    // 清空输入框内容
    inputNode.value = ''

    const response = await fetch(url, { method: 'POST', headers: 请求头, body: JSON.stringify(请求体) })
    let reader = await response.body.getReader()
    const utf8Decoder = new TextDecoder('utf-8')

    while (1) {
        const { done, value } = await reader.read()
        let 结果 = utf8Decoder.decode(value)
        let 内容 = 结果.match(/{"content":"(.*?)"}/g)
        内容.forEach(x => {
            answerNode.innerText += JSON.parse(x).content
            // 不断滚动
            document.body.scrollBy(0, 300)
        })

        if (done) break
    }
}

export {fetchLLM}