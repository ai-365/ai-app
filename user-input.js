const primaryArea = document.querySelector('#primary')
// 输入组件：包括输入框、按钮、图片上传、图片预览
const inputComponent = document.querySelector('input-component')
// 用户输入框
const userInput = inputComponent.shadowRoot.querySelector('#user-input')

// 发送按钮节点
const sendButton = inputComponent.shadowRoot.querySelector('#send-button')

// 页面加载后自动聚焦到输入框：
window.onload = () => {
  userInput.focus()
}


// 激活输入框期间，监听Enter键
userInput.onkeyup = event => {
  // 检测到Enter键且没按其它控制键，就模拟点击sendButton
  if (event.key == 'Enter' && !event.ctrlKey && !event.shiftKey && !event.metaKey && userInput.value !== '') {
    sendButton.click()
    // 高度复原： 
    userInput.style.height = '3rem'
  }
}
// 输入框输入时自动调整高度
userInput.oninput = () => {
  userInput.style.height = userInput.scrollHeight + 'px';
}

sendButton.onclick = async function () {

  // 移除输入框和发送按钮的初识样式，回到页面底部
  inputComponent.style.bottom = '5vh'

  // 滚动到页面底部
  window.scrollBy(0, document.body.scrollHeight);

  // 创建问题组件
  const questionComponent = document.createElement('question-component')
  questionComponent.style.width = '100%'
  const questionImage = questionComponent.shadowRoot.querySelector('#question-image')
  questionImage.src = window.base64
  const questionText = questionComponent.shadowRoot.querySelector('#question-text')
  questionText.textContent = userInput.value==''?'图中描绘了什么景象':userInput.value
  primaryArea.append(questionComponent)

  // 创建答案组件
  const answerComponent = document.createElement('answer-component')
  answerComponent.style.width = '100%'
  const answerText = answerComponent.shadowRoot.querySelector('#answer-text')
  primaryArea.append(answerComponent)


  // 获取fetchLLM()函数，从云服务中调用大模型
  const { fetchLLM } = await import('./fetch-llm-picture-input.js')
  fetchLLM(userInput, answerText)

}
