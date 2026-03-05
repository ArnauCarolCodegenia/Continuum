const { safeJsonParse } = require("../../../http");
const { Deduplicator } = require("../utils/dedupe");

const rechart = {
  name: "create-chart",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        // Scrape a website and summarize the content based on objective if the content is too large.',
        aibitat.function({
          super: aibitat,
          name: this.name,
          tracker: new Deduplicator(),
          description:
            "Generates the JSON data required to generate a RechartJS chart to the user based on their prompt and available data.",
          // Examples to guide the LLM using few-shot prompting for single and multi-metric charts
          examples: [
            {
              prompt: "Create a bar chart showing our monthly active users for Q1.",
              call: JSON.stringify({
                type: "bar",
                title: "Q1 Monthly Active Users",
                dataset: JSON.stringify([
                  { name: "January", users: 5000 },
                  { name: "February", users: 7000 },
                  { name: "March", users: 10000 }
                ])
              })
            },
            {
              prompt: "Chart the revenue and expenses for the last three months in a line chart.",
              call: JSON.stringify({
                type: "line",
                title: "Revenue vs Expenses (Last 3 Months)",
                dataset: JSON.stringify([
                  { name: "Month 1", revenue: 40000, expenses: 24000 },
                  { name: "Month 2", revenue: 30000, expenses: 13980 },
                  { name: "Month 3", revenue: 20000, expenses: 38000 }
                ])
              })
            },
            {
              prompt: "Give me an area chart comparing the performance of three different servers.",
              call: JSON.stringify({
                type: "area",
                title: "Server Performance Comparison",
                dataset: JSON.stringify([
                  { name: "00:00", server1: 300, server2: 200, server3: 150 },
                  { name: "01:00", server1: 350, server2: 210, server3: 140 },
                  { name: "02:00", server1: 400, server2: 190, server3: 160 }
                ])
              })
            }
          ],
          // JSON schema defining the arguments the LLM must provide to call this tool
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "area",
                  "bar",
                  "line",
                  "composed",
                  "scatter",
                  "pie",
                  "radar",
                  "radialBar",
                  "treemap",
                  "funnel",
                ],
                description: "The type of chart to be generated.",
              },
              title: {
                type: "string",
                description:
                  "Title of the chart. There MUST always be a title. Do not leave it blank.",
              },
              dataset: {
                type: "string",
                description: `A stringified JSON array. Each element is an object representing a data point for Recharts API without new line characters. 
Format requirements:
- Always use double quotes for properties and string values.
- The independent variable axis (usually x-axis) MUST be named "name" in every object.
- You can include multiple other properties in the same object, representing different lines/bars/areas for that data point. Name them dynamically based on the metrics. 
Example JSON string: '[{"name": "Jan", "sales": 4000, "profit": 2400}, {"name": "Feb", "sales": 3000, "profit": 1398}]'`,
              },
            },
            additionalProperties: false,
          },
          required: ["type", "title", "dataset"],
          handler: async function ({ type, dataset, title }) {
            try {
              if (this.tracker.isMarkedUnique(this.name)) {
                this.super.handlerProps.log(
                  `${this.name} has been called for this chat response already. It can only be called once per chat.`
                );
                return "The chart was generated and returned to the user. This function completed successfully. Do not call this function again.";
              }

              const data = safeJsonParse(dataset, null);
              if (data === null) {
                this.super.introspect(
                  `${this.caller}: ${this.name} provided invalid JSON data - so we cant make a ${type} chart.`
                );
                return "Invalid JSON provided. Please only provide valid RechartJS JSON to generate a chart.";
              }

              this.super.introspect(`${this.caller}: Rendering ${type} chart for multiple metrics.`);
              this.super.socket.send("rechartVisualize", {
                type,
                dataset,
                title,
              });

              this.super._replySpecialAttributes = {
                saveAsType: "rechartVisualize",
                storedResponse: (additionalText = "") =>
                  JSON.stringify({
                    type,
                    dataset,
                    title,
                    caption: additionalText,
                  }),
                postSave: () => this.tracker.removeUniqueConstraint(this.name),
              };

              this.tracker.markUnique(this.name);
              return "The chart was generated and returned to the user. This function completed successfully. Do not make another chart.";
            } catch (error) {
              this.super.handlerProps.log(
                `create-chart raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while generating the chart. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  rechart,
};
