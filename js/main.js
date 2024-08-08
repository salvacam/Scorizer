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
        //TODO
        //$("#audio").attr("autoplay", "");
		$("#audio")[0].currentTime = min;
		$("#audio")[0].title = limpiaNombre(title);
        $("#titulo").remove();
        $("#audioDiv").prepend("<span data-pos='" + pos + "' id='titulo'>" + limpiaNombre(title) + "</span>");
        localStorage.setItem("_scorizer_mp3", cadena);
    	$("#playLast")[0].dataset.mp3 = localStorage.getItem("_scorizer_mp3");
        localStorage.setItem("_scorizer_title", limpiaNombre(title));
    	$("#lastPodcast").html(localStorage.getItem("_scorizer_title"));
    	localStorage.setItem("_scorizer_time", min);    	
    	$("#lastTime").html(parseInt(parseInt($("#audio")[0].currentTime)/60));
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
				//TODO cambiar el orden
				for (i = 0; i < items.length; i++) {
				//for (i = items.length-1; i >= 0; i--) {
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
                    $(".botones").removeClass("none");
                    $(".botones").addClass("visto");

					let escuchados = 0; //22; //TODO poner a 0 
					for (var i = 0; i < lista.length; i++) {
						if (i >= escuchados) { // && i < 30) {

							//$("#listado").append("<audio controls src='" + lista[i].r + "' title='"+ lista[i].title + "'></audio>");

							$("#listado").append("<button class='pure-button pista' data-pista='" + i + "'>" + lista[i].time + " - " + limpiaUrl(lista[i].title) + "</button><br/>");
						}
					}
					$(".pista").on("click", function () {
						play(lista[$(this).data("pista")].r, $(this).data("pista"),lista[$(this).data("pista")].title,0);
					});
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
	$("#lastTime").html(parseInt(localStorage.getItem("_scorizer_time")/60));
	$("#playLast")[0].dataset.min = localStorage.getItem("_scorizer_time");
	
	function myTimer() {
		if ($("#audio")[0].duration > 0) {
			localStorage.setItem("_scorizer_time", parseInt($("#audio")[0].currentTime));
    		$("#lastTime").html(parseInt(localStorage.getItem("_scorizer_time")/60));
    		$("#playLast")[0].dataset.min = localStorage.getItem("_scorizer_time");
		}
  	}

	$("#playLast").on("click", function (x) {
		play(x.target.dataset.mp3, 0,x.target.dataset.podcast,x.target.dataset.min);
	});

	$("#play").on("click", function (x) {
		if ($('audio')[0].src != '') {
			if($('audio')[0].paused) {
				$('audio')[0].play();
				$("#play").html("Pause");
			} else {
				$('audio')[0].pause();
				$("#play").html("Play");
			}	
		}
	});
    setInterval(myTimer, 30000);
});
