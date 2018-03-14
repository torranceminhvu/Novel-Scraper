const LINK_PREFIX = 't3';
var baseRedditUrl = 'https://www.reddit.com';
var frontPageUrl = 'https://www.reddit.com/r/QidianUnderground/.json?limit=100';

function getRedditJson(url) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                resolve(xhttp.responseText);
            } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
                reject(Error("Error fetching json from url."));
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    });
}

getRedditJson(frontPageUrl)
    .then(function (data) {
        var div = document.getElementById('content');
        var json = JSON.parse(data);
        var nextPageIndex = json.data.after;
        var count = json.data.dist;
        var posts = json.data.children;

        for (var i = 0; i < count; i++) {
            if (posts[i].kind === LINK_PREFIX && posts[i].data.title.includes('Library Of Heaven\'s Path')) {
                var anchor = document.createElement('a');
                anchor.innerHTML = posts[i].data.title;
                anchor.href = baseRedditUrl + posts[i].data.permalink;
                anchor.target = '_blank'; // force new tab on click
                div.appendChild(anchor);
                div.appendChild(document.createElement('br'));
                //divInnerHTML += posts[i].data.url + '<br>';
            }
        }
    }, function (error) {
        console.error(error);
    });