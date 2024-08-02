$(function () {
    var lista;
    function limpiaNombre(cadena) {
    	cadena = cadena.replace("<![CDATA[", "");
    	cadena = cadena.replace(">", "");
    	cadena = cadena.replace("]]", "");
    	return cadena;
    }
    function limpiaUrl(cadena) {
        var pos = cadena.lastIndexOf("/");
        return cadena.substring(pos + 1);
    }
    function play(cadena, pos,title,min) {
        $("#audio").attr("src", cadena);
        $("#audio").attr("autoplay", "");
        /*
        $("#audio").on("ended", function () {
            if (pos < lista.length - 1) {
                play(lista[pos + 1].r, pos + 1,lista[pos + 1].title);
            } else {
                play(lista[0].r, 0,lista[0].title);
            }
        });
        */
		$("#audio")[0].currentTime = min*60;
        $("#titulo").remove();
        $("#audioDiv").prepend("<span data-pos='" + pos + "' id='titulo'>" + limpiaNombre(title) + "</span>");
        //guardar nombre del podcast en localstorage
        localStorage.setItem("_scorizer_mp3", cadena);
    	$("#playLast")[0].dataset.mp3 = localStorage.getItem("_scorizer_mp3");
        localStorage.setItem("_scorizer_title", limpiaNombre(title));
    	$("#lastPodcast").html(localStorage.getItem("_scorizer_title"));
    	localStorage.setItem("_scorizer_time", min);    	
    	$("#lastTime").html(localStorage.getItem("_scorizer_time"));
    	window.scrollTo(0, 0);
    }
    function buscar(url, nombre) {
		$.ajax({
			type: 'GET',
			url: encodeURI(url),
			success: function(data){
				//lista = data;
				lista = [];

                //console.log(data);

                data = new window.DOMParser().parseFromString(data, "text/xml");

                const items = data.querySelectorAll("item");

                pos = 0;
                i = 0;    
                $(".botones").removeClass("none");
                $(".botones").addClass("visto");

				$("#listado").text("");
				$("#listado").append("<h3>" + nombre + "</h3>");

				var itemPos = 1;
				var itemPos = 1;
				for (i = items.length-1; i >= 0; i--) {
					//items.forEach(el => {
    				//var inicio = el.querySelector("enclosure").outerHTML.toString().indexOf('url="');
    				var inicio = items[i].querySelector("enclosure").outerHTML.toString().indexOf('url="');
    				var fin = items[i].querySelector("enclosure").outerHTML.toString().indexOf('.mp3');
    				if (inicio != -1 && fin == -1) {
    					//console.log(el.querySelector("enclosure").outerHTML);
						fin = items[i].querySelector("enclosure").outerHTML.toString().indexOf('.m4a');
    				}
					
					var duration = 0;

					items[i].childNodes.forEach(x => { 
						//console.log(x);
						
    					if (x.innerHTML != undefined) {
    					 	if (x.outerHTML.indexOf('duration') > 0) {
	    						duration = x.innerHTML;
    						}
    					}
    					
    				});
    				lista.push({title:limpiaNombre(items[i].querySelector("title").innerHTML), r:items[i].querySelector("enclosure").outerHTML.toString().substring(inicio+5, fin+4), time:duration});    				
			    	//});
				}

                pos = 0;
				$("#listado").text("");
				$("#listado").append("<h3>" + nombre + "</h3>");
				if (lista.length > 0) {

                	//console.log(lista);
                	//data.reverse();                    
                    $(".botones").removeClass("none");
                    $(".botones").addClass("visto");

					escuchados = [0,1];
					for (var i = 0; i < lista.length; i++) {
						if (!escuchados.includes(i)) {
							$("#listado").append("<button class='pure-button pista' data-pista='" + i + "'>" + lista[i].time + " - " + limpiaUrl(lista[i].title) + "</button><br/>");
						}
					}
					//play(lista[0].r, 0,lista[0].title);
					$(".pista").on("click", function () {
						play(lista[$(this).data("pista")].r, $(this).data("pista"),lista[$(this).data("pista")].title,0);
					});
					/*
					$("#atras").on("click", function () {
						var pos = $("#titulo").data("pos");
						if (pos > 0) {
							play(lista[pos - 1].r, pos - 1,lista[pos - 1].title);
						} else {
							play(lista[lista.length - 1].r, lista.length - 1,lista[lista.length - 1].title);
						}
					});
					$("#adelante").on("click", function () {
						var pos = $("#titulo").data("pos");
						if (pos < lista.length - 1) {
							play(lista[pos + 1].r, pos + 1,lista[pos + 1].title);
						} else {
							play(lista[0].r, 0,lista[0].title);
						}
					});
					*/
				} else {
					$("#listado").append("<h5>Error al parsear el feed</h5>");
				}

			},
			error: function(xhr, type){
				$("#listado").append("<h5>Error al obtener el feed</h5>");
			}
		});
    }
    buscar("https://anchor.fm/s/90df42ac/podcast/rss","Scorizer");

    $("#playLast")[0].dataset.mp3 = localStorage.getItem("_scorizer_mp3");
    $("#lastPodcast").html(localStorage.getItem("_scorizer_title"));
    $("#playLast")[0].dataset.podcast = localStorage.getItem("_scorizer_title");
    $("#lastTime").html(localStorage.getItem("_scorizer_time"));
	$("#playLast")[0].dataset.min = localStorage.getItem("_scorizer_time");
	
	function myTimer() {
		if ($("#audio")[0].duration > 0) {
			localStorage.setItem("_scorizer_time", parseInt(parseInt($("#audio")[0].currentTime)/60));
    		$("#lastTime").html(localStorage.getItem("_scorizer_time"));
    		$("#playLast")[0].dataset.min = localStorage.getItem("_scorizer_time");
		}
  	}
    //$("#audio").currentTime

	$("#playLast").on("click", function (x) {
		//debugger;

		play(x.target.dataset.mp3, 0,x.target.dataset.podcast,x.target.dataset.min);

		//console.log(x.target.dataset.podcast);
		//console.log(x.target.dataset.min);

	});
    setInterval(myTimer, 5000);// 50000);
});
