
window.onload = function () {

    var images = document.getElementsByClassName("image");
    var img = null;
    for(var i = 0; i < images.length; i++)
    {
        img = images[i];
        img.addEventListener('mouseover',
            function() {
              showLikeButton(img);
            }
        );
    }


    /**
     * Shows the like-button on a html-element by changing its CSS-class
     * @param node DOM-Element from which to change the class
     */
    function showLikeButton(node)
    {
        node.innerHTML = "test";
    }



};


