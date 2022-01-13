// # Get more photos from nasa

// # When photo is liked, save it's info in the chrome storage

// # More photos can be loaded by js

// today's date. Declared outside of load_images scope to allow infinite scrolling.
var date = new Date();
var scrolled = false;

function load_images(){
    today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    console.log(today);

    // get date 15 days ago
    date.setDate(date.getDate() - 15);
    days_ago = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();

    // Get photos of the day from nasa;
    getapidata('https://api.nasa.gov/planetary/apod?api_key=9V4IF8n2vyhmZGudVjQ8SlsQkTAeRtrF9SqbXlGs&start_date=' + days_ago + '&end_date=' + today);

    date.setDate(date.getDate() - 1);
}

async function getapidata(url) {

    const response = await fetch(url);
    var data = await response.json();
    show_images(data);
}

function show_images(data){
    // Allows adding on to existing posts when you reach the bottom
    for(image of data){
        if (image.media_type == "image"){
            console.log(image.url)
            insert = '\
            <div class="flex-item space-item">\
                <div class="space-image">\
                    <img src=\ '+ image.url +'>\
                </div>\
                <div class="image-description">\
                    <div class="text">\
                        <h1>'+ image.title +'</h1>\
                        <h3>'+ image.date +'</h3>\
                        <p>'+ image.explanation +'</p>\
                    </div>\
                    <div class="like-container">\
                        <i class="fas fa-heart"></i>\
                    </div>\
                </div>\
            </div>' + document.getElementById("main-page").innerHTML;
            document.getElementById("main-page").innerHTML = insert;
        }
        
    }
    // When we have completed building the queue of posts, make it completed and make an empty queue called main-page below for the next images to load.
    var completed =  document.getElementById("main-page");
    completed.innerHTML += "<div id=\"main-page\"></div>";
    completed.id = 'completed-main-page';

}

window.onscroll = function(ev) {
    scrolled = true;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(scrolled){
            load_images();
            scrolled = false;
        }
    }
};  