(function($) {

  $.fn.imageCycle = function(options) {

    // build main options before element iteration
    var opts = $.extend({}, $.fn.imageCycle.defaults, options);
  
    // iterate and reformat each matched element
    return this.each(function() {   
        // declaring vars
         var $viewport = $(this),
             $items_wrapper = $(opts.items_wrapper, $viewport),
             $items = $('li', $items_wrapper),
             $images = $items.find('img'),
             $items_w_orig = 0,
             $items_w = 0,
             $items_array_widths = [],
             $viewport_w = $viewport.width(),
             $prev = $('.prev' , $viewport ),
             $next = $('.next' , $viewport),
             $timer,
             $added_images = 0,
             $added_images_w = 0,
             killInterval,
             viewport_offset;
             
             
             
             //move_wrapper 
             var move_item = function(dir) {
                var offsetleft = $items_wrapper[0].offsetLeft;
                if (dir === 'next') {
                  var pos = (offsetleft >= 0) ? -($items_w-$viewport_w)+viewport_offset : offsetleft + opts.displacement + 'px'; 
                }else{
                  var pos = (offsetleft <= -1*($items_w - $viewport_w)) ? -viewport_offset : (offsetleft - opts.displacement) + 'px';
                }
                $items_wrapper.css('left', pos); 
             }
             
             
             //recursive timeout to animate lists
             var setTimer = function(dir){
               setTimeout(function(){ 
                    move_item(dir);
                    if (killInterval == false) setTimer(dir);
                  }
                  , opts.interval );
             }; 
            
             
             var init = function(){
               //Calculate each <li> width and wrapper width.
                $items.each(function(i){
                  var this_w = $(this).outerWidth(true);
                  $items_w_orig = this_w + $items_w_orig;
                  $items_array_widths[i] = this_w;
                });


               //calculamos cuantas imagenes llenan el viewport  
               var i = 0;
               while (i <= $viewport_w){
                 i+= $items_array_widths[$added_images];
                 $added_images_w += $items_array_widths[$added_images];
                 viewport_offset = i-$viewport_w;
                 $added_images++;
               };



               //Add the first images that fills the viewport to the end of the list.
               $items.slice(0, $added_images).clone().appendTo($items_wrapper);

               //Set the <ul> new width
               $items_w = parseInt($items_w_orig + $added_images_w);
               $items_wrapper.css('width', $items_w+'px');

               //custom onLoad function
               opts.onLoad($items_wrapper, $prev, $next);
               
               if (opts.animationOnLoadTime > 0) {
                 killInterval = false;
                 setTimeout(function(){  killInterval = true; } , opts.animationOnLoadTime );
                 setTimer(opts.animationDirection);            
               };
               

                //user actions
                $next.add($prev)
                  .bind('mousedown', function(){
                      killInterval = false;
                      setTimer($(this).attr('class'));
                   })
                   .bind('click', function(e){
                     e.preventDefault();
                   })
                   .bind('mouseup mouseleave', function(){
                    killInterval = true;
                  });
             }
             
             
             init();
             
    });
  }; 


  // plugin defaults
  $.fn.imageCycle.defaults = {
    viewport: '.viewport',
    items_wrapper: 'ul',
    displacement: 1,
    interval: 13,
    onLoad : function($wrap, $prev, $next){},
    animationOnLoadTime : 2000,
    animationDirection : 'left'
  };


})(jQuery);
