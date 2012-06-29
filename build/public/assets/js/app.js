var TopView = Em.View.create({
	templateName:"container-template",
	classNames:["top", "container"],
		
	childView:Em.View.extend({
		templateName:"top-content",
		copy:copy.main
	}),
	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  		resizeAll();
  	},

  	resize:function(obj){
  		
  		TopView.$().css({
  				"height":obj.height
  		})

  	}
  
});

var AboutView = Em.View.create({
	templateName:"container-template",
	classNames:["about", "container"],
	
	childView:Em.View.create({
		templateName:"about-content",
		copy:copy.about,
		
		tweetTime:'',
		tweet:'',
		
		didInsertElement:function(){
			//load tweet message:
			//https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
			$.getJSON(
					"http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+
					this.copy.twitter.account+"&include_entities=0&trim_user=1&count=10"+
					"&callback=?", //make it JSONP XMLHTTPRequest
					function(data){
						if( data.length > 0 ){
							
							var d = data[0].created_at;
								d = d.replace("+0000 ", "");
							var date = new Date(d);
							
							AboutView.childView.set("tweetTime" , date.toLocaleDateString() );
							AboutView.childView.set("tweet", data[0].text );
						}else{
							$("#twitter-container").fadeOut();
						}
					}
					);
		}
	}),

	didInsertElement:function(){
		//child = this.childView.create().appendTo( this.$('.content') );
		this.childView.appendTo( this.$('.content') );
  	},
  	resize:function(obj){}
});

var FormulasView = Em.View.create({
	templateName:"container-template",
	classNames:["formulas", "container"],
	
	childView:Em.View.extend({
		templateName:"formula-content",
		name:"Formulas",
		copy:copy.formula
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  	},

  	resize:function(obj){}
});

var TeamView = Em.View.create({
	templateName:"container-template",
	classNames:["team", "container"],
	
	childView:Em.View.extend({
		templateName:"team-content",
		name:"TEAM",
		copy:copy.team
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
    	
  	},
  	resize:function(obj){}
});

var OpportunitiesView = Em.View.create({
	templateName:"container-template",
	classNames:["opportunities", "container"],
	
	childView:Em.View.extend({
		templateName:"opportunities-content",
		name:"Opportunities",
		copy:copy.opportunities
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  	},
  	resize:function(obj){}
});

var ContactView = Em.View.create({
	templateName:"container-template",
	classNames:["contact", "container"],
	
	childView:Em.View.extend({
		templateName:"contact-content",
		name:"CONTACT",
		copy:copy.contact
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
    
  	},
  	resize:function(obj){}
});



var NavView = Em.View.create({
	templateName:"nav-template",
	classNames:"navigation",

	items:[
		//{name:"HOME" , link:TopView }
		{	name:"SIC Group", 
			id:'about', 
			view:AboutView
		},
		{
			name:"Formulas", 
			id:'formula', 
			view:FormulasView 
		},
		{
			name:"Team", 
			id:'team',
			view:TeamView 
		},
		{
			name:"Opportunities", 
			id:'opportunities', 
			view:OpportunitiesView 
		},
		{
			name:"Contact", 
			id:'contact', 
			view:ContactView 
		}
	],
	/*init:function(){ this._super();},*/
	
	didInsertElement:function(){
		$(".navigation-item").click(this.itemClicked);
		resizeAll();

	},

	itemClicked:function(e){
		Debug.trace(' ITEM CLICKED ' + $(this).data("link") );
		for(var i=0; i < NavView.items.length; i++){
			if( $(this).data("link") == NavView.items[i].id ){
				//MATCH:
				var view = NavView.items[i].view;
				var val = view.$().offset().top;
				
				$('body,html').animate({
									scrollTop:val
									},
									500,
									resizeAll
								);

				break;
			}
		}
	},

	scrollEvent:function(e, delta){
		//Debug.trace(' scroll -- ' );
		//Debug.trace( delta);
		//?? resizeAll(); 

		NavView.resize({width:$(window).width() , height:$(window).height() });
	},

	resize:function(obj){
		var navcoordY = (TopView.$().height()-NavView.$().height());

		var belowFold = ($(window).scrollTop() > navcoordY )? true : false; 

		var pos = (belowFold == true )? 'fixed' : 'absolute';
		var top = (belowFold == true )? 0 :  TopView.$().height()-NavView.$().height() ;
		var left = (obj.width - NavView.$().width())/2;

		NavView.$().css({
			'position':pos,
			'top':top,
			'left':left
		});
		
	}
})
