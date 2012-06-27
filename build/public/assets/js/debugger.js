var Debug = new function(){

	var d;

	return {

		init:function(){
			//is this needed?
			d = this;
		},

		trace:function(str){
			try{
				
				console.log( str );

			}catch(err){

			}
		}


	}
}