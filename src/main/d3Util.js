import * as d3 from "d3";

export const width = 960;
export const height = 500;
export const color = d3.scaleOrdinal(d3.schemeCategory10);
export const force = d3.forceSimulation()
  .force("link", d3.forceLink().id((d) => { return d.id; }))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collide", d3.forceCollide([5]).iterations([5]));

export const enterNode = (selection) => {
  selection.select('circle')
    .style("fill", (d) => { return color(d.name); })
    .attr("r", 30)
    .call(drag);

  selection.select('text')
    .attr("x", (d) => d.size + 5)
    .attr("dy", ".35em")
    .style("transform", "translateX(-50%,-50%");
};

export const drag = () => {
    d3.selectAll('g')
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));
};

function dragStarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;

}

function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragEnded(d) {
    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

export const updateNode = (selection) => {
  selection
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
};

export const enterLink = (selection) => {
  selection
    .attr("stroke-width", 2)
    .style("opacity", ".2");
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
    .call(updateNode)
    .call(drag);
  selection.selectAll('.link')
    .call(updateLink);
};
