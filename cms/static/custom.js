
    $(document).ready(function() {
        $('.category-nav-element').each(function(i, el) {
            $(el).on('mouseover', function() {
                if (!$(el).find('.sub-cat-menu').hasClass('loaded')) {
                    $.post('category/nav-element-list.html', { _token: AIZ.data.csrf, id: $(el).data('id') }, function(data) {
                        $(el).find('.sub-cat-menu').addClass('loaded').html(data);
                    });
                }
            });
        });
        if ($('#lang-change').length > 0) {
            $('#lang-change .dropdown-menu a').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var locale = $this.data('flag');
                    $.post('language.html', { _token: AIZ.data.csrf, locale: locale }, function(data) {
                        location.reload();
                    });

                });
            });
        }

        if ($('#currency-change').length > 0) {
            $('#currency-change .dropdown-menu a').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var currency_code = $this.data('currency');
                    $.post('currency.html', { _token: AIZ.data.csrf, currency_code: currency_code }, function(data) {
                        location.reload();
                    });

                });
            });
        }
    });

    $('#search').on('keyup', function() {
        search();
    });

    $('#search').on('focus', function() {
        search();
    });

    function search() {
        var searchKey = $('#search').val();
        if (searchKey.length > 0) {
            $('body').addClass("typed-search-box-shown");

            $('.typed-search-box').removeClass('d-none');
            $('.search-preloader').removeClass('d-none');
            $.post('ajax-search.html', { _token: AIZ.data.csrf, search: searchKey }, function(data) {
                if (data == '0') {
                    // $('.typed-search-box').addClass('d-none');
                    $('#search-content').html(null);
                    $('.typed-search-box .search-nothing').removeClass('d-none').html('Sorry, nothing found for <strong>"' + searchKey + '"</strong>');
                    $('.search-preloader').addClass('d-none');

                } else {
                    $('.typed-search-box .search-nothing').addClass('d-none').html(null);
                    $('#search-content').html(data);
                    $('.search-preloader').addClass('d-none');
                }
            });
        } else {
            $('.typed-search-box').addClass('d-none');
            $('body').removeClass("typed-search-box-shown");
        }
    }

    function updateNavCart(view, count) {
        $('.cart-count').html(count);
        $('#cart_items').html(view);
    }

    function removeFromCart(key) {
        $.post('cart/removeFromCart.html', {
            _token: AIZ.data.csrf,
            id: key
        }, function(data) {
            updateNavCart(data.nav_cart_view, data.cart_count);
            $('#cart-summary').html(data.cart_view);
            AIZ.plugins.notify('success', "Item has been removed from cart");
            $('#cart_items_sidenav').html(parseInt($('#cart_items_sidenav').html()) - 1);
        });
    }

    function addToCompare(id) {
        $.post('compare/addToCompare.html', { _token: AIZ.data.csrf, id: id }, function(data) {
            $('#compare').html(data);
            AIZ.plugins.notify('success', "Item has been added to compare list");
            $('#compare_items_sidenav').html(parseInt($('#compare_items_sidenav').html()) + 1);
        });
    }

    function addToWishList(id) {
        AIZ.plugins.notify('warning', "Please login first");
    }

    function showAddToCartModal(id) {
        if (!$('#modal-size').hasClass('modal-lg')) {
            $('#modal-size').addClass('modal-lg');
        }
        $('#addToCart-modal-body').html(null);
        $('#addToCart').modal();
        $('.c-preloader').show();
        $.post('cart/show-cart-modal.html', { _token: AIZ.data.csrf, id: id }, function(data) {
            $('.c-preloader').hide();
            $('#addToCart-modal-body').html(data);
            AIZ.plugins.slickCarousel();
            AIZ.plugins.zoom();
            AIZ.extra.plusMinus();
            getVariantPrice();
        });
    }

    $('#option-choice-form input').on('change', function() {
        getVariantPrice();
    });

    function getVariantPrice() {
        if ($('#option-choice-form input[name=quantity]').val() > 0 && checkAddToCartValidity()) {
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/product/variant_price',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {

                    $('.product-gallery-thumb .carousel-box').each(function(i) {
                        if ($(this).data('variation') && data.variation == $(this).data('variation')) {
                            $('.product-gallery-thumb').slick('slickGoTo', i);
                        }
                    })

                    $('#option-choice-form #chosen_price_div').removeClass('d-none');
                    $('#option-choice-form #chosen_price_div #chosen_price').html(data.price);
                    $('#available-quantity').html(data.quantity);
                    $('.input-number').prop('max', data.max_limit);
                    if (parseInt(data.in_stock) == 0 && data.digital == 0) {
                        $('.buy-now').addClass('d-none');
                        $('.add-to-cart').addClass('d-none');
                        $('.out-of-stock').removeClass('d-none');
                    } else {
                        $('.buy-now').removeClass('d-none');
                        $('.add-to-cart').removeClass('d-none');
                        $('.out-of-stock').addClass('d-none');
                    }

                    AIZ.extra.plusMinus();
                }
            });
        }
    }

    function checkAddToCartValidity() {
        var names = {};
        $('#option-choice-form input:radio').each(function() { // find unique names
            names[$(this).attr('name')] = true;
        });
        var count = 0;
        $.each(names, function() { // then count them
            count++;
        });

        if ($('#option-choice-form input:radio:checked').length == count) {
            return true;
        }

        return false;
    }

    function addToCart() {

        if (checkAddToCartValidity()) {
            $('#addToCart').modal();
            $('.c-preloader').show();
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/cart/addtocart',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {

                    $('#addToCart-modal-body').html(null);
                    $('.c-preloader').hide();
                    $('#modal-size').removeClass('modal-lg');
                    $('#addToCart-modal-body').html(data.modal_view);
                    AIZ.extra.plusMinus();
                    AIZ.plugins.slickCarousel();
                    updateNavCart(data.nav_cart_view, data.cart_count);
                }
            });
        } else {
            AIZ.plugins.notify('warning', "Please choose all the options");
        }
    }

    function buyNow() {

        if (checkAddToCartValidity()) {
            $('#addToCart-modal-body').html(null);
            $('#addToCart').modal();
            $('.c-preloader').show();
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/cart/addtocart',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {
                    if (data.status == 1) {

                        $('#addToCart-modal-body').html(data.modal_view);
                        updateNavCart(data.nav_cart_view, data.cart_count);

                        window.location.replace("cart.html");
                    } else {
                        $('#addToCart-modal-body').html(null);
                        $('.c-preloader').hide();
                        $('#modal-size').removeClass('modal-lg');
                        $('#addToCart-modal-body').html(data.modal_view);
                    }
                }
            });
        } else {
            AIZ.plugins.notify('warning', "Please choose all the options");
        }
    }
    </script>
    <script>
    $(document).ready(function() {
        $.post('home/section/featured.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_featured').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/best_selling.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_best_selling').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/auction_products.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#auction_products').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/home_categories.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_home_categories').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/best_sellers.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_best_sellers').html(data);
            AIZ.plugins.slickCarousel();
        });
    });
    </script><script>
    </script>
    <script>
    $(document).ready(function() {
        $('.category-nav-element').each(function(i, el) {
            $(el).on('mouseover', function() {
                if (!$(el).find('.sub-cat-menu').hasClass('loaded')) {
                    $.post('category/nav-element-list.html', { _token: AIZ.data.csrf, id: $(el).data('id') }, function(data) {
                        $(el).find('.sub-cat-menu').addClass('loaded').html(data);
                    });
                }
            });
        });
        if ($('#lang-change').length > 0) {
            $('#lang-change .dropdown-menu a').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var locale = $this.data('flag');
                    $.post('language.html', { _token: AIZ.data.csrf, locale: locale }, function(data) {
                        location.reload();
                    });

                });
            });
        }

        if ($('#currency-change').length > 0) {
            $('#currency-change .dropdown-menu a').each(function() {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    var currency_code = $this.data('currency');
                    $.post('currency.html', { _token: AIZ.data.csrf, currency_code: currency_code }, function(data) {
                        location.reload();
                    });

                });
            });
        }
    });

    $('#search').on('keyup', function() {
        search();
    });

    $('#search').on('focus', function() {
        search();
    });

    function search() {
        var searchKey = $('#search').val();
        if (searchKey.length > 0) {
            $('body').addClass("typed-search-box-shown");

            $('.typed-search-box').removeClass('d-none');
            $('.search-preloader').removeClass('d-none');
            $.post('ajax-search.html', { _token: AIZ.data.csrf, search: searchKey }, function(data) {
                if (data == '0') {
                    // $('.typed-search-box').addClass('d-none');
                    $('#search-content').html(null);
                    $('.typed-search-box .search-nothing').removeClass('d-none').html('Sorry, nothing found for <strong>"' + searchKey + '"</strong>');
                    $('.search-preloader').addClass('d-none');

                } else {
                    $('.typed-search-box .search-nothing').addClass('d-none').html(null);
                    $('#search-content').html(data);
                    $('.search-preloader').addClass('d-none');
                }
            });
        } else {
            $('.typed-search-box').addClass('d-none');
            $('body').removeClass("typed-search-box-shown");
        }
    }

    function updateNavCart(view, count) {
        $('.cart-count').html(count);
        $('#cart_items').html(view);
    }

    function removeFromCart(key) {
        $.post('cart/removeFromCart.html', {
            _token: AIZ.data.csrf,
            id: key
        }, function(data) {
            updateNavCart(data.nav_cart_view, data.cart_count);
            $('#cart-summary').html(data.cart_view);
            AIZ.plugins.notify('success', "Item has been removed from cart");
            $('#cart_items_sidenav').html(parseInt($('#cart_items_sidenav').html()) - 1);
        });
    }

    function addToCompare(id) {
        $.post('compare/addToCompare.html', { _token: AIZ.data.csrf, id: id }, function(data) {
            $('#compare').html(data);
            AIZ.plugins.notify('success', "Item has been added to compare list");
            $('#compare_items_sidenav').html(parseInt($('#compare_items_sidenav').html()) + 1);
        });
    }

    function addToWishList(id) {
        AIZ.plugins.notify('warning', "Please login first");
    }

    function showAddToCartModal(id) {
        if (!$('#modal-size').hasClass('modal-lg')) {
            $('#modal-size').addClass('modal-lg');
        }
        $('#addToCart-modal-body').html(null);
        $('#addToCart').modal();
        $('.c-preloader').show();
        $.post('cart/show-cart-modal.html', { _token: AIZ.data.csrf, id: id }, function(data) {
            $('.c-preloader').hide();
            $('#addToCart-modal-body').html(data);
            AIZ.plugins.slickCarousel();
            AIZ.plugins.zoom();
            AIZ.extra.plusMinus();
            getVariantPrice();
        });
    }

    $('#option-choice-form input').on('change', function() {
        getVariantPrice();
    });

    function getVariantPrice() {
        if ($('#option-choice-form input[name=quantity]').val() > 0 && checkAddToCartValidity()) {
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/product/variant_price',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {

                    $('.product-gallery-thumb .carousel-box').each(function(i) {
                        if ($(this).data('variation') && data.variation == $(this).data('variation')) {
                            $('.product-gallery-thumb').slick('slickGoTo', i);
                        }
                    })

                    $('#option-choice-form #chosen_price_div').removeClass('d-none');
                    $('#option-choice-form #chosen_price_div #chosen_price').html(data.price);
                    $('#available-quantity').html(data.quantity);
                    $('.input-number').prop('max', data.max_limit);
                    if (parseInt(data.in_stock) == 0 && data.digital == 0) {
                        $('.buy-now').addClass('d-none');
                        $('.add-to-cart').addClass('d-none');
                        $('.out-of-stock').removeClass('d-none');
                    } else {
                        $('.buy-now').removeClass('d-none');
                        $('.add-to-cart').removeClass('d-none');
                        $('.out-of-stock').addClass('d-none');
                    }

                    AIZ.extra.plusMinus();
                }
            });
        }
    }

    function checkAddToCartValidity() {
        var names = {};
        $('#option-choice-form input:radio').each(function() { // find unique names
            names[$(this).attr('name')] = true;
        });
        var count = 0;
        $.each(names, function() { // then count them
            count++;
        });

        if ($('#option-choice-form input:radio:checked').length == count) {
            return true;
        }

        return false;
    }

    function addToCart() {

        if (checkAddToCartValidity()) {
            $('#addToCart').modal();
            $('.c-preloader').show();
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/cart/addtocart',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {

                    $('#addToCart-modal-body').html(null);
                    $('.c-preloader').hide();
                    $('#modal-size').removeClass('modal-lg');
                    $('#addToCart-modal-body').html(data.modal_view);
                    AIZ.extra.plusMinus();
                    AIZ.plugins.slickCarousel();
                    updateNavCart(data.nav_cart_view, data.cart_count);
                }
            });
        } else {
            AIZ.plugins.notify('warning', "Please choose all the options");
        }
    }

    function buyNow() {

        if (checkAddToCartValidity()) {
            $('#addToCart-modal-body').html(null);
            $('#addToCart').modal();
            $('.c-preloader').show();
            $.ajax({
                type: "POST",
                url: 'https://demo.activeitzone.com/ecommerce/cart/addtocart',
                data: $('#option-choice-form').serializeArray(),
                success: function(data) {
                    if (data.status == 1) {

                        $('#addToCart-modal-body').html(data.modal_view);
                        updateNavCart(data.nav_cart_view, data.cart_count);

                        window.location.replace("cart.html");
                    } else {
                        $('#addToCart-modal-body').html(null);
                        $('.c-preloader').hide();
                        $('#modal-size').removeClass('modal-lg');
                        $('#addToCart-modal-body').html(data.modal_view);
                    }
                }
            });
        } else {
            AIZ.plugins.notify('warning', "Please choose all the options");
        }
    }
    </script>
    <script>
    $(document).ready(function() {
        $.post('home/section/featured.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_featured').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/best_selling.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_best_selling').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/auction_products.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#auction_products').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/home_categories.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_home_categories').html(data);
            AIZ.plugins.slickCarousel();
        });
        $.post('home/section/best_sellers.html', { _token: '60emtilZGzBPDGf5483EVzvKtebycelWLbym4p8H' }, function(data) {
            $('#section_best_sellers').html(data);
            AIZ.plugins.slickCarousel();
        });
    });

    // making the CAPTCHA  a required field for form submission
        $(document).ready(function(){
            // alert('helloman');
            $("#reg-form").on("submit", function(evt)
            {
                var response = grecaptcha.getResponse();
                if(response.length == 0)
                {
                //reCaptcha not verified
                    alert("please verify you are humann!");
                    evt.preventDefault();
                    return false;
                }
                //captcha verified
                //do the rest of your validations here
                $("#reg-form").submit();
            });
        });

        var isPhoneShown = true,
            countryData = window.intlTelInputGlobals.getCountryData(),
            input = document.querySelector("#phone-code");

        for (var i = 0; i < countryData.length; i++) {
            var country = countryData[i];
            if(country.iso2 == 'bd'){
                country.dialCode = '88';
            }
        }

        var iti = intlTelInput(input, {
            separateDialCode: true,
            utilsScript: "https://demo.activeitzone.com/ecommerce/public/assets/js/intlTelutils.js?1590403638580",
            onlyCountries: ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","TP","EC","EG","SV","GQ","ER","EE","ET","XA","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","XU","GN","GW","GY","HT","HM","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","XJ","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","XM","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","MS","MA","MZ","MM","NA","NR","NP","AN","NL","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","SH","KN","LC","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SK","SI","XG","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VA","VE","VN","VG","VI","WF","EH","YE","YU","ZM","ZW"],
            customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                if(selectedCountryData.iso2 == 'bd'){
                    return "01xxxxxxxxx";
                }
                return selectedCountryPlaceholder;
            }
        });

        var country = iti.getSelectedCountryData();
        $('input[name=country_code]').val(country.dialCode);

        input.addEventListener("countrychange", function(e) {
            // var currentMask = e.currentTarget.placeholder;

            var country = iti.getSelectedCountryData();
            $('input[name=country_code]').val(country.dialCode);

        });

        function toggleEmailPhone(el){
            if(isPhoneShown){
                $('.phone-form-group').addClass('d-none');
                $('.email-form-group').removeClass('d-none');
                isPhoneShown = false;
                $(el).html('Use Phone Instead');
            }
            else{
                $('.phone-form-group').removeClass('d-none');
                $('.email-form-group').addClass('d-none');
                isPhoneShown = true;
                $(el).html('Use Email Instead');
            }
        }