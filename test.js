let timer = null
function generatorTimer() {
	timer = setInterval(() => {
		console.log(123);
	}, 2000);
}

generatorTimer();

function touchstart(){
  clearInterval(timer)
}

function touched(){
  generatorTimer()
}

