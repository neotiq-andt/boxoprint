//Sign In User
export const SIGNIN_USER = "SIGNIN_USER";
export const SIGNIN_USER_SUCCESS = "SIGNIN_USER_SUCCESS";
export const SIGNIN_USER_FAILURE = "SIGNIN_USER_FAILURE";
export const SIGNIN_USER_RESET = "SIGNIN_USER_RESET";
export const LOGOUT_USER = "LOGOUT_USER";

export const TEMPLATES_INIT = "TEMPLATES_INIT";
export const TEMPLATES_SUCCESS = "TEMPLATES_SUCCESS";
export const TEMPLATES_FAILURE = "TEMPLATES_FAILURE";

export const APP_TITLE = "APP_TITLE";

export const EDITOR_SHOW_HELPERS = "EDITOR_SHOW_HELPERS";
export const EDITOR_HIDE_HELPERS = "EDITOR_HIDE_HELPERS";

// interface
export const UI_BUTTON_SIZE = "tiny";

// api
//export const apiUrl = 'http://localhost:8082';
export const apiUrl = `https://${process.env.API}/boxo_api`;

// Textbox
export const Fonts = [
  "Albertina",
  "Antiqua",
  "Architect",
  "Arial",
  "BankFuturistic",
  "BankGothic",
  "Blackletter",
  "Blagovest",
  "Calibri",
  "Comic Sans MS",
  "Courier",
  "Cursive",
  "Decorative",
  "Fantasy",
  "Fraktur",
  "Frosty",
  "Garamond",
  "Georgia",
  "Helvetica",
  "Impact",
  "Minion",
  "Modern",
  "Monospace",
  "Open Sans",
  "Palatino",
  "Perpetua",
  "Roman",
  "Sans-serif",
  "Serif",
  "Script",
  "Swiss",
  "Times",
  "Times New Roman",
  "Tw Cen MT",
  "Verdana",
];
export const FontStyle = ["normal", "italic"];

export const FontWeight = ["normal", "bold"];

export const LAYER_TYPE_IMAGE = "picture";
export const LAYER_TYPE_TEXT = "text";
export const LAYER_TYPE_SHAPE = "shape";

export const SHAPE_TYPE = {
  line: "line",
  rectangle: "rectangle",
  rectangleRC: "rectangle_RC",
  square: "square",
  squareRC: "square_RC",
  circle: "circle",
  oval: "oval",
  pentagon: "pentagon",
  triangle: "triangle",
};