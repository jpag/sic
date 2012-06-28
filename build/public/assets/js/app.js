var NavView = Em.View.create({
	templateName:"nav-template",
	classNames:"navigation",

	items:[
		//{name:"HOME" , link:TopView }
		{name:"SIC Group" , link:AboutView },
		{name:"Formulas" , link:FormulasView },
		{name:"Team" , link:TeamView },
		{name:"Opportunities" , link:OpportunitiesView },
		{name:"Contact" , link:ContactView }
	],
	/*init:function(){ this._super();},*/
	
	didInsertElement:function(){
		$(".navigation-item").click(this.itemClicked);
		resizeAll();

	},

	itemClicked:function(e){
		Debug.trace(' ITEM CLICKED ' + $(this).data("link") );
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

var TopView = Em.View.create({
	templateName:"container-template",
	classNames:["top", "container"],
		
	childView:Em.View.extend({
		templateName:"top-content",
		name:"TOP INSERTED",
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
	
	childView:Em.View.extend({
		templateName:"about-content",
		name:"ABOUT",
		copy:copy.about
	}),

	didInsertElement:function(){
		child = this.childView.create().appendTo( this.$('.content') );
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

