window.onload = function () {

    var images = document.getElementsByClassName("image");
    var img = null;
    for (var i = 0; i < images.length; i++) {
        img = images[i];
        img.addEventListener('mouseover',
            function () {
                showImageButtons(img);
            }
        );
        img.addEventListener('mouseout',
            function () {
                hideImageButtons(img);
            }
        );

        img.addEventListener("touchstart",
            function () {
                showImageButtons(img);
            }
        );
        img.addEventListener('touchend',
            function () {
                hideImageButtons(img);
            }
        );

    }


    /**
     * Show the buttons on image by changing the CSS-class
     * @param node image dom-elment
     */
    function showImageButtons(node) {
        node.innerHTML = "test";
    }

    /**
     * Hide the buttons on image by changing the CSS-class
     * @param node image dom-element
     */
    function hideImageButtons(node) {

    }


};


