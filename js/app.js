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

function ParseAndDisplayJson(data) {
    var div = document.getElementById('content');
    var json = JSON.parse(data);
    var nextPageIndex = json.data.after;
    var count = json.data.dist;
    var posts = json.data.children;

    for (var i = 0; i < count; i++) {
        if (posts[i].kind === LINK_PREFIX && posts[i].data.title.includes('Library')) {
            var permalinkAnchor = document.createElement('a');
            permalinkAnchor.innerHTML = posts[i].data.title;
            permalinkAnchor.href = baseRedditUrl + posts[i].data.permalink;
            permalinkAnchor.target = '_blank'; // force new tab on click

            var chapterAnchor = document.createElement('a');
            chapterAnchor.innerHTML = ' (Chapter)';
            chapterAnchor.href = posts[i].data.url;
            chapterAnchor.target = '_blank'; // force new tab on click

            div.appendChild(permalinkAnchor);
            div.appendChild(chapterAnchor);
            div.appendChild(document.createElement('br'));
        }
    }

    return nextPageIndex;
}

function hasNovelName(title) {

}

getRedditJson(frontPageUrl)
    .then(function (data) {
        var count = 0;
        var nextPageIndex = ParseAndDisplayJson(data);

        // while (nextPageIndex != null || count < 5) {
        //     (function (nextPage) {
        //         getRedditJson(`${frontPageUrl}&after=${nextPage}`)
        //             .then(function (data2) {
        //                 count++;
        //                 nextPageIndex = ParseAndDisplayJson(data2);
        //             }, function (error) {
        //                 console.error(error);
        //             });
        //     })(nextPageIndex);
        // }
    }, function (error) {
        console.error(error);
    });