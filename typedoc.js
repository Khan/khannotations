module.exports = {
    out: "./docs/api/",

    readme: "./README.md",
    tsconfig: "./tsconfig.json",
    name: "Khannotations",
    exclude: [
        "src/vendor/**/*.+(js|ts)",
        "src/**/_*.+(ts|tsx)",
        "src/**/*.stories.tsx",
        "src/index.tsx",
    ],
    theme: "./typedoc",
    media: "./doc_media",

    mode: "file",
    excludeExternals: true,
    excludeNotExported: true,
    excludePrivate: true,
};
