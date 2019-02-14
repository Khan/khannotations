module.exports = (baseConfig, env, config) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve("babel-loader"),
        options: {
            presets: [["react-app", {flow: false, typescript: true}]],
        },
    });

    config.module.rules.push({
        test: /\.stories\.(ts|tsx)?$/,
        loaders: [
            {
                loader: require.resolve("@storybook/addon-storysource/loader"),
                options: {parser: "typescript"},
            },
        ],
        enforce: "pre",
    });
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
};
