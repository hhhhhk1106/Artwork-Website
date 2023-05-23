document.querySelector("#image").addEventListener("change", function(evt) {
    var image_src = URL.createObjectURL(this.files[0]);
    document.getElementById("image_preview").src = image_src;
    console.log(this.files[0]);
    console.log(image_src);
})