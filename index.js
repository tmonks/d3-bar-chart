const w = 800;
const h = 400;
const padding = 50;

const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// margins and dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;

// create graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .style("border", "1px solid blue")
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // move it by margin sizes

// add tool tip div
const tooltip = d3.select(".canvas").append("div").attr("id", "tooltip").style("opacity", 0);

// add title
graph
  .append("text")
  .attr("id", "title")
  .attr("x", graphWidth / 2 - 20)
  // .attr("x", padding)
  .attr("y", margin.top)
  .text("United States GDP")
  .style("font-weight", "bold")
  .style("font-size", "2em");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then((res) => res.json())
    .then((data) => {
      dataset = data.data;

      // calculate the highest and lowest date
      const minDate = new Date(d3.min(dataset, (d) => d[0]));
      const maxDate = new Date(d3.max(dataset, (d) => d[0]));
      const minY = d3.min(dataset, (d) => d[1]);
      const maxY = d3.max(dataset, (d) => d[1]);

      // define the xScale using dates
      const timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, graphWidth]);
      const yScale = d3.scaleLinear().domain([0, maxY]).range([graphHeight, 0]);
      // .range([h - padding, padding]);

      // console.log("bandWidth: " + xScale.bandwidth);
      console.log(`xScale of '2010-07-01': ${timeScale(new Date("2010-07-01"))}`);
      console.log(`xScale of '1947-01-01': ${timeScale(new Date("1947-01-01"))}`);
      console.log(`xScale of '2015-07-01': ${timeScale(new Date("2015-07-01"))}`);

      /* bars */
      graph
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => timeScale(new Date(d[0])))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", graphWidth / dataset.length)
        .attr("height", (d, i) => graphHeight - yScale(d[1]))
        .attr("data-date", (d, i) => d[0])
        .attr("data-gdp", (d, i) => d[1])
        .on("mouseover", (d) => {
          tooltip.attr("data-date", d[0]).attr("data-gdp", d[1]);
          tooltip.transition().duration(100).style("opacity", 0.9);
          tooltip
            .html(`${d[0]}<br>$${d[1]} Billion`)
            .style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY - 20 + "px");
        })
        .on("mouseout", (d) => {
          tooltip.transition().duration(100).style("opacity", 0);
        });

      // add axes
      const xAxis = d3.axisBottom(timeScale);
      const yAxis = d3.axisLeft(yScale);

      graph
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${graphHeight})`)
        .call(xAxis);

      graph
        .append("g")
        .attr("id", "y-axis")
        // .attr("transform", "translate(" + margin.left + ", " + margin.top + ")") // move it 'padding' distance from the left
        .call(yAxis);
    });
});
