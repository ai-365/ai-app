// *********************
// fetch-llm请求大模型
// 需要的参数： 
// 1、输入框：用于获取问题
// 2、答案元素，将大模型返回的内容填充进答案
// 获取API Key（请确保此密钥安全）
async function fetchLLM(inputNode,answerNode) {
    const apiKey = 'sk-107e5aa6bb7f493897cbda772484166d'; // 通义
    // const apiKey = 'sk-b597474cb73243f8bb6e91e6236f04a8'; // deepseek

    // 请求的 API URL
    const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    // const url = 'https://api.deepseek.com/chat/completions';

    const 请求头 = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    })
    // 定义或更新请求体
    const image_url = 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg'
    const 请求体 = {
        model: "qwen-omni-turbo",
        // model: "deepseek-chat",
    
        messages: [
            { role: "system", content: [{type:"text",text:"你是一个智能助理"}]},
            { role: "user", content: [{type:"image_url",image_url:{url:window.base64}},{type:'text',text:inputNode.value}] }
        ],
        modalities:["text"],
        stream: true,
        stream_options: { include_usage: true },
        // audio: { voice: "Cherry", format: "wav" },
    }

    // 清空输入框内容
    inputNode.value = ''

    const response = await fetch(url, { method: 'POST', headers: 请求头, body: JSON.stringify(请求体) })
    
    
    // 对响应进行后处理
    let reader = await response.body.getReader()
    const utf8Decoder = new TextDecoder('utf-8')

    /**/
    while (1) {
        const { done, value } = await reader.read()
        
        let result = utf8Decoder.decode(value)
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

export {fetchLLM}
