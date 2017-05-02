var $ = jQuery;

var GLOBALCONFIG = {
	activeClass: 'is-active',
	body: $('body')
}

/**
 * Header Search Form
 */

var HEADERSEARCH = {

	config: {
		searchOpen: false,
		searchFormWrap: $('.search-form__wrap'),
		fadeSpeed: 200
	},
	open: function(){
		MOBILENAVIGATION.config.navigationOpen ? MOBILENAVIGATION.close() : '';
		this.config.searchFormWrap.fadeIn(this.config.fadeSpeed).css('display', 'flex');
		this.config.searchFormWrap.find('.search-field').val('').focus();
		this.config.searchOpen = true;

		if(GLOBALCONFIG.body.hasClass('home')){
			$('.navigation-wrap').fadeTo(this.config.fadeSpeed, 0);
		}

	},
	close: function(){
		this.config.searchFormWrap.fadeOut(this.config.fadeSpeed);
		this.searchOpen = false;
		if(GLOBALCONFIG.body.hasClass('home')){
			$('.navigation-wrap').fadeTo(this.config.fadeSpeed, 1);
		}
	}

}


/**
 * Mobile Navigation
 */

var MOBILENAVIGATION = {

	config: {
		navigationOpen: false,
		navigationWrap: $('.navigation-wrap')
	},
	open: function(){
		HEADERSEARCH.config.searchOpen ? HEADERSEARCH.close() : '';
		this.config.navigationWrap.addClass(GLOBALCONFIG.activeClass);
		this.config.navigationOpen = true;
	},
	close: function(){
		this.config.navigationWrap.removeClass(GLOBALCONFIG.activeClass);
		this.config.navigationOpen = false;
	}

}


/**
 * Homepage Product Tabs
 */

var HOMETABS = {

	tabID: null,
	switchTab: function(trigger){
		tabID = trigger.attr('href');
		$('.home-featured-products__tab-link, .home-featured-products__tab-content').removeClass(GLOBALCONFIG.activeClass);
		trigger.addClass(GLOBALCONFIG.activeClass);
		$(tabID).addClass(GLOBALCONFIG.activeClass);
	}

}


jQuery(document).ready(function($){

	/**
	 * Fancy select menus
	 */

	$('select').select2();


	/**
	 * Header Search Form
	 */

	// open
	$('.search-trigger').on('click', function(){
		HEADERSEARCH.open();
	});

	// close
	$('.search-form__close').on('click', function(){
		HEADERSEARCH.close();
	});


	/**
	 * Mobile Navigation
	 */

	// open
	$('.menu-trigger').on('click', function(){
		MOBILENAVIGATION.open();
	});

	// close
	$('.navigation__close').on('click', function(){
		MOBILENAVIGATION.close();
	});


	/**
	 * Homepage splash
	 */

	 $('.homepage-splash').slick({
	 	arrows: false,
	 	dots: true,
	 	fade: true
	 });


	/**
	 * Footer top link
	 */

	$('.site-footer__top-link').on('click', function(e){
		e.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "fast");
		return false;
	});


	/**
	 * Mobile product category select
	 */

	$('.product-category-strip__select').on('change', function(){
		window.location.href = $(this).val();
	});


	/**
	 * Magnific Popup
	 */

	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe'
  });


	/**
	 * Home Product Tabs
	 */

	$('.home-featured-products__tab-link').on('click', function(e){
		e.preventDefault();
		HOMETABS.switchTab($(this));
	});


	/**
	 * Stockists search
	 * @TODO: Run this by Scott, might be a nicer way to do it
	 */

   $.get("/wp/wp-content/themes/mercator/assets/data/locations.json", function(data){

 		$("#stockist-search" ).autocomplete({
 	    source: ((typeof data === "string") ? jQuery.parseJSON(data) : data)
 	  });

   });



});
