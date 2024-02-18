import path from "path";

const HTML_ROOT = path.join(__dirname, "html");

class TestConstants {
    static HTML_PATH = {
        NEW_REDDIT: path.join(HTML_ROOT, "new.reddit.com.html"),
        SHREDDIT: path.join(HTML_ROOT, "sh.reddit.com.html")
    };
}

export { TestConstants };