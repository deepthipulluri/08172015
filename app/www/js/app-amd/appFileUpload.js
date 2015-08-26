define(['jquery'],function(){
			console.log("out");
	return {
		fileUpload: function (selectorName){

		var div = $("<div>");
		div.addClass(selectorName);

		var label = $("<label> Choose a file to upload</label>");
		var inputFile = $("<input type='file' id='uploadFile' multiple=''/>")
		var button = $("<button type='button' id='upload'>upload</button>");
		var brea = $("<br>");
		var progress = $("<progress id='uploadProgress' value='0' max='0'></progress>")
		div.append(label);
		div.append(inputFile);
		div.append(button);
		div.append(brea);
		div.append(progress);
		$("body").append(div);

		$("."+selectorName +">#upload").on("click", function(){
			var fileInput= document.getElementById("uploadFile");
			var fd = new FormData();
			for(var x=0; x< fileInput.files.length; x++){
				fd.append("file-" + x, fileInput.files[x])
			}
			var xhr = new XMLHttpRequest();
			xhr.addEventListener("readystatechange", function(){
				if(xhr.readyState === 1 &&  !xhr.status === 200){
						console.log("error occured");
				}

				if(xhr.readyState === 4 && xhr.status === 200){
						console.log(xhr.responseText);
				}
			});

			xhr.upload.addEventListener("progress", function(e){
				var uploadProgress = document.getElementById("uploadProgress");
				uploadProgress.setAttribute("max",e.total);
				uploadProgress.setAttribute("value",e.loaded);

			});

			//wire up on ready state change 

			xhr.open("POST","api/upload");
			xhr.send(fd);
		});
	}
	};

	//fileUpload("uploader2");
});
