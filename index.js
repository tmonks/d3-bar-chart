// convert "yyyy-mm-dd" to "yyyy Qx"
const dateToQuarter = (date) => {
  let year = date.substring(0, 4);
  let month = date.substring(5, 7);
  let quarters = { "01": "Q1", "04": "Q2", "07": "Q3", "10": "Q4" };
  return year + " " + quarters[month];
};

// margins and dimensions
const w = 800;
const h = 500;
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const graphWidth = w - margin.left - margin.right;
const graphHeight = h - margin.top - margin.bottom;

// main svg
const svg = d3.select(".canvas").append("svg").attr("width", w).attr("height", h);

// create graph area
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .style("border", "1px solid blue")
  .attr("transform", `translate(${margin.left}, ${margin.top})`); // move it by margin sizes

// tool tip div
const tooltip = d3.select(".canvas").append("div").attr("id", "tooltip").style("opacity", 0);

// title
graph
  .append("text")
  .attr("id", "title")
  .attr("x", graphWidth / 2 - 20)
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

      // calculate the highest GDP value
      const maxY = d3.max(dataset, (d) => d[1]);

      // define the xScale using dates
      const timeScale = d3.scaleTime().domain([minDate, maxDate]).range([0, graphWidth]);
      const yScale = d3.scaleLinear().domain([0, maxY]).range([graphHeight, 0]);

      // graph bars
      graph
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => timeScale(new Date(d[0])))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", graphWidth / dataset.length)
        .attr("height", (d) => graphHeight - yScale(d[1]))
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover", (d) => {
          tooltip.attr("data-date", d[0]).attr("data-gdp", d[1]);
          tooltip.transition().duration(100).style("opacity", 0.9);
          tooltip
            .html(`${dateToQuarter(d[0])}<br>$${d[1]} Billion`)
            // place tooltip to the upper-right of the mouse cursor
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

      graph.append("g").attr("id", "y-axis").call(yAxis);
    });
});
