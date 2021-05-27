 $(document).ready(function(){
    //Data Api yang saya buat melalui Github
    var _url = "https://my-json-server.typicode.com/rezhagraha/pwmapi/car"

    //variabel untuk menyimpan array dari data API
    var dataResult = ''
    var carResult = ''
    var merks = []

    //start renderPage
    //renderPage yaitu untuk proses akhir dalam membuka web tersebut agar data dapat tersimpan di cachce
    function renderPage(data){
        $.each(data, function(key, items) {

            _car = items.merk

            dataResult += "<div class='card card-body mb-3' style='width: 18rem;'>"
                        + "<p> Nama Merk : " + _car + "</p>"
                        + "<p> Nama Model : " + items.model + "</p>"
                        + "<p> Tahun Rilis : " + items.year + "</p>"
            +"</div>"
            "<hr>";

            if($.inArray(_car, merks) == -1 ){
                merks.push(_car)
                carResult += "<option value'"+ _car +"'>" + _car + "</option>"
            }

        })

        $('#car').html(dataResult)
        $('#car_select').html("<option value='all'>Semua</option>" + carResult)
    }
    //End renderPage

    var networkDataReceived = false

    //fresh data dari online
    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(function(data){
        networkDataReceived = true
        renderPage(data)
    })

    //kembali ke data dari cache
    caches.match(_url).then(function(response){
        if(!response) throw Error('Tidak ada Data di Cache')
        return response.json()
    }).then(function(data){
        if(!networkDataReceived) {
            renderPage(data)
            console.log('render data dari cache')
        }
    }).catch(function() {
        return networkUpdate
    })

    //Fungsi Filter
    $("#car_select").on('change', function() {
        updateProduct($(this).val())
    })

    function updateProduct(x){

        var dataResult = ''
        var _newUrl = _url

        if(x != 'all')
        _newUrl = _url + "?merk=" + x

        $.get(_newUrl, function(data){

            $.each(data, function(key, items) {
    
                _car = items.merk
    
                dataResult += "<div class='card card-body mb-3' style='width: 18rem;'>"
                + "<p> Nama Merk : " + _car + "</p>"
                + "<p> Nama Model : " + items.model + "</p>"
                + "<p> Tahun Rilis : " + items.year + "</p>"
                +"</div>"
                "<hr>";
    
            })
    
            $('#car').html(dataResult)
    
        })

    }
})

//PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('Registrasi ServiceWorker sukses dengan Scope: ', registration.scope);
        }, function(err) {
            console.log('Registrasi ServiceWorker gagal: ', err);
        });
    });
}