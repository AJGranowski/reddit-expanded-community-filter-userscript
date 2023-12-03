import path from "path";

const HTML_ROOT = path.join(__dirname, "html");

class TestConstants {
    static HTML_PATH = {
        REDDIT: path.join(HTML_ROOT, "reddit.com.html")
    };
}

export { TestConstants };