window.onload = function () {

    var imgClassList = document.getElementsByClassName("img");
    for (var i = 0; i < imgClassList.length; i++) {
        imgClassList[i].addEventListener('mouseenter', function (event) {
            var target = event.target;
            var btn1 = target.firstElementChild.nextElementSibling.firstElementChild;
            var btn2 = target.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "visible";
            btn1.style.opacity = 1;
            btn2.style.visibility = "visible";
            btn2.style.opacity = 1;
        });
        imgClassList[i].addEventListener('mouseleave', function (event) {
            var target = event.target;
            var btn1 = target.firstElementChild.nextElementSibling.firstElementChild;
            var btn2 = target.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "hidden";
            btn1.style.opacity = 0;
            btn2.style.visibility = "hidden";
            btn2.style.opacity = 0;
        });
        imgClassList[i].addEventListener('touchstart', function (event) {
            var target = event.target;
            var btn1 = target.firstElementChild.nextElementSibling.firstElementChild;
            var btn2 = target.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "visible";
            btn1.style.opacity = 1;
            btn2.style.visibility = "visible";
            btn2.style.opacity = 1;
        });
        imgClassList[i].addEventListener('touchend', function (event) {
            var target = event.target;
            var btn1 = target.firstElementChild.nextElementSibling.firstElementChild;
            var btn2 = target.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "hidden";
            btn1.style.opacity = 0;
            btn2.style.visibility = "hidden";
            btn2.style.opacity = 0;
        });
    }

    var likeButtonClassList = document.getElementsByClassName("likeButton");
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
    for (var i = 0; i < detailsButtonList.length; i++) {
        detailsButtonList[i].addEventListener('click', function (event) {
            var btn = event.target;
            var img = btn.parentNode.parentNode;
            var imgList = document.getElementsByClassName('img-large');
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].classList.remove("img-large");
                imgList[i].classList.toggle("img");
            }
            img.classList.toggle("img-large");
        });
    }


    document.body.addEventListener('click', function (event) {
        if (event.target.classList[0] != 'detailsButton') {
            var imgList = document.getElementsByClassName('img-large');
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].classList.remove("img-large");
                imgList[i].classList.toggle("img");
            }
        }
    });

};


