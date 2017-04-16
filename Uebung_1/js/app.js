window.onload = function () {

    var classname = document.getElementsByClassName("img");


    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('mouseover', function(event) {
            var target = event.target;
            var btn1 = target.nextElementSibling.firstElementChild;
            var btn2 = target.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "visible";
            btn1.style.opacity = 1;
            btn2.style.visibility = "visible";
            btn2.style.opacity = 1;

        });
        classname[i].addEventListener('mouseout', function(event) {
            var target = event.target;
            var btn1 = target.nextElementSibling.firstElementChild;
            var btn2 = target.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "hidden";
            btn1.style.opacity = 0;
            btn2.style.opacity = 0;
            btn2.style.visibility = "hidden";
        });
        classname[i].addEventListener('touchstart', function(event) {
            var target = event.target;
            var btn1 = target.nextElementSibling.firstElementChild;
            var btn2 = target.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "visible";
            btn2.style.visibility = "visible";
            btn1.style.opacity = 1;
            btn2.style.opacity = 1;
        });
        classname[i].addEventListener('touchend', function(event) {
            var target = event.target;
            var btn1 = target.nextElementSibling.firstElementChild;
            var btn2 = target.nextElementSibling.firstElementChild.nextElementSibling;
            btn1.style.visibility = "hidden";
            btn1.style.opacity = 0;
            btn2.style.visibility = "hidden";
            btn2.style.opacity = 0;

        });
    }




};


