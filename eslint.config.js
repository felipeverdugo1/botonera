// eslint.config.js
import js from "@eslint/js";
import globals from "globals"

export default [
  js.configs.recommended,
  {
    rules: {
      // Agrega o sobrescribe tus reglas aquí
      "no-unused-vars": "warn",
      "no-console": "off"
    },
    languageOptions: {
          globals: {
            ...globals.node // Activa process, console, __dirname, etc.
          }
  }
  }
];