export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  // use the browser build, the default one skips createGlobalStyle
  moduleNameMapper: {
    '^styled-components$': '<rootDir>/node_modules/styled-components/dist/styled-components.browser.cjs.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx'],
};
