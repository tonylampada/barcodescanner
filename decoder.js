var ctx
var canvas
var workerCount = 0;
var ResultOfDecoding = document.getElementById("dec")
var gimgid;
function receiveMessage(e) {
	if(e.data.success === "log") {
		console.log(e.data.result);
		return;
	}
	workerCount--;
	if(e.data.success){
		var tempArray = e.data.result;
		for(var i = 0; i < tempArray.length; i++) {
			if(resultArray.indexOf(tempArray[i]) == -1) {
				resultArray.push(tempArray[i]);
			}
		}
		ResultOfDecoding.innerHTML=resultArray.join("<br />");
		alert(ResultOfDecoding.innerHTML)
		workerCount = 0;
	}else {
		if(workerCount == 1) {
			FlipWorker.postMessage({pixels: ctx.getImageData(0,0,canvas.width,canvas.height).data, cmd: "flip"});
		}
	}
	if(workerCount == 0){
		if(resultArray.length === 0) {
			ResultOfDecoding.innerHTML="Decoding failed.";
			setTimeout(function(){
				take_snapshot()
			}, 500);
		}else {
			ResultOfDecoding.innerHTML=resultArray.join("<br />");
		}
	}
}
var DecodeWorker = new Worker("DecoderWorker.js");
var FlipWorker = new Worker("DecoderWorker.js");
DecodeWorker.onmessage = receiveMessage;
FlipWorker.onmessage = receiveMessage;
var resultArray = [];
function Decode(imgid) {
	gimgid = imgid
    var img = document.getElementById(imgid);
    canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    ctx = canvas.getContext("2d");
	if(workerCount > 0) return;
	workerCount = 2;
	ResultOfDecoding.innerHTML='decoding...';
	resultArray = [];
	ctx.drawImage(img,0,0,canvas.width, canvas.height);
	DecodeWorker.postMessage({pixels: ctx.getImageData(0,0,canvas.width,canvas.height).data, cmd: "normal"});
}
