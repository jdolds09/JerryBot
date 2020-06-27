const requestHandler = require("../handler");
function getGelPage() {
    let count = Math.floor(Math.random() *10), page = (count === 0) ? 0 : 42 * count;
    return page;
}
class HentaiShit {
    ass() {
        let page = Math.floor(Math.random() *24) +1;
        let urls = [
            {url: `https://danbooru.donmai.us/posts?page=${page}&tags=ass+panties`, source: "danbooru"}, 
            {url: `https://gelbooru.com/index.php?page=post&s=list&tags=ass+uncensored&pid=${getGelPage()}`, source: "gelbooru"}
        ];
        let data = urls[Math.floor(Math.random() *urls.length)];
        return requestHandler.makeRequest(data.source, data.url);
    }
    thighs() {
        let page = Math.floor(Math.random() *24) +1, tags = ["thighs", "thighhighs", "black_legwear"], 
        url = `https://danbooru.donmai.us/posts?page=${page}&tags=${tags[Math.floor(Math.random() *tags.length)]}`;
        return requestHandler.makeRequest("danbooru", url);
    }
    panties() {
        let page = Math.floor(Math.random() *24) +1, tags = ["panties", "underwear", "black_panties", "white_panties", "pink_panties", "pantyshot", 
        "underwear_only", "side-tie_panties", "bow_panties"],
        url = `https://danbooru.donmai.us/posts?page=${page}&tags=${tags[Math.floor(Math.random() *tags.length)]}`;
        return requestHandler.makeRequest("danbooru", url);
    }
    feet() {
        let page = Math.floor(Math.random() *24) +1, tags = ["feet", "toes", "sole", "barefoot"],
        url = `https://danbooru.donmai.us/posts?page=${page}&tags=${tags[Math.floor(Math.random() *tags.length)]}`;
        return requestHandler.makeRequest("danbooru", url);
    }
}
module.exports = new HentaiShit();