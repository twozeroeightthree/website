var t = 1000;
var index = 0;
var elements = $("#slideshow .element").length;
var delta = 2;

function onstart(){
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
}

$( window ).resize(function() {
  if ($("#description").is(":hidden")){
    $("#slideshow").width($(window).width()-125);
    update();
  }
  else{
    $("#slideshow").css("width", $(window).width()-505+"px");
  }
});


function updateDelta(){
  delta = Math.floor($("#slideshow").width()/($(".element").first().width()+10));
}
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
    activeBlock();
}
function activeBlock(){
  $("#indicators .indicator").removeClass("active");
  $("#indicators .indicator").eq(Math.floor(index/delta)).addClass("active");
}
function update(){
  updateDelta();
  updateBlocks();
  activeBlock();
}

function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
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
function gotoBlock(n){
  update();
  goto(n*delta);
}

function next(){
  if ($("#description").is(":visible")){
    hide();
    update();
  }
  else {
    updateDelta();
    index += delta;
    goto(index);
  }
  if (index > elements-1){
    index = 0;
  }
  activeBlock();
}
function previous(){
  updateDelta();
  index -= delta;
  goto(index);
  if (index < 0){
    index = elements-1;
  }
  activeBlock();
}
onstart();
