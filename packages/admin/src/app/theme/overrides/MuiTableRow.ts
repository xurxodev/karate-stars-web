import palette from "../palette";

const overridePalette = {
    root: {
        "&$selected": {
            backgroundColor: palette.background.default,
        },
        "&$hover": {
            "&:hover": {
                backgroundColor: palette.background.default,
            },
        },
    },
};

export default overridePalette;
