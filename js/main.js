 $(document).ready(function(){

    var _url = "https://my-json-server.typicode.com/rezhagraha/pwmapi/car"

    var dataResult = ''
    var carResult = ''
    var merks = []
    
    function renderPage(data){
        $.each(data, function(key, items) {

            _car = items.merk

            dataResult += "<div>"
                        + "<h3>" + _car + "</h3>"
                        + "<p>" + items.model + "</p>"
                        + "<p>" + items.year + "</p>"
                        + "<hr />"
            "<div>";

            if($.inArray(_car, merks) == -1 ){
                merks.push(_car)
                carResult += "<option value'"+ _car +"'>" + _car + "</option>"
            }

        })

        $('#car').html(dataResult)
        $('#car_select').html("<option value='all'>Semua</option>" + carResult)
    }

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
    
                dataResult += "<div>"
                            + "<h3>" + _car + "</h3>"
                            + "<p>" + items.model + "</p>"
                            + "<p>" + items.year + "</p>"
                            + "<hr />"
                "<div>";
    
            })
    
            $('#car').html(dataResult)
    
        })

    }
})

//PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker register successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}