const component = document.querySelector('input-component')
component.shadowRoot.querySelector('#imageInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        // 读取文件完成后的回调
        reader.onload = function(e) {
            window.base64 = e.target.result;
            component.shadowRoot.querySelector('#imagePreview').src = base64;
            component.shadowRoot.querySelector('#imagePreview').style.display = 'inline';
        };

        // 以DataURL的形式读取文件
        reader.readAsDataURL(file);
        
    }
});


