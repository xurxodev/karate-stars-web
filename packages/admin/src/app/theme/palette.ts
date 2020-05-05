import { colors } from '@material-ui/core';
import createPalette, { Palette } from '@material-ui/core/styles/createPalette';

const white = '#FFFFFF';
const black = '#000000';

const palette: Palette = createPalette({
  common: {
    black,
    white
  },
  type: 'light',
  contrastThreshold: 3,
  tonalOffset: 0.2,
  primary: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[500],
    light: colors.red[100]
  },
  secondary: {
    contrastText: white,
    dark: colors.blue['A700'],
    main: colors.blue['A200'],
    light: colors.blue['A200']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  grey: colors.grey,
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    disabled: colors.blueGrey[200],
    hint: colors.blueGrey[200],
    //link: colors.blue[600]
  },
  background: {
    default: '#F4F6F8',
    paper: white
  },
  //icon: colors.blueGrey[600],
  divider: colors.grey[200]
});

export default palette;
