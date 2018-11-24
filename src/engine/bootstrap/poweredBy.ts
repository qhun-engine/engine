declare type QhunEnginePoweredBy = {
    text: string,
    style: string[]
}[];

export const poweredBy: QhunEnginePoweredBy = [
    { text: "", style: [] },
    {
        text: "powered by", style: [
            "color: black;", "font-family: monospace;", "font-weight: bold;"
        ]
    }, {
        text: "Qhun Game Engine", style: [
            "color: #034892;", "font-family: monospace;", "font-weight: bold;",
            "font-size: 16pt;"
        ]
    }, {
        text: "made with ❤️ by wartoshika", style: []
    },
    { text: "", style: [] }
];
