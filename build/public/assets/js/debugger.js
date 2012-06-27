var Debug = new function(){

	var d = null;

	return {

		init:function(){
			//is this needed?
			d = this;

			
			//DISABLE THE DEFAULT GLOBAL.CSS stylesheet (the first one)	
			document.styleSheets[0].disabled = true;

			//ADD THE LESS COMPILER AND LESS FILES.
			var sjs = '<script src="'+global.assets()+'js/libs/less-1.3.0.min.js"><\/script>';
            document.write(sjs);

           var linkrel = '<link rel="stylesheet/less" type="text/css" href="'+global.assets()+'css/global.less">'
           $('head').append(linkrel);

		},

		trace:function(str){
			try{					
				console.log( str );
			}catch(err){
				//error catch
			}
		}

	}
}

