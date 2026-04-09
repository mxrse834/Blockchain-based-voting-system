export default {
  solidity: {
    version: "0.8.20",
    settings: {},
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      type: "http"
    },
    ganache: {
      url: "http://127.0.0.1:5545",
      type: "http"
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};