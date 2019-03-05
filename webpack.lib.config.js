const path = require("path");

module.exports = {
    entry: "./dist/lib.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        libraryTarget: "commonjs2",
    },
    externals: {
        react: {
            commonjs2: "react"
        },
        "react-dom": {
            commonjs2: "react-dom"
        },
        aphrodite: {
            commonjs2: "aphrodite"
        },
        "aphrodite/no-important": {
            commonjs2: "aphrodite"
        },
    },
    mode: "production"
}
