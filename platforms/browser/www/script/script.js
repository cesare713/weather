$(document).ready(function(){
    
    // 헤더바, 섹션바 높이 설정해주기
    function secset(){
        var vh = $(window).outerHeight();
        var vw = $(window).outerWidth();
        var hh = $("#hdbar").outerHeight();
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        $("section").height(vh-hh);
        $("#top").height(vh-hh-mh-bh);
        if(vh < vw){
            $("#midbot").css("margin-top",vh-hh-220+"px");
        }else{
            $("#midbot").css("margin-top","0px");
        }
    }
    
    secset();
    
    $(window).resize(function(){
        secset();
    });
    
    function id2icon(id){
        var icon = "";
        if(id>=200 && id<300){
            icon = "fas fa-bolt";
        }else if(id>=300 && id<400){
            icon = "fas fa-cloud-rain";
        }else if(id>=400 && id<600){
            icon = "fas fa-cloud-shower-heavy";
        }else if(id>=600 && id<700){
            icon = "fas fa-snowflake";
        }else if(id>=700 && id<800){
            icon = "fas fa-smog";
        }else if(id==800){
            icon = "fas fa-sun";
        }else if(id==801 || id==802){
            icon = "fas fa-cloud-sun";
        }else if(id==803 || id==804){
            icon = "fas fa-cloud";
        }
        //
        return icon;
    }
    
    function settime(){
        var now = new Date();
        var result;
        now = now.getHours();
        if(now >=0 && now < 3){
            result = 5;
        }else if(now >= 3 && now < 6){
            result = 6;
        }else if(now >= 6 && now < 9){
            result = 7;
        }else if(now >= 9 && now < 12){
            result = 0;
        }else if(now >= 12 && now < 15){
            result = 1;
        }else if(now >= 15 && now < 18){
            result = 2;
        }else if(now >= 18 && now < 21){
            result = 3;
        }else if(now >= 21 && now < 24){
            result = 4;
        }
        return result;
        
    }
    
    function suc(result){
        var timezone = result.city.timezone / 3600;
        var listindex = settime(timezone);
        
        $("#city").text(result.city.name);
        var icontxt = id2icon(result.list[listindex].weather[0].id);
        $("#icon").removeClass().addClass(icontxt);
        $("#info").text(result.list[listindex].weather[0].description);
        var temp = result.list[listindex].main.temp;
        temp = temp.toFixed(1);
        $(".temp").text(temp);
        var speed =result.list[listindex].wind.speed;
        speed = speed.toFixed(1);
        $("#speed").text(speed);
        $("#hum").text(result.list[listindex].main.humidity);
        var deg = result.list[listindex].wind.deg;
        $("#dir").css("transform","rotate("+deg+"deg)");
        var max = result.list[listindex].main.temp_max;
        var min = result.list[listindex].main.temp_min;
        max = max.toFixed(1);
        min = min.toFixed(1);
        $("#max").text(max);
        $("#min").text(min);
        clen();
        for(i=0;i<5;i++){
            var ftime = new Date(result.list[i*8].dt*1000);
            var fmonth = ftime.getMonth() + 1;
            var fdate = ftime.getDate();
            $(".fdate").eq(i).text(fmonth+'/'+fdate);
            var code = result.list[i*8].weather[0].id;
            var icon = id2icon(code);
            $(".fc").eq(i).children("svg").removeClass().addClass(icon);
            var ftemp = result.list[i*8].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".fc").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = result.city.sunset * 1000;
        sunset = new Date(sunset);
        var now = new Date();
        if(now < sunset){
            if(icon == "fas fa-sun" || icon == "fas fa-cloud-sun"){
                $("section").css("background-image","url(images/day_clear.jpg)");
            }else if(icon == "fas fa-bolt" || icon == "fas fa-smog" || icon == "fas fa-cloud"){
                $("section").css("background-image","url(images/day_cloud.jpg)");
            }else if(icon == "fas fa-cloud-rain" || icon == "fas fa-cloud-shower-heavy" || icon == "fas fa-snowflake"){
                $("section").css("background-image","url(images/day_rainy.jpg)");
            }
        }else{
            $("section").css("background-image","url(images/night_clear.jpg)");
        }
    }
    
    // city글자수에 따라 글자크기 지정하기
    function clen(){
        var len = $("#city").text().length;
        if(len > 14){
            $("#city").addClass("stext");
        }else{
            $("#city").removeClass("stext");
        }
    }
    
    clen();
    
    
    upd($('.citybtn:nth-of-type(2)'));
    
    $(".citybtn").click(function(){
        upd(this);
    });
    
    var link = "http://api.openweathermap.org/data/2.5/forecast";
    var myid = "07ade6235e753e5975f264b736920ec1";
    
    
    
    function upd(subject){
        var city = $(subject).attr("data");
        if(city != "custom"){
            // 도시명 검색
            $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "q":city,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric"
                },
                success: suc
            });
        }else{
            // 위도, 경도 검색
            var lat;
            var lon;
//            
//            if(navigator.geolocation){
//                navigator.geolocation.getCurrentPosition(function(position){
//                    position.coords.latitude;
//                    position.coords.longitude;
//                });
//            }
                
            $.ajax({
                url: "http://ipinfo.io/geo",
                dataType: "json",
                success: function(result){
                    var loc = result.loc;
                    loc = loc.split(",");
                    lat = loc[0];
                    lon = loc[1];
                }
            })
            
            
            $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "lat":lat,
                    "lon":lon,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric"
                },
                success: suc
            });
        }
    }
});

// http://api.openweathermap.org/data/2.5/forecast
// q=London
// mode=json
// units=metric
// appid=07ade6235e753e5975f264b736920ec1