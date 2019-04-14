const path = require('path');
const defaultConfig = {
    mode: "production",
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
};

const webBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        filename: "bullet-train-rules-engine.js",
        library: "bullet-train-rules-engine",
        libraryTarget: "umd",
        path: path.join(__dirname, '/lib'),
    },
    entry: {
        main: './bullet-train-rules-engine.js'
    }
});


const webExampleBundle = Object.assign({}, defaultConfig, {  //Bundle 2: compile the web client for the example project
    output: {
        filename: "bullet-train-rules-engine.js",
        library: "bullet-train-rules-engine",
        libraryTarget: "umd",
        path: path.join(__dirname, '/example/src'),
    },
    entry: {
        main: './bullet-train-rules-engine.js'
    }
});

module.exports = [
    webBundle,
    webExampleBundle,
];
