var FT = {

    init: function() {
        FT.animateScroll();
        FT.activateMobileNavigation();

        var st = $(window).scrollTop();
        if(st > 200) {
            $("body").addClass("scrolled");
        } else {
            $("body").removeClass("scrolled");
        }

        $(window).resize(function() {
            FT.activateMobileNavigation();
        });

        FT.normalizePartnerLogos();
        
        FT.renderSchedule();

        $("html").removeClass("loading");
    },

    animateScroll: function() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                if (target.length) {
                    var d = FT.isPortable()?102:30;
                    $('html, body').animate({
                        scrollTop: (target.offset().top - d)
                    }, 300);

                    history.pushState(null, '', target.selector);
                    return false;
                }
            }
        });
    },
 
    activateMobileNavigation: function() {
        if (FT.isPortable()) {

            if (!$(".main-navigation ul.dont-miss").length) {
                $("footer ul.dont-miss").clone().appendTo(".nav-items");
            }

            if (!$(".main-navigation ul.social-media").length) {
                $("footer ul.social-media").clone().appendTo(".nav-items");
            }

            if (!$(".page--content > header .content p.featured").length) {
                $("body.home p.featured").detach().appendTo(".page--content > header .content");
            }

        } else {

            $(".main-navigation ul.dont-miss, .main-navigation ul.social-media").remove();
            $("body.home p.featured").detach().prependTo("#intro");

        }

        $(window).scroll(function (event) {
            var st = $(this).scrollTop();
            if(st > 200) {
                $("body").addClass("scrolled");
            } else {
                $("body").removeClass("scrolled");
            }
        });

        return;
    },

    normalizePartnerLogos: function() {
        var logos = [];
        var vectors = [];
        
        $(".partner-group").each(function(index) {
            logos.push($(this).find(".partner svg"));
            vectors.push([]);
        });
        
        for (var groupIndex = 0; groupIndex < logos.length; groupIndex++) {

            for (var i = 0; i < logos[groupIndex].length; i++) {
                vectors[groupIndex].push({
                    logo: $(logos[groupIndex][i]),
                    width: $(logos[groupIndex][i]).width(),
                    height: $(logos[groupIndex][i]).height(),
                    area: $(logos[groupIndex][i]).width() * $(logos[groupIndex][i]).height()
                });
            }
            
            vectors[groupIndex].sort(function(a, b) {
                if (a.area > b.area) {
                    return 1;
                }
                if (a.area < b.area) {
                    return -1;
                }
                return 0;
            });        

            for(var i = 1; i < vectors[groupIndex].length; i++) {
                var newWidth = ( vectors[groupIndex][i].width / Math.sqrt( ( vectors[groupIndex][i].area ) / (vectors[groupIndex][0].area) ) ) /
                        (
                            ( vectors[groupIndex][0].width * vectors[groupIndex][i].width + vectors[groupIndex][0].height * vectors[groupIndex][i].height ) /
                            (1.2 *
                                Math.sqrt(vectors[groupIndex][0].width * vectors[groupIndex][0].width + vectors[groupIndex][0].height * vectors[groupIndex][0].height) *
                                Math.sqrt(vectors[groupIndex][i].width * vectors[groupIndex][i].width + vectors[groupIndex][i].height * vectors[groupIndex][i].height)
                            )
                        );

                newWidth = Math.ceil(newWidth / vectors[groupIndex][i].logo.width() * 100) + "%";
                vectors[groupIndex][i].logo.width(newWidth);
            }
        }
    },

    renderSchedule: function() {
        $("body.schedule .schedule h3:not(.host)").bind("click", function() {
            $(this).next().toggle(200);
        });
    },

    isPortable: function() {
        return window.matchMedia("(max-width: 1023px)").matches;
    }
};

$(document).ready(function() {
    FT.init();
});
