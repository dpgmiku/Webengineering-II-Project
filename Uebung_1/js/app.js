document.addEventListener("DOMContentLoaded", function (event) {
    var imgClassList = document.getElementsByClassName("imgControl");
    /**
     * Adds eventlisteners to every image-control in the dom
     */
    for (var i = 0; i < imgClassList.length; i++) {
        imgClassList[i].addEventListener('mouseenter', function (event) {
            showButtons(event.target.firstElementChild.nextElementSibling);
        });
        imgClassList[i].addEventListener('mouseleave', function (event) {
            hideButtons(event.target.firstElementChild.nextElementSibling);
        });
        imgClassList[i].addEventListener('touchstart', function (event) {
            event.stopPropagation();
            touchShow(event.target);
        });
    }
    var likeButtonClassList = document.getElementsByClassName("likeButton");
    /**
     * Adds eventlisteners to every likeButton in the dom
     */
    for (var i = 0; i < likeButtonClassList.length; i++) {
        likeButtonClassList[i].addEventListener('click', function (event) {
            var btn = event.target;
            if (btn.style.transform == "" || btn.style.transform == "rotate(-180deg)") {
                btn.style.transform = "rotate(0deg)";
            }
            else {
                btn.style.transform = "rotate(-180deg)";
            }
        });
    }

    var detailsButtonList = document.getElementsByClassName("detailsButton");
    /**
     * adds eventlisteners to every detailsButton in the dom
     */
    for (var i = 0; i < detailsButtonList.length; i++) {
        detailsButtonList[i].addEventListener('click', function (event) {
            var btn = event.target;
            var img = btn.previousElementSibling;
            var imgList = document.getElementsByClassName('img-large');
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].classList.remove("img-large");
                imgList[i].classList.toggle("img");
            }
            img.classList.toggle("img-large");
        });
    }

    // Forces an overlay image, if opened, to be closed if a click happens somewhere else on the screen
    document.body.addEventListener('click',
        function (event) {
            if (event.target.classList[0] != 'detailsButton') {
                var imgList = document.getElementsByClassName('img-large');
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i].classList.remove("img-large");
                    imgList[i].classList.toggle("img");
                }
            }
        });

    /**
     *  Hides the buttons on the imageControl
     * @param firstButtonNode   expects the first button-node of an image-container
     */
    function hideButtons(firstButtonNode) {
        var secondButtonNode = firstButtonNode.nextElementSibling;
        firstButtonNode.style.visibility = "hidden";
        firstButtonNode.style.opacity = 0;
        secondButtonNode.style.visibility = "hidden";
        secondButtonNode.style.opacity = 0;
    }

    /**
     *  shows the buttons on the imageControl
     * @param firstButtonNode   expects the first button-node of an image-container
     */
    function showButtons(firstButtonNode) {
        var secondButtonNode = firstButtonNode.nextElementSibling;
        firstButtonNode.style.visibility = "visible";
        firstButtonNode.style.opacity = 1;
        secondButtonNode.style.visibility = "visible";
        secondButtonNode.style.opacity = 1;
    }

    /**
     *
     * @param imgNode   expects the image Node of the image-container
     */
    function touchShow(imgNode) {
        var btn1 = imgNode.nextElementSibling;
        if (btn1.style.visibility == "") {
            showButtons(btn1);
        }
        else if (btn1.style.visibility == "visible") {
            hideButtons(btn1);
        }
        else {
            showButtons(btn1);
        }


    }


});


