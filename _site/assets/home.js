var t;
var index = 0;
var elements = $("#slideshow .element").length;
var delta = Math.floor(($(window).width()-125)/($(".element").first().width()+10));

function onstart(){
  $("#slideshow .element").each(function(){
    $(this).on("mouseenter", function(){
      $(this).find(".description").css("visibility","visible");
    }).on("mouseleave", function(){
      $(this).find(".description").css("visibility","hidden");
    });
    $("#slideshow").append($(this).clone());
  });
  $("#slideshow").css("width", $(window).width()-505+"px");
  $("#nextbar").on("click",function(){
    next();
  });
  updateBlocks();
  t = 0;
  goto(0);
  t = 1000;
}

$( window ).resize(function() {
  if ($("#description").is(":hidden")){
    $("#slideshow").width($(window).width()-125);
  }
  else{
    $("#slideshow").css("width", $(window).width()-505+"px");
  }
  update();
});


function updateDelta(){
  delta = Math.floor(($(window).width()-125)/($(".element").first().width()+10));
}
function updateBlocks(){
  var n = Math.ceil(elements / delta);
  $("#indicators .indicator").remove();
    for (var i=0;i<n;i+=1){
      $("#indicators").append('<div class="indicator"></div>');
    }
    $("#indicators .indicator").each(function( i ){
      $( this ).on("click",function(){
        if($("#description").is(":hidden")){
          gotoBlock(i);
          activeBlock(i);
        }
        else{
          hide();
          updateBlocks();
          gotoBlock(i);
          activeBlock(i);
        }
      });
    });
    activeBlock();
}
function activeBlock(n=-1){
  $("#indicators .indicator").removeClass("active");
  if (n>=0){
    $("#indicators .indicator").eq(Math.floor(n)).addClass("active");
  }
  else{
    $("#indicators .indicator").eq(Math.floor(index/delta)).addClass("active");
  }
}
function update(){
  updateDelta();
  updateBlocks();
}

function hide(){
  $("#description").fadeOut(t);
  $("#slideshow").animate({
    left:"100px",
    width:$(window).width()-125
  },t);
  return "ok";
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
    if(hide()=="ok"){
      update();
    }
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
