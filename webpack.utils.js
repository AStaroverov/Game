const path = require('path');

module.exports = {
    getResolve,
    getTsLoader,
    createConfigProperties,
    getWorkerLoader,
    getSharedWorkerLoader,
    getGLSLLoader,
};

function createConfigProperties(pathToApp) {
    return {
        entry: path.join(__dirname, `/src/${pathToApp}/index.ts`),
        html: {
            template: path.join(__dirname, `/src/${pathToApp}/index.ejs`),
        },
    };
}

function getResolve() {
    return {
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.js', '.mjs', '.wasm', '.ts', '.tsx', '.json', '.glsl'],
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
