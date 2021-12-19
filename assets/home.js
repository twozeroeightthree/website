function addMobile(elements) {
  elements.each(function () {
    $(this).addClass("mobile");
  });
}
var isMobile = false;
if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )
) {
  isMobile = true;
  addMobile($(".description"));
}
var t;
var index = 0; // Current block position
var elements = $("#slideshow .element").length; // Total number of elements
var delta = Math.floor(
  ($(window).width() - 125) / ($(".element").first().width() + 10)
);
let r = 890; // Point where the responsive starts

function onstart() {
  // Config description hover
  $("#slideshow .element").each(function () {
    $(this)
      .on("mouseenter", function () {
        $(this).find(".description").css("visibility", "visible");
      })
      .on("mouseleave", function () {
        $(this).find(".description").css("visibility", "hidden");
      });
  });
  // Make arrow clickable
  $("#nextbar").on("click", function () {
    next();
  });

  /*
  If ( $( window ).width() > r ) {
    $( "#slideshow" ).css( "width", $( window ).width() - 505 + "px" );

    if ( !isMobile ) {
      updateBlocks();
    }
    t = 0;
    goto( 0 );
    t = 1000;
  }
  */
  responsive();
}

function responsive() {
  if ($(window).width() <= r) {
    $("#description").attr("style", "");
    $("#slideshow").attr("style", "");
    $("#slideshow .element .description").each(function () {
      $(this).css("height", $(".element img").first().height() / 2);
    });
    $("#slideshow .element img").each(function () {
      $(this).css("top", -($(".element img").first().height() / 2));
    });
    $("#slideshow .element").each(function () {
      $(this).css("height", $(".element img").first().height());
    });
  } else {
    // The size of #description must match the window size
    if ($("#description").is(":hidden")) {
      $("#slideshow").width($(window).width() - 125);
    } else {
      $("#slideshow").css("width", $(window).width() - 505 + "px");
    }
    update();
  }
}

$(window).resize(function () {
  responsive();
});

window.setInterval(function () {
  responsive();
}, 50);

function updateDelta() {
  // Updates the size of blocks
  delta = Math.floor(
    ($(window).width() - 125) / ($(".element").first().width() + 10)
  );
}
function mobileIndex() {
  return (
    Math.floor(
      $("#slideshow").scrollLeft() / ($(".element").first().width() + 10)
    ) + 1
  );
}
function updateBlocks() {
  // Updates the amount of indicators and their click actions
  var n = Math.ceil(elements / delta);
  $("#indicators .indicator").remove();
  for (var i = 0; i < n; i += 1) {
    $("#indicators").append('<div class="indicator"></div>');
  }
  $("#indicators .indicator").each(function (i) {
    $(this).on("click", function () {
      if ($("#description").is(":hidden")) {
        gotoBlock(i);
        activeBlock(i);
      } else {
        hide();
        updateBlocks();
        gotoBlock(i);
        activeBlock(i);
      }
    });
  });
  activeBlock();
}
function activeBlock(n = -1) {
  // Highlights the current indicator
  $("#indicators .indicator").removeClass("active");
  if (n >= 0) {
    $("#indicators .indicator").eq(Math.floor(n)).addClass("active");
  } else {
    $("#indicators .indicator")
      .eq(Math.floor(index / delta))
      .addClass("active");
  }
}
function update() {
  // Updates both delta and blocks (only if desktop)
  updateDelta();
  if (!isMobile) {
    updateBlocks();
  }
}
function hide() {
  // First action of arrow or block press: hide the description
  $("#description").fadeOut(t);
  $("#slideshow").animate(
    {
      left: "100px",
      width: $(window).width() - 125,
    },
    t
  );
  if (isMobile) {
    $("#slideshow").addClass("mobile");
  }
}
function goto(n) {
  // Here is where the scroll happens
  if (n > elements - 1) {
    n = 0;
  } else if (n < 0) {
    n = elements - 1;
  }
  var pos = $("#slideshow .element").eq(n).position().left;
  $("#slideshow").animate(
    {
      scrollLeft: $("#slideshow").scrollLeft() + pos,
    },
    t
  );
}
function gotoBlock(n) {
  // Goes to nth block of delta images
  update();
  goto(n * delta);
  index = n * delta;
}
function next() {
  // Function toggled on arrow press
  if ($("#description").is(":visible")) {
    hide();
    update();
  } else if (!isMobile) {
    updateDelta();
    index += delta;
    goto(index);
  } else {
    goto(mobileIndex());
  }
  if (index > elements - 1) {
    index = 0;
  }
  activeBlock();
}
function previous() {
  updateDelta();
  index -= delta;
  goto(index);
  if (index < 0) {
    index = elements - 1;
  }
  activeBlock();
}

onstart();
