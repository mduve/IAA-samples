$(document).ready(function () {

    var searchInput = $(".search .search-field"),
        searchForm = $('form.search'),
        mousedownHappened = false,
        stockNu = $("#t-stock .group label[data-type='number']").append(),
        stockSt = $("#t-stock .group label[data-type='string']").append(),
        buyerNu = $("#t-buyer .group label[data-type='number']").append(),
        buyerSt = $("#t-buyer .group label[data-type='string']").append(),
        providerNu = $("#t-provider .group label[data-type='number']").append(),
        providerSt = $("#t-provider .group label[data-type='string']").append(),
        storageNu = $("#t-storage .group label[data-type='number']").append(),
        storageSt = $("#t-storage .group label[data-type='string']").append();

    Mousetrap.bind('ctrl+s', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        searchInput.focus();
    });

    var activeView = function (selector) {
        $(".search-types").find(".active-view").removeClass("active-view");
        if (selector === "#recent") {
            $(".search-types").find(selector).addClass("active-view");
        } else if (selector === "#simple") {
            $(".search-types").find(selector).addClass("active-view");
        }
    }

    var defaultActiveItem = function () {
        if ($(".active-tab .group label").hasClass("default")) {
            $(".active-tab .default").addClass("active-item");
        } else {
            $(".active-tab .group label").first().addClass("active-item");
        }
    }

    var initSimple = function () {
        if ($("#recent").hasClass("active-view")) {
        } else if ($("#simple").hasClass("active-view")) {
            if ($("#simple > div").hasClass("active-tab")) {
            } else {
                $("#simple > div").first().addClass("active-tab");
            }
        }
    }

    $("a.advance").click(function () {
        $("#advancedSearch").modal('show');
    })

    var moveDown = function (elem, type) {
        if ($(".active-view " + elem).hasClass('active-item') === true) {
            $(".active-view " + elem + ".active-item").nextAll(".group " + elem).eq(0).addClass("active-item");
            $(".active-view " + elem + ".active-item").prevAll(".group " + elem).removeClass("active-item");

            // test
            var container = $(".active-view .group");
            var element = $(".active-view .active-item");

            if (container.height() < element.position().top) {
                container.scrollTop((element.prevAll().length * (element.height() + 1)) - container.height() + element.height() + 1);
            }

        } else if ($(elem).is("a")) {
            if ($("#recent .group a").hasClass("active-item") === false) {
                $("#recent .group a").first().addClass("active-item");
            }
        }
    }
    var moveUp = function (elem, type) {
        if ($(".active-view " + elem).hasClass('active-item') === true) {
            $(".active-view " + elem + ".active-item").prevAll(".group " + elem).eq(0).addClass("active-item");
            $(".active-view " + elem + ".active-item").nextAll(".group " + elem).removeClass("active-item");

            var container = $(".active-view .group");
            var element = $(".active-view .active-item");

            if (container.height() > element.position().top) {
                container.scrollTop((element.prevAll().length * (element.height() + 1)) - container.height() + element.height() + 1);
            }

        }
    }

    var moveRight = function (type) {
        $(".active-tab").find(".active-item").removeClass("active-item").children().prop('checked', false);
        $(".active-tab").nextAll("div").eq(0).addClass("active-tab");
        $(".active-tab").prevAll("div").removeClass("active-tab");
        defaultActiveItem();
    }

    var moveLeft = function (type) {
        $(".active-tab").find(".active-item").removeClass("active-item").children().prop('checked', false);
        $(".active-tab").prevAll("div").eq(0).addClass("active-tab");
        $(".active-tab").nextAll("div").removeClass("active-tab");
        defaultActiveItem();
    }



    var searchVal = function () {

        var mousedownHappened = false;

        $('#simple .group label').mousedown(function () {
            $(this).siblings().removeClass("active-item");
            $(this).addClass("active-item");
            $(this).siblings().children().prop('checked', false);
        });

        if ($.isNumeric(searchInput.val())) {
            activeView("#simple");
            Mousetrap.bind('shift+down', function (e) { moveDown("label", "number"); });
            Mousetrap.bind('shift+up', function (e) {moveUp("label", "number");});
            Mousetrap.bind('shift+right', function (e) {moveRight("number");});
            Mousetrap.bind('shift+left', function (e) {moveLeft("number");});
            $("#simple [data-type='string']").remove();
            $("#t-stock .group").append(stockNu);
            $("#t-buyer .group").append(buyerNu);
            $("#t-provider .group").append(providerNu);
            $("#t-storage .group").append(storageNu);
        } else if (searchInput.val() === '') {
            activeView("#recent");
            Mousetrap.bind('shift+down', function (e) {moveDown("a", "string");});
            Mousetrap.bind('shift+up', function (e) {moveUp("a", "string");});
        } else {
            activeView("#simple");
            Mousetrap.bind('shift+down', function (e) {moveDown("label", "string");});
            Mousetrap.bind('shift+up', function (e) {moveUp("label", "string");});
            Mousetrap.bind('shift+right', function (e) {moveRight("string");});
            Mousetrap.bind('shift+left', function (e) {moveLeft("string");});
            $("#simple [data-type='number']").remove();
            $("#t-stock .group").append(stockSt);
            $("#t-buyer .group").append(buyerSt);
            $("#t-provider .group").append(providerSt);
            $("#t-storage .group").append(storageSt);
        }
    }

    $('#simple .tab-control').click(function () {
        $('#simple > div').removeClass("active-tab");
        $(this).parent().addClass("active-tab");
        $('.search-types .active-item').removeClass("active-item");
        defaultActiveItem();
    });

    $(searchInput).on('focus', function () {
        searchVal();
        Mousetrap.unbind('ctrl+a');
    });

    $(searchInput).on('input', function () {
        $(".search-types").find(".active-item").removeClass("active-item");
        searchVal();
        initSimple();
        Mousetrap.unbind('ctrl+a');
        defaultActiveItem();
    });

    searchInput.keyup(function () {
        checkChildRadio();
        maxChar();
    });


    //prevent blur
    $(searchInput).blur(function () {
        if (mousedownHappened) {
            mousedownHappened = false;
            var inputValue = $(searchInput).value;
            if (inputValue !== '') {
                activeView("#simple");
            } else {
                activeView("#recent");
            };
            $(searchInput).focus();
        } else {
            $(".search-types").find(".active-view").removeClass("active-view");
            $(".search-types").find(".active-tab").removeClass("active-tab");
            $(".search-types").find(".active-item").removeClass("active-item");
            Mousetrap.bind('ctrl+a', function (e) {event.preventDefault();$('#advancedSearch').modal('show');});
            searchInput.val('');
            maxChar();
        }
    });


    // DO NOT DELETE - APPROVED FUNCTIONS BELOW

    $('.search-types *').mousedown(function () {
        mousedownHappened = true;
    });

    var maxChar = function () {
        if ($("form.search input").val().length >= 100) {
            $(searchInput).addClass("error");
            $(".error-message").show();
        } else {
            $(searchInput).removeClass("error");
            $(".error-message").hide();
        }
    }

    var checkChildRadio = function () {
        $("label.active-item input").prop('checked', true);
        $("label.active-item").siblings().children().prop('checked', false);
    }


    //click enter to submit
    $(searchForm).on('submit', function (e) {
        e.preventDefault();
        //if (activeView("#simple") === true) {
        //    alert('simple view');
        //    //var inputItem = $(searchInput).value;
        //    //var filterItem = $("#simple .active-tab").find(".active-item input").val();
        //    //alert(inputItem + "+" + filterItem);
        //}

    });
    //click button to submit
    $(".search-submit").on('click', function (e) {
        e.preventDefault();
        //if (activeView("#simple") === true) {
        //    alert('simple view');
        //}
        window.location = '/Home/SearchResults';
        return false;
    });



    //responsive
    //var windowRealEstate = $(window).height() - ($("header").height() + $("footer").height() + 75);
    //if ($(window).width() < 768) {
    //    $(".search-types").css({ "max-height": windowRealEstate + 'px' });
    //}

    //$('.search-trigger').on('click', function () {
    //    //alert('test');
    //    if ($('.k-mobile body').hasClass("search-active")) {
    //        $('.k-mobile body').removeClass('search-active');
    //        alert('test');
    //    } else {
    //        $('.k-mobile body').addClass('search-active');
    //        alert('test has class');
    //    }
    //});

});