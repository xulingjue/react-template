module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard",
    "standard-react"
  ],
  "plugins": [
    "babel",
    "react",
    "promise"
  ],
  "env": {
    "browser": true
  },
  "globals": {
  },
  "rules": {
    "eqeqeq": "off",
    "key-spacing": "off",
    "jsx-quotes": [2, "prefer-double"],
    "max-len": [2, 120, 2],
    "object-curly-spacing": [2, "always"],
    "comma-dangle": "off",
    "semi": "off",
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "ignore",
      "asyncArrow": "ignore"
    }],
    "no-fallthrough": "off",
    "no-multi-spaces": "off",
    "standard/no-callback-literal": "off",
    "no-self-compare": "off",
    "no-multiple-empty-lines": "off",
    "react/prop-types": "off",
    "react/jsx-no-bind": "off",
    "react/no-unused-prop-types": "off"
  }
};
