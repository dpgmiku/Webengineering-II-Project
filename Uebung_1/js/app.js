function showLikeButton(node)
{
    node.innerHTML = "test";
}

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

    // changes class for the triggered node to visible

};


