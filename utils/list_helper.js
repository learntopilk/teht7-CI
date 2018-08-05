var Blog = require('../models/Blog.js');
var dummy = function () {
    //  return 1
};
var totalLikes = function (blogs) {
    var i = 0;
    blogs.forEach(function (b) { i += b.likes; });
    return i;
};
var favoriteBlog = function (blogs) {
    var mostLikedBlog = {};
    var mostLikes = 0;
    blogs.forEach(function (blog) {
        if (blog.likes > mostLikes) {
            mostLikedBlog = blog;
            mostLikes = blog.likes;
        }
    });
    //console.log(mostLikedBlog)
    return mostLikedBlog;
};
var mostBlogs = function (blogs) {
    var _a;
    var counts = {};
    //let alreadyFound = []
    var authorsOfEachPost = blogs.map(function (b) { return b.author; });
    authorsOfEachPost.forEach(function (a) {
        if (counts[a]) {
            counts[a]++;
        }
        else {
            counts[a] = 1;
            //alreadyFound.push(a)
        }
    });
    var mostBlogs = 0;
    var mostProlific;
    Object.keys(counts).forEach(function (key) {
        if (counts[key] > mostBlogs) {
            mostProlific = key;
            mostBlogs = counts[key];
        }
    });
    //console.log(mostProlific)
    return _a = {}, _a[mostProlific] = counts[mostProlific], _a;
};
// Ylempi tehtiin vähän eri tekniikalla paluuarvo-objektin suhteen.
// Noudatetaan nyt tarkemmin ohjeistusta.
var mostLikes = function (blogs) {
    var foundNames = [];
    var authorsAndLikes = {};
    var maxLikes = 0;
    var mostLiked;
    blogs.forEach(function (b) {
        if (foundNames.includes(b.author)) {
            authorsAndLikes[b.author] += b.likes;
        }
        else {
            authorsAndLikes[b.author] = b.likes;
            foundNames.push(b.author);
        }
        console.log('found Names: ', foundNames);
    });
    console.log('authorsAndLikes: ', authorsAndLikes);
    Object.keys(authorsAndLikes).forEach(function (key) {
        if (authorsAndLikes[key] > maxLikes) {
            maxLikes = authorsAndLikes[key];
            mostLiked = key;
        }
    });
    return { author: mostLiked, likes: maxLikes };
};
module.exports = {
    dummy: dummy, totalLikes: totalLikes, favoriteBlog: favoriteBlog, mostBlogs: mostBlogs, mostLikes: mostLikes
};
