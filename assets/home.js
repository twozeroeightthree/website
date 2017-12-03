var t = 1000;
var index = 0;
var elements = $("#slideshow .element").length;

$("#slideshow .element").each(function(){
  $(this).on("mouseenter", function(){
    $(this).find(".description").css("visibility","visible");
  }).on("mouseleave", function(){
    $(this).find(".description").css("visibility","hidden");
  });
});
$("#slideshow").css("width", $(window).width()-505+"px");

$("#nextbutton").css("opacity",1).css("top","280px");

function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
}

function goto(n){
  if (n>elements-1){
    n=0;
  }
  var pos = $("#slideshow .element").eq(n).position().left;
  $("#slideshow").animate({
    scrollLeft: $("#slideshow").scrollLeft()+pos
  }, t);
}

function next(){
  if ($("#description").is(":visible")){
    hide();
  }
  else {
    index+=2;
    goto(index);
  }
  if (index > elements-1){
    index=0;
  }
}
