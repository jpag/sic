
var TopView = Em.View.create({
	templateName:"container-template",
	classNames:["top", "container"],
	
	bkgd:{w:1500, h:413},
	
	imgBkgd:function(){
		return global.assets()+'images/bkgds/main-bkgd.jpg';
  	},
	
  	childView:Em.View.extend({
		templateName:"top-content",
		classNames:"top-content",
		copy:copy.main,
		
		didInsertElement:function(){
			resizeAll();
		}
	}),
	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  		//resizeAll();
  		TopView.$().prepend('<img id="bkgd" src="'+this.imgBkgd()+'" style="display:none;" onload="TopView.bkgdLoaded();" />')
  	},

  	bkgdLoaded:function(){
  		TopView.bkgd.w = TopView.$('#bkgd').width();
  		TopView.bkgd.h = TopView.$('#bkgd').height();
  		TopView.$('#bkgd').fadeIn();

  		resizeAll();
  	},

  	resize:function(obj){
  		var availH = obj.height - AboutView.$().height();

  		var h = TopView.bkgd.h;
  		
  		TopView.$().css({
  				"height":380+50
  		})
  		
  		$(".top-content").css({
  			"top":Math.round( h*.1 )
  		})

  		var windowRatio = obj.width/h;
  		var bkgdRatio = TopView.bkgd.w/TopView.bkgd.h

  		var th = availH;
  		var tw = bkgdRatio*th;
  		
  		if( obj.width > tw ){
  		 	tw = obj.width;
  		 	th = 1/bkgdRatio*tw;
  		 }
  		 if( th < TopView.bkgd.h ){
  		 	th = TopView.bkgd.h;
  		 	tw = bkgdRatio/1*TopView.bkgd.h;
  		 }

  		 TopView.$('#bkgd').css({
  		 	"height": Math.round(th),
  		 	"width" : Math.round(tw)
  		 })


  	}
  
});

var AboutView = Em.View.create({
	templateName:"container-template",
	classNames:["about", "container"],
	
	childView:Em.View.create({
		templateName:"about-content",
		copy:copy.about,
		twitterUser:"https://twitter.com/",
		tweets:[],

		init:function(){
			this.twitterUser = "https://twitter.com/"+this.copy.twitter.account;

			this._super();
		},

		didInsertElement:function(){
			//load tweet message:
			//https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
			$.getJSON(
					"http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+
					this.copy.twitter.account+"&include_entities=0&trim_user=1&count=10"+
					"&callback=?", //make it JSONP XMLHTTPRequest
					function(data){
						if( data.length > 0 ){
							
							var tweet1 = AboutView.childView.generateTweet(data[0]);
							var tweet2 = (data.length > 1 )? AboutView.childView.generateTweet(data[1]) : {};

							var tweets = [
										tweet1, tweet2
										]

							AboutView.childView.set("tweets" , tweets );
							
						}else{
							$("#twitter-container").fadeOut();
						}
					}
					);
		},

		generateTweet:function(obj){
			var d = obj.created_at;
				d = d.replace("+0000 ", "");
			var date = new Date(d);
			var stringDate = date.toLocaleDateString();
			var txt = obj.text;

			var url = "https://twitter.com/"+obj.user.id_str+"/status/" + obj.id_str;

			return {text:txt, date:stringDate, url:url }
		}
	}),

	didInsertElement:function(){
		//child = this.childView.create().appendTo( this.$('.content') );
		this.childView.appendTo( this.$('.content') );
  	},
  	resize:function(obj){}
});

var ServicesView = Em.View.create({
	templateName:"container-template",
	classNames:["services", "container"],
	displayTitle:copy.service.title,
	
	backgroundImage: global.assets()+'images/bkgds/'+copy.service.imgname,

	carouselState:0,

	childView:Em.View.create({
		templateName:"service-content",
		classNames:["servicesView"],
		name:"Services",
		copy:copy.service,
		
		init:function(){
			for( var c =0; c < this.copy.services.length; c++){
				this.copy.services[c].id = c;
			}

			this._super();
		},
	
		didInsertElement:function(){
			this.$(".right-arrow").bind({
				"click":ServicesView.carouselClickRight
			})
			this.$(".left-arrow").bind({
				"click":ServicesView.carouselClickLeft
			})
			this.$(".carousel-circle").bind({
				"click":ServicesView.carouselClickCircle
			})
		}
	}),

	didInsertElement:function(){
		//var child = this.childView.create().appendTo( this.$('.content') );
		this.childView.appendTo( this.$('.content') );
  	},
  	
  	carouselClickCircle : function(){
  		var id = $(this).data('id');
  		ServicesView.gotoSpecificCarouselState(id)
  	},

  	carouselClickRight : function(){
  		ServicesView.gotoSpecificCarouselState(ServicesView.carouselState+1);
  	},

  	carouselClickLeft : function(){
  		ServicesView.gotoSpecificCarouselState(ServicesView.carouselState-1);	
  	},

  	gotoSpecificCarouselState:function(id){
  		if( ServicesView.carouselState != id ){
  			var min = 0;
  			var max = copy.service.services.length-1;
  			
  			var disableRight = false;
  			var disableLeft = false;

  			if( id <= min ){
  				//left
  				id = 0;
  				disableLeft = true;
	  		}else if(id >= max){
  				//right
  				id = max;
  				disableRight = true;
  			}
  			
  			var left = -id * $(window).width();
  			ServicesView.carouselState = id;
			ServicesView.animateCarousel(left , disableLeft, disableRight );  		

  		}else{
  			return false;
  		}
  	},

  	animateCarousel:function(left, disableLeft, disableRight ){

  		ServicesView.disableArrow('.right-arrow', disableRight);
  		ServicesView.disableArrow('.left-arrow', disableLeft);

  		//update circle thing at bottom
  		ServicesView.$(".carousel-circle").removeClass('active');
  		ServicesView.$(".carousel-circle[data-id='"+ServicesView.carouselState+"']").addClass('active');

  		ServicesView.$("#service-content").animate({
  			"left":left
  		})
  	},

  	disableArrow:function(_class,boo){
  		Debug.trace(_class);
  		if( boo ){
  			ServicesView.$(_class).addClass("disable");
  		}else{
  			if( ServicesView.$(_class).hasClass("disable") ){
  				ServicesView.$(_class).removeClass("disable");
  			}
  		}
  		
  	},
  	resize:function(obj){
  		
  		var val = (obj.width - ServicesView.$(".backgroundImage img").width() ) /2;
  		ServicesView.$(".backgroundImage img").css({
  			"left":val
  		})

  		//carousel
  		$(".service-item").css({
			"width":obj.width
		})

		$("#service-content").css({
				"width":obj.width*copy.service.services.length
		});

		ServicesView.$("#carousel-position").css({
			"left": (obj.width-ServicesView.$("#carousel-position").width() )/2
		})

  		
  	}
});

var OpportunitiesView = Em.View.create({
	templateName:"container-template",
	classNames:["opportunities", "container"],
	displayTitle:copy.opportunities.title,

	childView:Em.View.extend({
		templateName:"opportunities-content",
		name:"Opportunities",
		copy:copy.opportunities,
		init:function(){
			for( var c=0; c < this.copy.columns.length; c++){
				this.copy.columns[c].logo = global.assets() + 'images/icons/'+ this.copy.columns[c].logo;
			}
			this._super();
		}
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  	},
  	resize:function(obj){}
});

var ContactView = Em.View.create({
	templateName:"container-template",
	classNames:["contact", "container"],
	displayTitle:copy.contact.title,

	childView:Em.View.extend({
		templateName:"contact-content",
		name:"CONTACT",
		copy:copy.contact,
		didInsertElement:function(){
			//create google maps here.
			ContactView.initMap(); 

		}

	}),


	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
  	},

  	initMap:function(){
  		this.$().append("<div id='gmaps-container' ></div>");
  		//start on first location.
  		var StartLatlng = new google.maps.LatLng( 
												copy.contact.locations[0].lat,
												copy.contact.locations[0].lng 
												);
  		
  		var firstLocation = $("#locations .location-onmap")[0];
		$(firstLocation).addClass("active").html(copy.contact.mapStates.on);	
  		
		var styles = (typeof mapStyle != 'undefined')? mapStyle : []
  		//https://developers.google.com/maps/documentation/javascript/reference
  		var settings = {      
  						center: StartLatlng,
  						mapTypeId: google.maps.MapTypeId.ROADMAP,
  						scrollwheel:false,				
  						zoom: 15,
  						maxZoom:17,
  						minZoom:10,
  						zoomControlOptions: {
				     		style: google.maps.ZoomControlStyle.SMALL
				 		},
				 		mapTypeControl:false,
				 		panControl:true,
				 		//zoomControl:false,
				 		styles:styles
  		 				}    

		gMap = new google.maps.Map(document.getElementById("gmaps-container"), settings);        


		for( var m=0; m < copy.contact.locations.length; m++ ){
			var Latlng = new google.maps.LatLng( 
												copy.contact.locations[m].lat,
												copy.contact.locations[m].lng 
												);

  		  	var marker = new google.maps.Marker({
												position: Latlng,
												map: gMap,
												title:copy.contact.locations[m].name + ", " + copy.contact.locations[m].city   
											});   

  		}


  	},

  	centerMap:function(t){
  		Debug.trace(' CENTER MAP');
  		var lat = $(t).data('lat');
  		var lng = $(t).data('lng');
  		var LatLng = new google.maps.LatLng(lat,lng);
  		gMap.panTo(LatLng);

  		//remove all others that may have the active class:
  		$("#locations .location-onmap").removeClass("active").html(copy.contact.mapStates.off);
  		//add state to the current selected one.
  		$(t).addClass("active").html(copy.contact.mapStates.on);

  	},

  	resize:function(obj){}
});



var FooterView = Em.View.create({
	templateName:"container-template",
	classNames:["footer", "container"],
	
	childView:Em.View.extend({
		templateName:"footer-content",
		name:"FOOTER",
		copy:copy.footer
	}),

	didInsertElement:function(){
		var child = this.childView.create().appendTo( this.$('.content') );
    
  	},
  	resize:function(obj){}
});



var NavView = Em.View.create({
	templateName:"nav-template",
	classNames:"navigation",

	active:0,

	items:[
		//{name:"HOME" , link:TopView }
		{	name:"SIC Group", 
			id:'about', 
			view:AboutView
		},
		{
			name:"services", 
			id:'services', 
			view:ServicesView 
		},
		{
			name:"Opportunities", 
			id:'opportunities', 
			view:OpportunitiesView 
		},
		/*{
			name:"Team", 
			id:'team',
			view:TeamView 
		},*/
		{
			name:"Contact", 
			id:'contact', 
			view:ContactView 
		}
	],
	/*init:function(){ this._super();},*/
	
	didInsertElement:function(){
		$(".navigation-item").click(this.itemClicked);
		
		this.updateNav(this.active);
		resizeAll();

	},

	itemClicked:function(e){
		Debug.trace(' ITEM CLICKED ' + $(this).data("link") );

		for(var i=0; i < NavView.items.length; i++){
			if( $(this).data("link") == NavView.items[i].id ){
				NavView.updateNav(i);

				break;
			}
		}
	},
	
	//updates arrow position
	//updates color toggle
	updateNav:function(i , scrollWindow ){
			if( typeof scrollWindow === 'undefined' ){
				scrollWindow = true;
			}	
			var TopPadding = 50;

			var view = NavView.items[i].view;
			var val = view.$().offset().top - TopPadding;
			var navItem = $(".navigation-item")[i];

			$(".navigation-item").removeClass('selected');

			$(navItem).addClass('selected');

			if( NavView.items[i].id == 'about' ){
				val = 0;
			}

			//current view to animate from..
			var currentView = NavView.items[NavView.active].view;
			var timeFactor = Math.abs( currentView.$().offset().top - val);

			NavView.set("active" , i  );

			//Debug.trace(  currentView.$().parent() )

			if( scrollWindow == true ){
				//Debug.trace(' DIF ' + timeFactor + ' b html' + currentView.$().offset().top + ' val ' + val);
				var time = 1500*timeFactor/$('body,html').height();
			
				//Debug.trace( time );
				if( time < 500 ){ 
					time = 500;
				}else if( time > 1200 ){
					time = 1200
				}

				$('body,html').animate({
								scrollTop:val
							},
							{
								duration:time,
								complete:resizeAll,
								step:resizeAll
							});
			}

			//animate the arrow:
			$("#nav-arrow").css({
								"left": $(navItem).offset().left + $(navItem).width()/2 - $("#nav-arrow").width()/2
								});
	},

	scrollEvent:function(e, delta){
		//Debug.trace(' scroll -- ' );
		//Debug.trace( delta);
		//?? resizeAll(); 

		NavView.resize({width:global.width() , height:$(window).height() });
	},

	resize:function(obj){
		var navcoordY = (TopView.$().height() - NavView.$().height() );

		var belowFold = ($(window).scrollTop() > navcoordY )? true : false; 

		var pos = (belowFold == true )? 'fixed' : 'absolute';
		var top = (belowFold == true )? 0 :  TopView.$().height()-NavView.$().height() ;
		//var left = (obj.width - NavView.$().width())/2;

		NavView.$().css({
			'position':pos,
			'top':top,
			'width':obj.width
			//,'left':left
		});

		//determine if the nav view active item is the actually correct one / state.
		for( var n=0; n < NavView.items.length; n++){
			var prev = (n-1<0)? 0: n-1;
			//GO TO TOP position for nav is less then item:
			//Debug.trace( $(window).scrollTop() + ' vs. ' + NavView.items[n].view.$().offset().top );

			if( $(window).scrollTop() < NavView.items[n].view.$().offset().top-100 ){
				//select previous
				//Debug.trace(' update: ' + prev );
				NavView.updateNav(prev, false);
				break;
			}else if( $(window).scrollTop() > NavView.items[NavView.items.length-1].view.$().offset().top-100  ){
				NavView.updateNav(NavView.items.length-1, false);
				break;
			}

		}

		var navItem = $(".navigation-item")[NavView.active];

		$("#nav-arrow").css({
					"left": $(navItem).offset().left + $(navItem).width()/2 - $("#nav-arrow").width()/2
					});
		
	}
})

