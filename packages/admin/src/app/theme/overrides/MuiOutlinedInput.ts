import palette from "../palette";

const overrideStyles = {
    root: {
        "&$focused $notchedOutline": {
            borderColor: palette.text.primary,
            borderWidth: 2,
        },
    },
};

export default overrideStyles;
