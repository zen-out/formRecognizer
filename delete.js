const _ = require("lodash");
let keyValuePairs = [
  {
    key: { content: "Scanner:", boundingRegions: [Array], spans: [Array] },
    value: {
      content: "$15 per item,",
      boundingRegions: [Array],
      spans: [Array],
    },
    confidence: 0.397,
  },
  {
    key: { content: "Monitor:", boundingRegions: [Array], spans: [Array] },
    value: {
      content: "$45 per item",
      boundingRegions: [Array],
      spans: [Array],
    },
    confidence: 0.438,
  },
];

const result = _.map(
  keyValuePairs,
  ({ key, value }) => `${key.content}: ${value.content}`
);

console.log(result);
