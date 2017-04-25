'use:strict';
document.addEventListener("DOMContentLoaded", function () {
    // initializes EventListeners for the picture-containers
    var picsList = document.getElementsByClassName("picsContainer");
    for (var i = 0; i < picsList.length; i++) {
        picsList[i].addEventListener('mouseenter', onEnter, false);
        picsList[i].addEventListener('mouseleave', onLeave, false);
    }

    // initializes EventListeners for the likeButtons
    var likeButtonList = document.getElementsByClassName("likeButton");
    for (var i = 0; i < likeButtonList.length; i++) {
        likeButtonList[i].addEventListener('click', likeToggle, false);
        likeButtonList[i].addEventListener('touchstart', likeToggle, false);
        likeButtonList[i].style.transform = "rotate(-90deg)";
    }

    // initializes EventListeners for the detailsButtons
    var detailsList = document.getElementsByClassName("detailsButton");
    for (var i = 0; i < detailsList.length; i++) {
        detailsList[i].addEventListener('click', picDetails, false);
        detailsList[i].addEventListener('touchstart', picDetails, false);
    }

    /**
     * makes the picture-buttons visible
     */
    function onEnter() {
        var btn1 = this.firstElementChild.nextElementSibling.firstElementChild;
        var btn2 = btn1.nextElementSibling;
        btn1.style.opacity = 1;
        btn2.style.opacity = 1;
    }

    /**
     * makes the picture-buttons invisible
     */
    function onLeave() {
        var btn1 = this.firstElementChild.nextElementSibling.firstElementChild;
        var btn2 = btn1.nextElementSibling;
        btn1.style.opacity = 0;
        btn2.style.opacity = 0;
    }

    /**
     * switches the likeButton states
     */
    function likeToggle(event) {
        if (event.type == "touchstart") {

            event.preventDefault();
        }
        if (this.style.transform == "-90" || this.style.transform == "rotate(0deg)") {
            this.style.transform = "rotate(180deg)";
        }
        else {
            this.style.transform = "rotate(0deg)";
        }
    }


    /**
     * displays the triggered picture in a full-screen overlay
     */
    function picDetails(event) {
        // the clicked picture's being copied and initialized to be viewed full-screen
        if (event.type == "touchstart") {

           event.preventDefault();
        }
        var img = this.parentNode.parentNode.firstElementChild;
        var copyImg = img.cloneNode(true);
        copyImg.style.maxHeight = "100%";
        copyImg.style.maxWidth = "100%";

        // a new div is being created and initialized, acting as overlay/container
        var newDiv = document.createElement('div');
        newDiv.style.width = "100%";
        newDiv.style.height = "100%";
        newDiv.style.backgroundColor = "rgba(0, 0, 0, 0.80)";
        newDiv.style.position = "fixed";
        newDiv.style.display = "flex";
        newDiv.style.justifyContent = "center";
        newDiv.style.alignItems = "center";
        newDiv.style.zIndex = "99";

        newDiv.appendChild(copyImg);
        newDiv.addEventListener('click', closeBig, false);
        newDiv.addEventListener('touchstart', closeBig, false);

        document.body.insertBefore(newDiv, document.body.childNodes[0]);
    }

    /**
     * closes the overlay
     */
    function closeBig() {
        document.body.removeChild(this);
    }
});


