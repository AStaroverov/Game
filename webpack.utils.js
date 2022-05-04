const path = require('path');

module.exports = {
    getResolve,
    getTsLoader,
    getImageLoader,
    getWorkerLoader,
    getSharedWorkerLoader,
    getGLSLLoader,
};

function getResolve() {
    return {
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.js', '.mjs', '.wasm', '.ts', '.tsx', '.json', '.glsl'],
    };
}

function getImageLoader() {
    return {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    };
}

function getTsLoader({ tsx, test } = {}) {
    const loader = {
        loader: 'esbuild-loader',
        options: {
            loader: tsx === true ? 'tsx' : 'ts',
        },
    };

    if (test !== false) {
        loader.test = tsx === true ? /\.tsx?$/ : /\.ts?$/;
    }

    return loader;
}

function getWorkerLoader() {
    return {
        test: /\.worker\.ts$/i,
        use: [
            {
                loader: 'worker-loader',
                options: {
                    esModule: false,
                },
            },
            getTsLoader({ test: false }),
        ],
    };
}

function getSharedWorkerLoader() {
    return {
        test: /\.sharedWorker\.ts$/i,
        use: [
            {
                loader: 'worker-loader',
                options: {
                    esModule: false,
                    worker: 'SharedWorker',
                },
            },
            getTsLoader({ test: false }),
        ],
    };
}

function getGLSLLoader() {
    return {
        test: /\.glsl$/,
        type: 'asset/source',
    };
}
