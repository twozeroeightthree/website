$("#slideshow .element").each(function(){
  $(this).on("mouseenter", function(){
    $(this).find(".description").css("visibility","visible");
  }).on("mouseleave", function(){
    $(this).find(".description").css("visibility","hidden");
  });
});
