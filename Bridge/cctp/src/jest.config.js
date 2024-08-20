module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(some-es6-package|another-es6-package)/)",
  ],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
