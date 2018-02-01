/*global jQuery: false, moment: false*/
jQuery(function($) {
    "use strict";

 function applyComponentStyles() {
     var PROCESSED_HERO_TEASER = "data-styles-hero-teaser-processed";

  $(".cmp-teaser--hero").not("["+ PROCESSED_HERO_TEASER +"='true']").each(function() {
            var nav = $(this).attr(PROCESSED_HERO_TEASER, true),
                $image = $(this).find(".cmp-image__image");
            
            if($image) {
                $(this).attr("style", "background-image:url('" + $image.attr("src") + "');");
                
            }
        });
    }

  applyComponentStyles();
  
  $(".responsivegrid").bind("DOMNodeInserted", applyComponentStyles);
});