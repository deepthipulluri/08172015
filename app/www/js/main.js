require.config({

	paths: {
		jquery: "../libs/jquery/dist/jquery"
	},

	shim: {
		jquery: {
			exports: '$'
		}
	}

});

//requirejs(['app-amd/app']);
requirejs(['app-amd/appFileUpload'], function(fileUploader){
	fileUploader.fileUpload("somediv");
});

