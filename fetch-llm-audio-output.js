// *********************
// fetch-llm请求大模型
// 需要的参数： 
// 1、输入框：用于获取问题
// 2、答案元素，将大模型返回的内容填充进答案
// 获取API Key（请确保此密钥安全）
async function fetchLLM(inputNode, answerNode) {
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

        messages: [
            { role: "system", content: [{ type: "text", text: "你是一个智能助理" }] },
            { role: "user", content: [{ type: "image_url", image_url: { url: window.base64 } }, { type: 'text', text: inputNode.value }] }
        ],
        modalities: ["text", "audio"],
        stream: true,
        stream_options: { include_usage: true },
        audio: { voice: "Cherry", format: "wav" },
    }

    // 清空输入框内容
    inputNode.value = ''

    const response = await fetch(url, { method: 'POST', headers: 请求头, body: JSON.stringify(请求体) })


    // 对响应进行后处理
    let reader = await response.body.getReader()
    const utf8Decoder = new TextDecoder('utf-8')

    const audioPlayer = document.querySelector('#audioPlayer')

    let base64String = ''

    function base64ToBlob(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'audio/wav' });
    }

    function base64ToArrayBuffer(base64) {
        // 将Base64字符串转换为二进制字符串
        const binaryString = atob(base64);

        // 创建一个长度为二进制字符串长度的ArrayBuffer
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        // 将每个字符的ASCII码值存入Uint8Array
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // 返回ArrayBuffer
        return bytes.buffer;
    }

    // Web Audio
    const ctx = new (window.AudioContext || window.webkitAudioContext())()
    console.log(ctx)
    // 创建MediaSource对象
    const mediaSource = new MediaSource()
    // 创建音频元素
    const audioElement = new Audio();
    audioElement.src = URL.createObjectURL(mediaSource)

    // 连接音频元素和音频上下文
    const source = ctx.createMediaElementSource(audioElement);
    source.connect(ctx.destination);

    // 监听MediaSource的sourceopen事件
    mediaSource.addEventListener('sourceopen', () => {
        // 创建SourceBuffer对象
        const sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');

        // 监听sourceBuffer的updateend事件
        sourceBuffer.addEventListener('updateend', () => {
            // 如果sourceBuffer中有数据，则开始播放音频
            if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                mediaSource.endOfStream();
                audioElement.play();
            }
        });
    })

    // 接收音频数据并追加到sourceBuffer
    function receiveAudioData(audioData) {
        sourceBuffer.appendBuffer(audioData);
    }

    /**/
    while (1) {
        const { done, value } = await reader.read()

        let result = utf8Decoder.decode(value)

        // 处理文本
        // let content = result.match(/{"content":"(.*?)"}/g)
        // // 使用可选连?.避免null或undefined报错
        // content?.forEach(x => {
        //     answerNode.textContent += JSON.parse(x).content
        //     // 不断滚动
        //     document.body.scrollBy(0, 300)
        // })

        // 处理音频base64
        let audioBase64 = result.slice(6).match(/"audio":(.*)?"data":"(?<audio>.*?)"/)?.groups?.audio
        if (audioBase64) {
            const arrayBuffer = base64ToArrayBuffer(audioBase64)
            console.log(arrayBuffer)
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            console.log(audioBuffer)

        }
        if (done) break
    }

    // const blob = base64ToBlob(base64String)
    // // console.log(blob)
    // const audioUrl = URL.createObjectURL(blob)
    // const audio = document.querySelector("#audioPlayer");
    // audio.autoplay = 'autoplay'
    // audio.src = audioUrl;
    // // console.log(audio)

}

export { fetchLLM }
