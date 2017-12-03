$("#slideshow .element").each(function(){
  $(this).on("mouseenter", function(){
    $(this).find(".description").css("visibility","visible");
  }).on("mouseleave", function(){
    $(this).find(".description").css("visibility","hidden");
  });
});
$("#slideshow").css("width", $(window).width()-505+"px")

var t = 1000;

function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  }
  ,t);

}
