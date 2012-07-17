
var TopView = Em.View.create({
	templateName:"container-template",
	classNames:["top", "container"],
	
	bkgd:{w:900, h:650},

	imgBkgd:function(){
		return global.assets()+'images/bkgds/main-bkgd.jpg';
  	},
	
  	childView:Em.View.extend({
		templateName:"top-content",
		classNames:"top-content",
		copy:copy.main,
		formulas:[
	  		{title:"formula", number:1},
	  		{title:"formula", number:2},
	  		{title:"formula", number:3}
  		],

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

  		var h = (availH < global.minHeight )? global.minHeight : availH ;

  		TopView.$().css({
  				"height":h
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
		copy:copy.team,

		didInsertElement:function(){
			var count = copy.team.members.length;
			var margin = 10;

			this.$("#members li").css({
				"width":(this.$("#members").width()/count)-margin*2,
				"margin-right":margin,
				"margin-left":margin
			})
		}
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
    	
		/*
		 <a href="https://twitter.com/share" class="twitter-share-button" data-lang="en">Tweet</a>
      	<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

      	<div class="fb-like" data-href="http://www.google.com" data-send="false" data-width="200" data-show-faces="false"></div>

      	<!-- Place this tag where you want the +1 button to render -->
      	<g:plusone size="small" annotation="inline"></g:plusone>

      	<!-- Place this render call where appropriate -->
      	<script type="text/javascript">
        (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
      	</script>
      */

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
			name:"Formulas", 
			id:'formula', 
			view:FormulasView 
		},
		{
			name:"Opportunities", 
			id:'opportunities', 
			view:OpportunitiesView 
		},
		{
			name:"Team", 
			id:'team',
			view:TeamView 
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

			var view = NavView.items[i].view;
			var val = view.$().offset().top;
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

		NavView.resize({width:$(window).width() , height:$(window).height() });
	},

	resize:function(obj){
		var navcoordY = (TopView.$().height() - NavView.$().height() );

		var belowFold = ($(window).scrollTop() > navcoordY )? true : false; 

		var pos = (belowFold == true )? 'fixed' : 'absolute';
		var top = (belowFold == true )? 0 :  TopView.$().height()-NavView.$().height() ;
		//var left = (obj.width - NavView.$().width())/2;

		NavView.$().css({
			'position':pos,
			'top':top
			//,'left':left
		});

		//determine if the nav view active item is the actually correct one / state.
		for( var n=0; n < NavView.items.length; n++){
			var prev = (n-1<0)? 0: n-1;
			//GO TO TOP position for nav is less then item:
			Debug.trace( $(window).scrollTop() + ' vs. ' + NavView.items[n].view.$().offset().top );

			if( $(window).scrollTop() < NavView.items[n].view.$().offset().top-100 ){
				//select previous
				Debug.trace(' update: ' + prev );
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
