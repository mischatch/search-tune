import * as d3 from "d3";

export const width = 960;
export const height = 500;
export const force = d3.forceSimulation()
  .force("charge", d3.forceManyBody(-300))
  .force("link", d3.forceLink(50))
  .force("center", d3.forceCenter());

export const enterNode = (selection) => {
  selection.select('circle')
    .attr("r", (d) => d.size)
    .call(force.drag);

  selection.select('text')
    .attr("x", (d) => d.size + 5)
    .attr("dy", ".35em");
};

export const updateNode = (selection) => {
  selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

export const enterLink = (selection) => {
  selection.attr("stroke-width", (d) => d.size);
};

export const updateLink = (selection) => {
  selection.attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
};

export const updateGraph = (selection) => {
  selection.selectAll('.node')
    .call(updateNode);
  selection.selectAll('.link')
    .call(updateLink);
};
