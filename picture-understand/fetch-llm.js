// *********************
// fetch-llm请求大模型
// 需要的参数： 
// 1、输入框：用于获取问题
// 2、答案元素，将大模型返回的内容填充进答案
// 获取API Key（请确保此密钥安全）



async function fetchLLM(inputNode, answerNode) {
    const apiKey = 'sk-107e5aa6bb7f493897cbda772484166d'; // 通义
    // 请求的 API URL
    const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    })
    // 定义或更新请求体
    const body = {
        model: "qwen-omni-turbo",

        messages: [
            { role: "system", content: [{ type: "text", text: "你是一个智能助理" }] },
            { role: "user", content: [{ type: "image_url", image_url: { url: window.base64 } }, { type: 'text', text: inputNode.value }] }
        ],
   
        stream: true,
        stream_options: { include_usage: true },
        
    }

    // 清空输入框内容
    inputNode.value = ''

    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })


    // 对响应进行后处理
    let reader = await response.body.getReader()
    const utf8Decoder = new TextDecoder('utf-8')

    /**/
    while (true) {
        const { done, value } = await reader.read()
        let result = utf8Decoder.decode(value)

        // 处理文本
        let content = result.match(/{"content":"(.*?)"}/g)
        // 使用可选连?.避免null或undefined报错
        content?.forEach(x => {
            answerNode.textContent += JSON.parse(x).content
            // 不断滚动
            document.body.scrollBy(0, 300)
        })

        if (done) break
    }

}

export { fetchLLM }
