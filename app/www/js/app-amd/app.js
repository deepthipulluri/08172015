define(['jquery'],function(){
	
	console.log("Hello world");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){

		if(xhr.readyState === 4 && xhr.status === 200){
			console.log(xhr.responseText);
		}
	};

	xhr.open("GET", "/api/widgets");
	xhr.send();

/* Jquery
	$.ajax("/api/widgets").success(function(){
		console.dir(arguments);
	});
	
	$.ajax("/api/widgets").then(function(){
		console.dir(arguments);
	});
*/

/*
	function myAjax(url,successFn){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.status === 200){
				successFn(xhr.responseText);
			}
		};

		xhr.open("GET", url);
		xhr.send();
	}

	myAjax("/api/widgets", function(res){
			console.log(res);
		
	});

*/

	function myAjax(url){

		var p = new Promise (function(resolve,reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){

				if(xhr.readyState === 4 && xhr.status === 200){
					resolve(JSON.parse(xhr.responseText));
				}
			};

			xhr.open("GET", url);
			xhr.send();
		});
		return p;
	}

//myAjax("/api/widgets") calls the promise is created and the get call is made already
// and when the promise resolves the .then method is immediately called .. while the promise is being resolved the other things below can execute

	myAjax("/api/widgets").then(function(result){
		console.dir(arguments);
	});


/*promises : undefined -> resolved
			 any value obj - > resolved
			 Error - > rejected ..in jquery error doesnt mean rejected, since it calls the exception handler.
			 reject ->rejected ..always better to return promise.reject for reject
*/




});
