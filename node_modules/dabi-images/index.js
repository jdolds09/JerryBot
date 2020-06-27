const real = require("./tags/nsfw/real"), hentai = require("./tags/nsfw/hentai"), custom = require("./tags/other/custom");
class DapiClientNSFW {
    constructor() {
        this.real = real;
        this.hentai = hentai;
    }
}
class DapiClient {
    constructor() {
        this.nsfw = new DapiClientNSFW();
        this.custom = custom;
    }
}
module.exports = {Client: DapiClient};