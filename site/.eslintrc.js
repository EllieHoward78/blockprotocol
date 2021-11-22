/**
 * @file downstream of hashintel/dev/packages/hash/.eslintrc.json
 */
module.exports = {
  // this is the highest config lower ones will automatically extend
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
  },
  plugins: ["@typescript-eslint", "react-hooks", "jest"],
  extends: [
    "plugin:@typescript-eslint/base",
    "airbnb",
    "prettier",
    // mutes eslint rules conflicting w/ prettier (requires eslint-config-prettier)
  ],
  ignorePatterns: ["**/*.gen.*"],
  globals: {
    NodeJS: true,
    React: true,
    JSX: true,
    FixMeLater: "readonly",
    globalThis: "readonly",
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // overridden airbnb rules (if you wish to add to this list, please outline your reasoning here: https://www.notion.so/hashintel/HASH-dev-eslint-configuration-60c52c127d13478fbce6bb5579a6b7be)
    "no-undef-init": "off",
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "TSTypeReference[typeName.name=/^(DirectEditorProps|EditorProps|EditorView|EditorState|NodeView|ProsemirrorNode|Command|Transaction|Plugin|PluginKey)$/]:not([typeParameters])",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "TSTypeReference[typeName.name=/^(DirectEditorProps|EditorProps|EditorView|EditorState|NodeView|ProsemirrorNode|Command|Transaction)$/][typeParameters.params.0.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector:
          "TSTypeReference[typeName.name=/^(Plugin|PluginKey)$/][typeParameters.params.length=1]",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "TSTypeReference[typeName.name=/^(Plugin|PluginKey)$/][typeParameters.params.1.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector: "TSClassImplements[expression.name=NodeView]:not([typeParameters])",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "TSClassImplements[expression.name=NodeView][typeParameters.params.0.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector:
          "CallExpression[callee.object.name=/^(EditorState|NodeSelection|TextSelection|DecorationSet|ProsemirrorNode|MarkType)$/][callee.property.name=create]:not([typeParameters])",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "CallExpression[callee.object.name=/^(EditorState|NodeSelection|TextSelection|DecorationSet|ProsemirrorNode|MarkType)$/][callee.property.name=create][typeParameters.params.0.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector: "CallExpression[callee.name=keymap]:not([typeParameters])",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector: "CallExpression[callee.name=keymap][typeParameters.params.0.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector:
          "NewExpression[callee.name=/^(Plugin|PluginKey|EditorView|Selection|TextSelection|NodeSelection|AllSelection|SelectionRange|Slice|NodeRange|ReplaceStep|ReplaceAroundStep|AddMarkStep|RemoveMarkStep|Transform|InputRule|GapCursor)$/]:not([typeParameters])",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "NewExpression[callee.name=/^(EditorView|Selection|TextSelection|NodeSelection|AllSelection|SelectionRange|Slice|NodeRange|ReplaceStep|ReplaceAroundStep|AddMarkStep|RemoveMarkStep|Transform|InputRule|GapCursor)$/][typeParameters.params.0.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
      {
        selector:
          "NewExpression[callee.name=/^(Plugin|PluginKey)$/][typeParameters.params.length=1]",
        message: "Please provide a generic to avoid implicit `any`",
      },
      {
        selector:
          "NewExpression[callee.name=/^(Plugin|PluginKey)$/][typeParameters.params.1.type=TSAnyKeyword]",
        message: "Please replace `any` with a specific type",
      },
    ],
    camelcase: "off",
    "import/no-cycle": "warn",
    "import/prefer-default-export": "off",
    "no-await-in-loop": "off",
    "import/no-unresolved": [
      2,
      {
        ignore: ["^@hashintel"],
      },
    ],
    "react/prop-types": "off",
    // because we are using typescript this is redundant
    "jsx-a11y/anchor-is-valid": "off",
    // because we use next.js empty anchor tags should be used when using the Link component
    "react/jsx-filename-extension": [
      2,
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "no-void": [
      "error",
      {
        allowAsStatement: true,
      },
    ],
    "no-continue": "off",
    "react/react-in-jsx-scope": "off",
    "no-return-await": "off",
    "max-classes-per-file": "off",
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
    "consistent-return": "off",
    "default-case": "off",
    "class-methods-use-this": "off",
    "react/no-unescapted-entities": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "no-else-return": "off",
    "arrow-body-style": "off",
    "react/no-unescaped-entities": "off",
    // Other rule changes
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks: "(^useModal$)|(^useUserGatedEffect$)",
      },
    ],
    "react/jsx-key": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/self-closing-comp": "warn",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@testing-library/react",
            importNames: ["render"],
            message: "Please use ./src/tests/testUtils.tsx#render instead",
          },
          {
            name: "prosemirror-model",
            importNames: ["Node"],
            message: "Please use ProsemirrorNode from @hashintel/shared/node",
          },
        ],
      },
    ],
    "react/require-default-props": "off",
    "no-shadow": "off",
    // see https://github.com/typescript-eslint/typescript-eslint/issues/2483
    "@typescript-eslint/no-shadow": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "id-length": [
      "error",
      {
        min: 2,
        exceptions: ["_", "x", "y", "z", "a", "b", "i"],
        properties: "never",
      },
    ],
    "no-unused-expressions": "error",
    curly: ["error", "multi-line"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": ["error"],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        minimumDescriptionLength: 10,
      },
    ],
    "no-empty-function": "off",
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsForRegex: ["^draft"],
        ignorePropertyModificationsFor: [
          "acc",
          "accumulator",
          "e",
          "ctx",
          "context",
          "req",
          "request",
          "res",
          "response",
          "$scope",
          "staticContext",
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/__mocks__/*", "**/testUtils/*", "*.test.ts", "*.test.tsx"],
      env: {
        "jest/globals": true,
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off",
        // replaced by @typescript-eslint/no-unused-vars
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_+",
            varsIgnorePattern: "^_+",
          },
        ],
        "@typescript-eslint/no-floating-promises": "error",
      },
    },
  ],
};
