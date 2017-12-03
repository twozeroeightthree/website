$("#slideshow .element").each(function(){
  $(this).on("mouseenter", function(){
    $(this).find(".description").css("visibility","visible");
  }).on("mouseleave", function(){
    $(this).find(".description").css("visibility","hidden");
  });
});
$("#slideshow").css("width", $(window).width()-505+"px")

var t = 1000;
var index = 0;

function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
}


function goto(n){
  var pos = $("#slideshow .element").eq(n).position().left;
  console.log(pos);
  $("#slideshow").animate({
    scrollLeft: $("#slideshow").scrollLeft()+pos
  }, t);
}

function next(){
  if ($("#description").is(":visible")){
    hide();
  }
  else{
    index+=2;
    goto(index);
  }
}
