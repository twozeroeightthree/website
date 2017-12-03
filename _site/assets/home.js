var t = 1000;
var index = 0;
var elements = $("#slideshow .element").length;
var delta = 2;

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

function updateDelta(){
  delta = Math.floor($("#slideshow").width()/($(".element").first().width()+10));
}

function hide(){
  updateDelta();
  updateBlocks();
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
}

$( window ).resize(function() {
  if ($("#description").is(":visible")){
    $("#slideshow").width($(window).width()-125);
    updateDelta();
    updateBlocks();
  }
});

function updateBlocks(){
  var n = Math.ceil(elements / delta);
  $("#indicators .indicator").remove();
    for (var i=0;i<n;i+=1){
      $("#indicators").append('<div class="indicator"></div>');
    }
  $("#indicators .indicator").each(function( index ){
    $( this ).on("click",function(){
      gotoBlock(index);
    });
  });
}
function gotoBlock(n){
  goto(n*delta);
}

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
  updateDelta();
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
  updateDelta();
  index -= delta;
  goto(index);
  if (index < 0){
    index = elements-1;
  }
}
