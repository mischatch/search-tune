import * as d3 from "d3";

export const width = 960;
export const height = 500;
export const color = d3.scaleOrdinal(d3.schemeCategory10);
// export const force = d3.forceSimulation();

export const enterNode = (selection) => {
  selection.select('circle')
    .style("fill", "#ff6d2c"/*(d) => { return color(d.name); }*/)
    .attr("r", 30);


  selection.select('text')
    .attr("dy", ".35em")
    .style("transform", "translateX(-50%,-50%");
};

export const updateNode = (selection) => {
  selection
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

export const enterLink = (selection) => {
  selection
    .attr("stroke-width", 2)
    .style("stroke","#ff6d2c")
    .style("opacity", "0.3");
};

export const updateLink = (selection) => {
  selection
    .attr("x1", (d) => d.source.x)
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
