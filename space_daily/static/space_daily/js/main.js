var date = new Date();
var scrolled = false;
var liked_only_selected = false;

/**
 * This function loads 15 images the second the page loads, and when the user scrolls to the bottom of the page.
 * We use todays date, and a date 15 days ago for the nasa api call.
 */
function load_images() {
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    // get date 15 days ago
    date.setDate(date.getDate() - 15);
    days_ago = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    // Get photos of the day from nasa;
    getapidata('https://api.nasa.gov/planetary/apod?api_key=9V4IF8n2vyhmZGudVjQ8SlsQkTAeRtrF9SqbXlGs&start_date=' + days_ago + '&end_date=' + today);

    date.setDate(date.getDate() - 1);
}

/**
 * This async function shows our loading gif, and gets the data from the nasa api.
 * Once the data is returned we hide the loading icon.
 */
async function getapidata(url) {
    showloader();
    const response = await fetch(url);
    var data = await response.json();
    if (response) {
        hideloader();
    }
    show_images(data);
}

/**
 * This function hides the loading icon, it is solely used by getapidata()
 */
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}

/**
 * This function shows the loading icon, it is solely used by getapidata()
 */
function showloader() {
    document.getElementById('loading').style.display = 'flex';
}

/**
 * This handles the returned data from getapidata, and loaded the images.
 * It also checks the local storage to see if any of the images it is loading are saved.
 * If there are some it adds the 'liked' classname to the element to dispay it properly
 */
function show_images(data) {
    for (image of data) {
        // We filter out the YouTube videos returned on some days.
        if (image.media_type == "image") {
            // If the image is liked by the user make it load liked.
            var liked_insert = '';
            var liked_images = JSON.parse(localStorage.getItem("liked_images"));
            if (liked_images) { // If there are some images liked
                const index = liked_images.indexOf(image.hdurl);
                if (index > -1) {
                    // If there are some images liked and this image is one of them, add the class name to the insert.
                    liked_insert = 'fas liked';
                }
            }
            // The image block insert, with apropriate data entrys.
            insert = '\
            <div class="flex-item space-item">\
                <div class="space-image">\
                <a href="' + image.hdurl + '">\
                    <img src=\ ' + image.url + '>\
                </a>\
                </div>\
                <div class="image-description">\
                    <div class="text">\
                        <h1>' + image.title + '</h1>\
                        <h3>' + image.date + '</h3>\
                        <p>' + image.explanation + '</p>\
                    </div>\
                    <div class="button-container">\
                    <i class="far fa-heart like-button ' + liked_insert + '" onclick="like(this)" data-link="' + image.hdurl + '"></i>\
                    <i class="fas fa-share-alt share-button" onclick="share(this)" data-link="' + image.hdurl + '"></i>\
                    </div>\
                </div>\
            </div>' + document.getElementById("main-page").innerHTML;
            document.getElementById("main-page").innerHTML = insert;
        }

    }
    // When we have completed building the queue of posts, make it completed and make an empty queue called main-page below for the next 15 images to load when the user scrolls to the bottom.
    var completed = document.getElementById("main-page");
    completed.innerHTML += "<div id=\"main-page\"></div>";
    completed.id = 'completed-main-page';

}

/**
 * This function checks if the user is at the bottom of the page, and only loads more images if show only liked is not selected.
 */
window.onscroll = function () {
    scrolled = true;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (scrolled && !liked_only_selected) {
            load_images();
            scrolled = false;
        }
    }
};

/**
 * This function is called when the like button is pressed. It toggles the full heart animation, and adds the appropritate class name.
 * It then determines if it is a like or an unlike, and handles it apropriatly.
 */
function like(element) {
    // toggle the heart that is full, and add liked to the element so we know what to delete.
    element.classList.toggle('fas')
    element.classList.toggle('liked')

    if (element.className.includes("liked")) {
        // if like
        console.log('like');
        handle_like(element.dataset.link, true);
    } else {
        // if unlike
        console.log('unlike');
        handle_like(element.dataset.link, false);
    }
}

/**
 * This function is called when the share button is pressed. 
 * It changes the icon to a check mark and copies the HD link to be shared to the clipboard.
 */
function share(element) {
    // toggle the heart that is full, and add liked to the element so we know what to delete.
    element.classList.toggle('fa-check')
    element.classList.toggle('fa-share-alt')
    var copyText = element.dataset.link;
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText);

    /* Alert the copied text */
    alert("Copied the link to the HD image");
}

/**
 * This function is called when the filter button is pressed.
 * If checked it hides unliked pictures. This is determined if they do not have the 'liked' class name.
 * Otherwise it shows all images.
 */
function liked_only(element) {
    // If the checkbox is checked, hide unliked pictures
    if (element.checked == true) {
        liked_only_selected = true;
        var pics = document.getElementsByClassName('flex-item space-item');
        Array.prototype.forEach.call(pics, function (el) {
            if (el.getElementsByClassName("liked").length != 1) {
                el.style.display = "none";
            }
        });
    } else {
        liked_only_selected = false;
        var pics = document.getElementsByClassName('flex-item space-item');
        Array.prototype.forEach.call(pics, function (el) {
            el.style.display = "flex";
        });
    }
}

/**
 * if_like: bool -> If it is a like (true) or an unlike (false)
 * url: string -> the url of the image which we save to identity the image.
 * This function is called when a like needs to be stored by like function.
 * It stores the liked image's url in the local storage. 
 * I chose the url since there is a chance the titles can be identical, but it is unlikely the links are.
 */
function handle_like(url, if_like) {

    // if they like this image  
    if (if_like) {
        // load liked images array from localStorage
        var liked_images = JSON.parse(localStorage.getItem("liked_images"));

        // if there is no liked images, make a new array to be stored.
        if (!liked_images) {
            liked_images = [];
            liked_images.push(url);
        } else {
            liked_images.push(url);
        }

        localStorage.setItem('liked_images', JSON.stringify(liked_images));
    } else {
        // if they unlike this image
        var liked_images = JSON.parse(localStorage.getItem("liked_images"));
        const index = liked_images.indexOf(url);
        // if the image is in the array, remove it.
        if (index > -1) {
            liked_images.splice(index, 1);
        }
        localStorage.setItem('liked_images', JSON.stringify(liked_images));
    }


}