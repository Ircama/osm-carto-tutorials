---
layout: js-compress
---

/*
 *
 * ┌┬┐┌─┐┌─┐   ┬┌─┐┬┌─┬ ┬┬  ┬
 *  │││ ││  ── │├┤ ├┴┐└┬┘│  │
 * ─┴┘└─┘└─┘  └┘└─┘┴ ┴ ┴ ┴─┘┴─┘
 *
 * Various functions used in this site
 * (c) @ircama, 2016
 */

(function() {

/*---------------------------------------------------------------------------*/

  // Add Google Search to the sidebar

var cx = '{{ site.google_search }}';
var gcse = document.createElement('script');
gcse.type = 'text/javascript';
gcse.async = true;
gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(gcse, s);

/*---------------------------------------------------------------------------*/

  // Manage Markdown drawings. Assign a specific class to the arrows (one character
  // with special code) and a different class to other content

$(function() {
  var elem = $('table.drawing td');
  $.each(elem, function() {
    if ( ( ( $(this).text().length < 2 ) && ( $(this).text().charCodeAt(0) > 150 ) ) ||
        ( ( $(this).text().length < 2 ) && ( $(this).text().charCodeAt(0) >255 ) ) )
      $(this).addClass("darrow")
    else
      $(this).addClass("dcontent");
  });
});

/*---------------------------------------------------------------------------*/

  // Customize AnchorJS (http://bryanbraun.github.io/anchorjs)

anchors.options = {
  placement: 'left',
};
anchors.add();
anchors.remove('.masthead-title');
anchors.remove('.sticky');
anchors.remove('.page-title');
anchors.remove('.post-title');

/*---------------------------------------------------------------------------*/

  // Add target="_blank" to all external links

var links = document.links;
for (var i = 0; i < links.length; i++) {
    if (!links[i].target) {
        if (
            links[i].hostname !== window.location.hostname || 
            /\.(?!html?)([a-z]{0,3}|[a-zt]{0,4})$/.test(links[i].pathname)
        ) {
            links[i].target = '_blank';
        } 
    }
}

/*---------------------------------------------------------------------------*/

  // Create Table of Content (invoking Toc.init and then scrollspy)

$(function() {
  var navSelector = '#toc';
  var $myNav = $(navSelector);
  Toc.init($myNav, { headings: 'h1,h2,h3,h4,h5,h6' } );
  $('body').scrollspy({
    target: navSelector,
    offset: 220
  });
});

/*---------------------------------------------------------------------------*/

/* Dynamic management of the Table of Content */

$(window).on('load resize scroll', function () {
/* Auto-move the table of content scroll div while scrolling the main window */
  var scrollPos = $("div.sticky").offset().top / $(document.body).prop('scrollHeight'); // scrolling of the main window (between 0 and 1)
  switch(true) { // this is a discrete function to calculate the most appropriate scroll percentage of the ToC div
    case (scrollPos < 0.2): scrollPos=0; break;
    case (scrollPos < 0.3): scrollPos=scrollPos * 1.2; break;
    case (scrollPos > 0.3): scrollPos=scrollPos * 1.4; break;
    case (scrollPos > 0.6): scrollPos=scrollPos * 1.5; break;
    case (scrollPos > 0.75): scrollPos=1; break;
  }
  $("div.sticky").scrollTop(scrollPos * ($("div.sticky").prop('scrollHeight') - $("div.sticky").innerHeight()));
/* Dynamically set bottom position of div.sticky only when toc overflows to avoid conflicts between box-shadow and scrollbar */
if ($(window).height() < $('nav[data-toggle="toc"]').height() + $("div.sticky").position().top)
  $("div.sticky").css("bottom","0")
else
  $("div.sticky").css("bottom","unset");
})

function checkForOverlap(el1, el2) {

    var bounds1 = el1.getBoundingClientRect();
    var bounds2 = el2.getBoundingClientRect();

    var firstIstLeftmost = (bounds1.left <= bounds2.left);
    var leftest = firstIstLeftmost ? bounds1 : bounds2;
    var rightest = firstIstLeftmost ? bounds2 : bounds1;

    //change to >= if border overlap should count
    if(leftest.right > rightest.left) {
            //
        var firstIsTopmost = (bounds1.top <= bounds2.top);
        var topest = firstIsTopmost ? bounds1 : bounds2;
        var bottomest = firstIsTopmost ? bounds2 : bounds1;

        //change to >= if border overlap should count
        return topest.bottom > bottomest.top;
    }
    else return false;

}

/* Automatically close the the Table of Content on touchscreen moves with two fingers */
document.addEventListener('touchmove', function(e) {
  if (e.touches.length == 2) { // two fingers
    var dist = Math.abs((e.touches[0].clientX-e.touches[1].clientX) * (e.touches[0].clientY-e.touches[1].clientY));
    document.title = checkForOverlap($("div.sticky"), $("div.container"));
/*
    if (dist <5000)
      {
        $(".toc-title").css("display","flex");
        $("div.sticky").css("display","block");
      }
    else
      {
        $(".toc-title").css("display","none");
        $("div.sticky").css("display","none");
      }
*/
  }
}, false);


/*----------------------------------------------------------------------------------------------*/

/* Functions to dynamically manage the sidebar */

  // Add fullscreen attribute when the sidebar is not visible
function checkFullScreen() {
  $("div.wrap").offset().left > 0 ? $("div.wrap").removeAttr("fullscreen") : $("div.wrap").attr("fullscreen", "yes");
};

  // Delay the call to checkFullScreen at the end of the sidebar transition
function delayCheckFullScreen() {
  setTimeout(checkFullScreen, 100);
  setTimeout(checkFullScreen, 300);
  setTimeout(checkFullScreen, 600);
  setTimeout(checkFullScreen, 1200);
  setTimeout(checkFullScreen, 2000);
};
delayCheckFullScreen();

(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');
  var sticky = document.querySelector('.sticky');

  document.addEventListener('touchstart', function(e) { /* Automatically close the sidebar when tapping the page content */

    delayCheckFullScreen();
    var target = e.target;
    if((!checkbox.checked) ||
        sidebar.contains(target) ||
        target === toggle)
      return;

    checkbox.checked = false;
    sticky.visible = false;
  }, false);

  document.addEventListener('click', function(e) { /* Automatically close the sidebar when clicking on the page content */

    delayCheckFullScreen();
    var target = e.target;

    if(!checkbox.checked ||
        sidebar.contains(target) ||
        (target === checkbox || target === toggle))
      return;

    checkbox.checked = false;
    sticky.visible = false;
  }, false);
})(document);

/*----------------------------------------------------------------------------------------------*/

})();
