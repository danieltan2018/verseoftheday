getTime();
initVerse();
initPhoto();
getVerse();
getWP();

function initVerse() {
    bibleText = window.localStorage.getItem('bibleText');
    bibleVerse = window.localStorage.getItem('bibleVerse');
    if (bibleText && bibleVerse) {
        document.getElementById("bibleText").innerHTML = bibleText;
        document.getElementById("bibleVerse").innerHTML = bibleVerse;
    }
}

function initPhoto() {
    photo = window.localStorage.getItem('photo');
    if (photo) {
        document.body.style.background = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + photo + ') no-repeat center center fixed';
        getPhoto(false);
        reveal();
    }
    else {
        getPhoto(true);
    }
}

function getVerse() {
    $.ajax({
        url: 'https://dailyverses.net/get/verse?language=kjv',
        dataType: 'JSONP',
        success: function (json) {
            var el = document.createElement('html');
            el.innerHTML = json.html;
            window.localStorage.setItem('bibleText', el.getElementsByClassName("dailyVerses")[0].innerHTML);
            window.localStorage.setItem('bibleVerse', el.getElementsByClassName("dailyVerses")[1].getElementsByTagName("a")[0].innerHTML);
            initVerse();
        }
    });
};

function getPhoto(setPhoto) {
    var imgxhr = new XMLHttpRequest();
    imgxhr.open("GET", "https://source.unsplash.com/1920x1080/?nature,background");
    imgxhr.responseType = "blob";
    imgxhr.onload = function () {
        if (imgxhr.status === 200) {
            reader.readAsDataURL(imgxhr.response);
        }
    };
    var reader = new FileReader();
    reader.onloadend = function () {
        window.localStorage.setItem('photo', reader.result);
        if (setPhoto) {
            initPhoto();
        }
    };
    imgxhr.send();
}

function getTime() {
    var now = new Date();
    document.getElementById('time').innerHTML = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerHTML = now.toLocaleDateString('en-SG', options);
    var t = setTimeout(getTime, 500);
}

function getWP() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                post = JSON.parse(this.responseText);
                link = post[0].link;
                title = post[0].title.rendered;
                document.getElementById("wp_link").href = link;
                document.getElementById("wp_link").innerHTML = "Latest from BPilgrims.com: " + title;
                var ex = document.createElement('html');
                ex.innerHTML = post[0].excerpt.rendered;
                document.getElementById("wp_excerpt").innerHTML = ex.getElementsByTagName("p")[0].textContent.split(" ").splice(0, 25).join(" ") + "... ";
                document.getElementById("wp_excerpt").innerHTML += '<a id="wp_link2">Read More &raquo;</a>'
                document.getElementById("wp_link2").href = link;
            }
        }
    };
    xhr.open("GET", "https://bpilgrims.com/wp-json/wp/v2/posts?per_page=1&_fields=link,title,excerpt", true);
    xhr.send();
}

function reveal() {
    document.getElementById("loading").style.display = 'none';
    document.getElementById("main").style.display = 'inline';
}