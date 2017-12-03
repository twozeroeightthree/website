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
$("#nextbar").on("click",function(){
  next();
});


function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
}
$( window ).resize(function() {
  $("#slideshow").width(width:$(window).width()-125);
});


function goto(n){
  if (n>elements-1){
    n = 0;
  }
  else if (n<0) {
    n = elements-1;
  }
  var pos = $("#slideshow .element").eq(n).position().left;
  $("#slideshow").animate({
    scrollLeft: $("#slideshow").scrollLeft()+pos
  }, t);
}

function next(){
  var delta = Math.floor($("#slideshow").width()/($(".element").first().width()+10));
  if ($("#description").is(":visible")){
    hide();
  }
  else {
    index += delta;
    goto(index);
  }
  if (index > elements-1){
    index = 0;
  }
}

function previous(){
  var delta = Math.floor($("#slideshow").width()/($(".element").first().width()+10));
  index -= delta;
  goto(index);
  if (index < 0){
    index = elements-1;
  }
}
