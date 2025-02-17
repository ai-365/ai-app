
document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        // 读取文件完成后的回调
        reader.onload = function(e) {
            window.base64 = e.target.result;
            document.getElementById('imagePreview').src = base64;
            document.getElementById('imagePreview').style.display = 'inline';
        };

        // 以DataURL的形式读取文件
        reader.readAsDataURL(file);
        
    }
});


