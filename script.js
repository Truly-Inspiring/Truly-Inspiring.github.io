var quotes = [];
var audio = [];
var liked = 0;
var seenQuotes = [];
var sinceLastRequest = "";
var keyList = [];
var likeList = [];
var canvasFont = 0;
var normalFont = 0;
var quoteCount = 0;
var occupied = 1;
var firstOne = 0;
var sessionId = "";
var exportWidth = 0;
var exportHeight = 0;
document.getElementById("button").style.color = "rgb(200,200,200)";
document.getElementById("button").setAttribute("onClick", "");

window.onload = function() {
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);
	if (urlParams.get('w') != null && urlParams.get('w') != "" & urlParams.get('w') > 0 && urlParams.get('w') != undefined && urlParams.get('w') != "undefined") {
		exportWidth = urlParams.get('w');
	}
	if (urlParams.get('h') != null && urlParams.get('h') != "" & urlParams.get('h') > 0 && urlParams.get('h') != undefined && urlParams.get('h') != "undefined") {
		exportHeight = urlParams.get('h');
	}
	console.log(exportWidth);
	$.get("https://beatsturning.com/games/truly-inspiring/id.php", function(data) {
		sessionId = data;
		cycle();
		run();
	});
}

function cycle() {
	if (quotes.length < 40) {
		var requestList = sinceLastRequest;
		sinceLastRequest = "";
		$.get("https://beatsturning.com/games/truly-inspiring/request.php?s=" + sessionId + "&r=" + requestList, function(data) {
			audio[audio.length] = JSON.parse(data)["mp3"];
  			data = JSON.parse(data)["data"];
  			//console.log(data);
			var i = 0;
			while (i < data.length) {
				if (data[i]["text"] != null) {
					//console.log(i + ' - ' + data[i]["text"]);
					quotes[quotes.length] = data[i]["text"];
					keyList[quotes.length - 1] = data[i]["key"];
					likeList[quotes.length - 1] = data[i]["likes"];
				}

				i++;
			}
			cycle();
		});
	} else {
		setTimeout(function() {
			cycle();
		}, 1000);
	}
}

function run() {

	if (audio.length > 0 && 0) {
		document.getElementById("audio").src = audio[0];
		document.getElementById("audio").load();
		document.getElementById("audio").play();
		audio.shift();
		document.getElementById("quote").innerHTML = "...";
	} else if (quotes.length == 0) {
		document.getElementById("quote").innerHTML = "Loading...";
		setTimeout(function() {
			run();
		}, 100);
	} else {
		document.getElementById("button").style.color = "rgb(200,200,200)";
		document.getElementById("button").setAttribute("onClick", "");
		if (seenQuotes.length > 200) {
			seenQuotes.shift();
		}
		//console.log(quotes);
		quotes.shift();
		keyList.shift();
		likeList.shift();
		liked = 0;
		setTimeout(function() {
			adjustSize();
		}, 1);
	}
}

function like() {
	if (occupied != 1) {
		document.getElementById("like-overlay").style.opacity= 1;
		setTimeout(function() {
		document.getElementById("like-overlay").style.opacity= 0;
		}, 200);
		console.log("liked");
		document.getElementById("like-counter").innerHTML = likeList[0] + 1;
		document.getElementById("like-heart").style.opacity = 0;
		setTimeout(function() {
			document.getElementById("like-counter").style.opacity = 1;
			setTimeout(function() {
				document.getElementById("like-counter").style.opacity = 0;
				setTimeout(function() {
					document.getElementById("like-heart").style.opacity = 1;
				}, 400);
			}, 700);
		}, 400);
		if (liked == 0) {
			liked = 1;
			var encoded = quotes[0];
			encoded = btoa(encoded);
			//alert(encoded);
			//console.log(encoded);
			$.get("https://beatsturning.com/games/truly-inspiring/like.php?s=" + encoded, function(data) {
				//console.log(data);
			});
		}
	}
}

function adjustSize() {
	console.log("adjusting");
	sinceLastRequest = sinceLastRequest + "-" + keyList[0];
	quoteCount++;
	var i = 0;
	var longestWord = 0;
	occupied = 1;
	firstOne++;
	console.log(exportWidth);
	console.log(exportHeight);
	if (exportWidth != 0 && exportHeight != 0) {
		console.log("changing dimensions");
		console.log(document.getElementById("canvasbuilder").clientWidth / exportWidth);
		console.log(document.getElementById("canvasbuilder").clientHeight / exportHeight);
		if (document.getElementById("canvasbuilder").clientWidth / exportWidth > document.getElementById("canvasbuilder").clientHeight / exportHeight) {
			console.log("wider");
			console.log(document.getElementById("canvasbuilder").clientHeight / exportHeight * exportWidth)
			document.getElementById("exportcontainer").style.width = (document.getElementById("canvasbuilder").clientHeight / exportHeight * exportWidth) + "px";
		} else {
			console.log("taller");
			console.log(document.getElementById("canvasbuilder").clientWidth / exportWidth * exportHeight);
			document.getElementById("exportcontainer").style.height = (document.getElementById("canvasbuilder").clientWidth / exportWidth * exportHeight) + "px";
		}
		document.getElementById("quote-container").style.height = (document.getElementById("quote-container").clientWidth / exportWidth * exportHeight) + "px";
	}
	if (quoteCount == 1) {
		quotes[0] = quotes[0].replace(/«/g, '"');
		quotes[0] = quotes[0].replace(/»/g, '"');
		quotes[0] = quotes[0].split("[pause 1].").join("...");
		quotes[0] = quotes[0].split("[pause 2].").join("...");
		quotes[0] = quotes[0].split("[pause 3].").join("...");
		quotes[0] = quotes[0].split("[pause 1]").join("..");
		quotes[0] = quotes[0].split("[pause 2]").join("..");
		quotes[0] = quotes[0].split("[pause 3]").join("..");
		seenQuotes[seenQuotes.length] = quotes[0];
		liked = 0;
		document.getElementById("canvastext").innerHTML = "<span class=canvasword>" + quotes[0].split(" ").join("</span> <span class=canvasword>") + "</span>";

		canvasFont = 0;
		document.getElementById("canvastext").style.fontSize = "50px";
		//alert($('.canvasword').length);
		while (i < $('.canvasword').length) {
			if (document.getElementsByClassName("canvasword")[i].clientWidth > document.getElementsByClassName("canvasword")[longestWord].clientWidth) {
				longestWord = i;
			}
			i++;
		}
	
		document.getElementById("canvastext").style.fontSize = "0px";
		if (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 40 && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth) {
			while (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 40 && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth - 10) {
				canvasFont = canvasFont + 1;
				document.getElementById("canvastext").style.fontSize = canvasFont + "px";
				//console.log("height:" + document.getElementById("canvastext").clientHeight + " -- " + document.getElementById("quote-container").clientHeight);
			}
		}
		document.getElementById("quote").style.fontSize = canvasFont + "px";
		document.getElementById("quote").innerHTML = quotes[0];
		document.getElementById("exporttext").innerHTML = quotes[0];
		document.getElementById("exporttext").style.fontSize = canvasFont + "px";

		occupied = 2;
		quotes[1] = quotes[1].replace(/«/g, '"');
		quotes[1] = quotes[1].replace(/»/g, '"');
		quotes[1] = quotes[1].split("[pause 1].").join("...");
		quotes[1] = quotes[1].split("[pause 2].").join("...");
		quotes[1] = quotes[1].split("[pause 3].").join("...");
		quotes[1] = quotes[1].split("[pause 1]").join("..");
		quotes[1] = quotes[1].split("[pause 2]").join("..");
		quotes[1] = quotes[1].split("[pause 3]").join("..");
		while (seenQuotes.includes(quotes[1])) {
			quotes.splice(1,1);
			keyList.splice(1,1);
			likeList.splice(1,1);
			quotes[1] = quotes[1].replace(/«/g, '"');
			quotes[1] = quotes[1].replace(/»/g, '"');
			quotes[1] = quotes[1].split("[pause 1].").join("...");
			quotes[1] = quotes[1].split("[pause 2].").join("...");
			quotes[1] = quotes[1].split("[pause 3].").join("...");
			quotes[1] = quotes[1].split("[pause 1]").join("..");
			quotes[1] = quotes[1].split("[pause 2]").join("..");
			quotes[1] = quotes[1].split("[pause 3]").join("..");
		}
		seenQuotes[seenQuotes.length] = quotes[1];
		document.getElementById("canvastext").innerHTML = "<span class=canvasword>" + quotes[1].split(" ").join("</span> <span class=canvasword>") + "</span>";
		i = 0;
		longestWord = 0;
		canvasFont = 0;
		document.getElementById("canvastext").style.fontSize = "50px";
		//alert($('.canvasword').length);
		while (i < $('.canvasword').length) {
			if (document.getElementsByClassName("canvasword")[i].clientWidth > document.getElementsByClassName("canvasword")[longestWord].clientWidth) {
				longestWord = i;
			}
			i++;
		}
	
		document.getElementById("canvastext").style.fontSize = "0px";
		if (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 10 - canvasFont && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth) {
			while (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 10 - canvasFont && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth - 10) {
				canvasFont = canvasFont + 1;
				document.getElementById("canvastext").style.fontSize = canvasFont + "px";
			}
		}
		//alert(Date.now() - startTime);
		occupied = 0;
		document.getElementById("button").style.color = "black";
		document.getElementById("button").setAttribute("onClick", "javascript: run();");
	} else {
		document.getElementById("quote").style.fontSize = document.getElementById("canvastext").style.fontSize;
		document.getElementById("quote").innerHTML = quotes[0];
		document.getElementById("exporttext").innerHTML = quotes[0];
		document.getElementById("exporttext").style.fontSize = canvasFont + "px";
		occupied = 2;
		setTimeout(function() {
			quotes[1] = quotes[1].replace(/«/g, '"');
			quotes[1] = quotes[1].replace(/»/g, '"');
			quotes[1] = quotes[1].split("[pause 1].").join("...");
			quotes[1] = quotes[1].split("[pause 2].").join("...");
			quotes[1] = quotes[1].split("[pause 3].").join("...");
			quotes[1] = quotes[1].split("[pause 1]").join("..");
			quotes[1] = quotes[1].split("[pause 2]").join("..");
			quotes[1] = quotes[1].split("[pause 3]").join("..");
			while (seenQuotes.includes(quotes[1])) {
				quotes.splice(1,1);
				keyList.splice(1,1);
				likeList.splice(1,1);
				quotes[1] = quotes[1].replace(/«/g, '"');
				quotes[1] = quotes[1].replace(/»/g, '"');
				quotes[1] = quotes[1].split("[pause 1].").join("...");
				quotes[1] = quotes[1].split("[pause 2].").join("...");
				quotes[1] = quotes[1].split("[pause 3].").join("...");
				quotes[1] = quotes[1].split("[pause 1]").join("..");
				quotes[1] = quotes[1].split("[pause 2]").join("..");
				quotes[1] = quotes[1].split("[pause 3]").join("..");
			}
			//console.log(seenQuotes);
			//console.log(quotes[1]);
			seenQuotes[seenQuotes.length] = quotes[1];
			document.getElementById("canvastext").innerHTML = "<span class=canvasword>" + quotes[1].split(" ").join("</span> <span class=canvasword>") + "</span>";
			canvasFont = 0;
			document.getElementById("canvastext").style.fontSize = "50px";
			//alert($('.canvasword').length);
			while (i < $('.canvasword').length) {
				if (document.getElementsByClassName("canvasword")[i].clientWidth > document.getElementsByClassName("canvasword")[longestWord].clientWidth) {
					longestWord = i;
				}
				i++;
			}

			document.getElementById("canvastext").style.fontSize = "0px";
			if (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 10 - canvasFont && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth) {
				while (document.getElementById("canvastext").clientHeight < document.getElementById("quote-container").clientHeight - 10 - canvasFont && document.getElementsByClassName("canvasword")[longestWord].clientWidth + canvasFont < document.getElementById("canvasbuilder").clientWidth - 10) {
					canvasFont = canvasFont + 1;
					document.getElementById("canvastext").style.fontSize = canvasFont + "px";
				}
			}
			occupied = 0;
			document.getElementById("button").style.color = "black";
			document.getElementById("button").setAttribute("onClick", "javascript: run();");
		}, 50);
	}
}

function saveQuote() {
	document.getElementById("exportregion").style.display = "block";
	html2canvas(document.querySelector("#exportcontainer")).then(canvas => {
		document.getElementById("exportregion").style.display = "none";
		download(canvas, 'Truly Inspiring.png');
	});
}

function download(canvas, filename) {
  /// create an "off-screen" anchor tag
 	var lnk = document.createElement('a'), e;

  /// the key here is to set the download attribute of the a tag
  	lnk.download = filename;

  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  	lnk.href = canvas.toDataURL("image/png;base64");

  /// create a "fake" click-event to trigger the download
  	if (document.createEvent) {
    	e = document.createEvent("MouseEvents");
    	e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    	lnk.dispatchEvent(e);
  	} else if (lnk.fireEvent) {
    	lnk.fireEvent("onclick");
  	}
}

function viewLikes() {
	$('.likes-like').remove();
	document.getElementById("likes-header").style.display = "block";
	document.getElementById("likes-container").style.opacity = 1;
	document.getElementById("likes-container").style.pointerEvents = "auto";
	$.get("https://beatsturning.com/games/truly-inspiring/likes.php", function(data) {
		var importLikes = JSON.parse(data);
		//console.log(importLikes);
		var i = 0;
		while (i < importLikes.length) {
			//alert(importLikes.length);
			var likesLike = document.createElement('span');
			document.getElementById('likes-container').appendChild(likesLike);
			likesLike.classList.add("likes-like");
			document.getElementById("canvastext").style.fontSize = "50px";
			document.getElementById("canvastext").innerHTML = "<span class=likesword>" + importLikes[i]["quote"].split(" ").join("</span> <span class=likesword>") + "</span>";
			var a = 0;
			var longestLikeWord = 0;
			while (a < $('.likesword').length) {
				if (document.getElementsByClassName("likesword")[a].clientWidth > document.getElementsByClassName("likesword")[longestLikeWord].clientWidth) {
					longestLikeWord = a;
				}
				a++;
			}
			document.getElementById("canvastext").style.fontSize = "1px";
			var likeSize = 1;
			while (document.getElementsByClassName("likesword")[longestLikeWord].clientWidth + likeSize < document.getElementById("canvasbuilder").clientWidth - 10 && document.getElementById("canvastext").clientHeight < document.getElementById("canvasbuilder").clientHeight * 0.7) {
				likeSize = likeSize + 1;
				document.getElementById("canvastext").style.fontSize = likeSize + "px";
			}
			likesLike.style.fontSize = likeSize + "px";
			likesLike.innerHTML = importLikes[i]["quote"];
			likesLike.setAttribute("onClick", "javascript: runLike(" + i + ", " + importLikes[i]["likes"] + ", " + importLikes[i]["key"] + ");");

			i++;
		}
		document.getElementById("likes-header").style.display = "none";
		//alert("done");
	});
}

function runLike(id, likes, key) {
	//alert(document.getElementsByClassName("likes-like")[id].innerHTML);
	var message = document.getElementsByClassName("likes-like")[id].innerHTML;
	quotes[0] = message;
	likeList[0] = likes;
	keyList[0] = key;
	quoteCount = 0;
	document.getElementById("likes-container").style.opacity = 0;
	document.getElementById("likes-container").style.pointerEvents = "none";
	document.getElementById("quote").innerHTML = "";
	occupied = 1;
	liked = 0;
	setTimeout(function() {
		adjustSize();
	}, 50);
}
