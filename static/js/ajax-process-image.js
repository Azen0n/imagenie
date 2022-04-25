let processBtn = document.getElementById('process-btn');
let method = processBtn.getAttribute('name');

processBtn.addEventListener('click', function () {
    let data = collectData();

    $.ajax({
        method: 'POST',
        url: method + '/',
        headers: {
            'X-CSRFToken': CSRF_TOKEN,
        },
        data: data,
        processData: false,
        contentType: false,
        mimeType: 'multipart/form-data',
        success: function (response) {
            document.getElementById('img-processed').src = JSON.parse(response)['image'];
            let reader = new FileReader();
            reader.readAsDataURL($('#image-file').prop('files')[0]);
            reader.onload = function () {
                document.getElementById('img-original').src = reader.result;
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function collectData() {
    let paramElements = document.querySelectorAll('*[id^="param"]');
    let params = [];
    for (const param of paramElements) {
        params.push(param.value);
    }
    let imageFile = $('#image-file').prop('files')[0];
    let data = new FormData();
    data.append('image', imageFile);
    data.append('method', method);
    data.append('params', JSON.stringify(params));

    return data;
}