
const component = document.querySelector('input-component')
const input = component.shadowRoot.querySelector('#imageInput')
const preview = component.shadowRoot.querySelector('#imagePreview')


    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            // 以DataURL的形式读取文件
            reader.readAsDataURL(file);
    
            // 读取文件完成后的回调
            reader.onload = function(e) {
                window.base64 = e.target.result;
                preview.src = base64;
                preview.style.display = 'inline';
            };
    
    
            
        }
    })


