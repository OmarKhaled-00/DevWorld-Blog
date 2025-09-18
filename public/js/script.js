$(document).ready(function () {
  $(".home").addClass("active-button");
  $(".btn-notify").on("click", function () {
    $(".btn-notify-menu").show();
  });
  $(".btn-notify").on("dblclick", function () {
    $(".btn-notify-menu").hide();
  });

  // Hide when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".btn-notify, .btn-notify-menu").length) {
      $(".btn-notify-menu").hide();
    }
  });
  $(".btn-notify").hover(
    function () {
      $(".btn-notify").addClass("button-style2-hover");
    },
    function () {
      $(".btn-notify").removeClass("button-style2-hover");
    }
  ),
    $(".btn-profile").hover(
      function () {
        $(".btn-profile").addClass("button-style2-hover");
      },
      function () {
        $(".btn-profile").removeClass("button-style2-hover");
      }
    ),
    $(".btn-profile").on("click", function () {
      $(".profile-items-menu").show();
    });
  $(".btn-profile").on("dblclick", function () {
    $(".profile-items-menu").hide();
  });

  // Hide when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".btn-profile, .profile-items-menu").length) {
      $(".profile-items-menu").hide();
    }
  });
  $("#main-logoa").hover(
    function () {
      $("#main-logo").addClass("gradientSecondary-text");
    },
    function () {
      $("#main-logo").removeClass("gradientSecondary-text");
    }
  ),
    $("#main-logoa").hover(
      function () {
        $("#main-logo-icon").addClass("rotateY360");
      },
      function () {
        $("#main-logo-icon").removeClass("rotateY360");
      }
    ),
    $(".left-header-anchorButton").hover(
      function () {
        $(this).find("button").addClass("buttonDefault-hover");
      },
      function () {
        $(this).find("button").removeClass("buttonDefault-hover");
      }
    ),
    $(".searchEngine").hover(
      function () {
        $(".searchEngine").addClass("searchForm-hover");
      },
      function () {
        $(".searchEngine").removeClass("searchForm-hover");
      }
    );
  $("#sidebar-toggleButton").hover(
    function () {
      $("#sidebar-toggleButton").addClass("button-style2-hover");
    },
    function () {
      $("#sidebar-toggleButton").removeClass("button-style2-hover");
    }
  );
  $(".trend-title").hover(
    function () {
      $(".trend-title").addClass("gradientPrimary-text");
    },
    function () {
      $(".trend-title").removeClass("gradientPrimary-text");
    }
  );
  let lastScrollTop = 0;

  $(window).on("scroll", function () {
    let scrollTop = $(this).scrollTop();
    const sidebar = $("#side");
    const sidebarHeight = sidebar.outerHeight();
    const docHeight = $(document).height();
    const winHeight = $(window).height();
    console.log("scrollTop: " + scrollTop);
    console.log("sidebarHeight: " + sidebarHeight);
    console.log("docHeight: " + docHeight);
    console.log("winHeight: " + winHeight);

    let maxOffset = docHeight - sidebarHeight;
    console.log("maxOffset: " + maxOffset);

    // move slower (e.g., half the scroll speed)
    let offset = Math.min(scrollTop * 0.5, maxOffset);
    console.log("offset: " + offset);

    // apply to top directly
    sidebar.css("top", offset + "px");

    //Sidebar Scroll effect

    // Header/footer hide logic
    if (scrollTop > lastScrollTop) {
      $(".header-container").addClass("headerButtons-hideOnScroll");
      $(".mobile-footer").addClass("footerButtons-hideOnScroll");
    } else {
      $(".header-container").removeClass("headerButtons-hideOnScroll");
      $(".mobile-footer").removeClass("footerButtons-hideOnScroll");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  let lastSidebarScroll = 0;
  const $sidebarscroll = $(".side-col"); // your sidebar

  $sidebarscroll.on("scroll", function () {
    let scrollTop = $(this).scrollTop();

    if (scrollTop > lastSidebarScroll) {
      // scrolling down
      $(".header-container").addClass("headerButtons-hideOnScroll");
      $(".mobile-footer").addClass("footerButtons-hideOnScroll");
    } else {
      // scrolling up
      $(".header-container").removeClass("headerButtons-hideOnScroll");
      $(".mobile-footer").removeClass("footerButtons-hideOnScroll");
    }

    lastSidebarScroll = scrollTop;
  });

  const $sidebar = $(".side-col"); // sidebar container
  const $toggleBtn = $("#sidebar-toggleButton"); // toggle button

  $toggleBtn.on("click", function () {
    // Toggle sidebar visibility
    $sidebar.toggleClass("sidebar-active");

    // Change icon direction
    const $icon = $(this).find("i");
    if ($sidebar.hasClass("sidebar-active")) {
      $icon.removeClass("fa-chevron-left").addClass("fa-chevron-right");
    } else {
      $icon.removeClass("fa-chevron-right").addClass("fa-chevron-left");
    }
  });
});

// --- SEARCH ENGINE ---
$("#searchEngineId").on("keyup", function () {
  let filter = $(this).val().toLowerCase();
  $(".post-box").each(function () {
    let $title = $(this).find(".headTitle");
    let $content = $(this).find(".subTitle");
    let titleText = $title.text();
    let contentText = $content.text();

    if (
      titleText.toLowerCase().includes(filter) ||
      contentText.toLowerCase().includes(filter)
    ) {
      $(this).show();
      $title.html(titleText);
      if (filter) {
        let regex = new RegExp("(" + filter + ")", "gi");
        let newTitle = titleText.replace(
          regex,
          "<span class='highlightTx-inSearch'>$1</span>"
        );
        $title.html(newTitle);
      }
    } else {
      $(this).hide();
    }
  });
});

// --- TAG BUTTONS FILTER ---
$(".tags-row").on("click", function () {
  let tagText = $(this).text().replace("#", "").trim().toLowerCase();
  $(".post-box").each(function () {
    let titleText = $(this).find(".headTitle").text().toLowerCase();
    let contentText = $(this).find(".subTitle").text().toLowerCase();
    if (titleText.includes(tagText) || contentText.includes(tagText)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});

// function moveSidebar() {
//   const $sidebar = $("#sidebar-source").children("aside").first(); // sidebar from sidebar.ejs

//   if ($sidebar.length === 0) return; // no sidebar to move

//   if ($(window).width() <= 768) {
//     // Mobile screen
//     $("#desktop-wrapper").empty(); // clear desktop wrapper
//     $("#mobile-wrapper").append($sidebar);
//   } else {
//     // Desktop screen
//     $("#mobile-wrapper").empty(); // clear mobile wrapper
//     $("#desktop-wrapper").append($sidebar);
//   }
// }

// // Run on page load
// moveSidebar();

// // Run on resize
// $(window).on("resize", moveSidebar);
