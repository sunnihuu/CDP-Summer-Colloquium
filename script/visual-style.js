// D3.js Force-directed graph for Visual Language & Style

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('d3-canvas-style');
  if (container) {
    // Clear any previous content
    container.innerHTML = '';
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    
    // Updated Data
    const data = {
      nodes: [
        { id: "Visual Language & Style", group: 0 },
        { id: "Visual Encoding", group: 1 },
        { id: "Color", group: 1 },
        { id: "Size", group: 1 },
        { id: "Position", group: 1 },
        { id: "Shape", group: 1 },
        { id: "Info Hierarchy & Legibility", group: 2 },
        { id: "Highlighting Important Info", group: 2 },
        { id: "Grouping & Layout", group: 2 },
        { id: "Typography & Alignment", group: 2 },
        { id: "Interaction Design", group: 3 },
        { id: "Tooltip / Hover", group: 3 },
        { id: "Dropdown / Filters", group: 3 },
        { id: "Responsive Behavior", group: 3 },
        { id: "Aesthetic Style", group: 4 },
        { id: "Minimal vs Dense", group: 4 },
        { id: "Technical vs Narrative", group: 4 },
        { id: "Color & Typography Style", group: 4 },
        { id: "Design Consistency", group: 5 },
        { id: "Color Consistency", group: 5 },
        { id: "Component System", group: 5 },
        { id: "Ideological / Cultural Framing", group: 6 },
        { id: "Neutrality / Techno-optimism", group: 6 },
        { id: "Avoidance of Symbols", group: 6 }
      ],
      links: [
        { source: "Visual Language & Style", target: "Visual Encoding" },
        { source: "Visual Encoding", target: "Color" },
        { source: "Visual Encoding", target: "Size" },
        { source: "Visual Encoding", target: "Position" },
        { source: "Visual Encoding", target: "Shape" },
        { source: "Visual Language & Style", target: "Info Hierarchy & Legibility" },
        { source: "Info Hierarchy & Legibility", target: "Highlighting Important Info" },
        { source: "Info Hierarchy & Legibility", target: "Grouping & Layout" },
        { source: "Info Hierarchy & Legibility", target: "Typography & Alignment" },
        { source: "Visual Language & Style", target: "Interaction Design" },
        { source: "Interaction Design", target: "Tooltip / Hover" },
        { source: "Interaction Design", target: "Dropdown / Filters" },
        { source: "Interaction Design", target: "Responsive Behavior" },
        { source: "Visual Language & Style", target: "Aesthetic Style" },
        { source: "Aesthetic Style", target: "Minimal vs Dense" },
        { source: "Aesthetic Style", target: "Technical vs Narrative" },
        { source: "Aesthetic Style", target: "Color & Typography Style" },
        { source: "Visual Language & Style", target: "Design Consistency" },
        { source: "Design Consistency", target: "Color Consistency" },
        { source: "Design Consistency", target: "Component System" },
        { source: "Visual Language & Style", target: "Ideological / Cultural Framing" },
        { source: "Ideological / Cultural Framing", target: "Neutrality / Techno-optimism" },
        { source: "Ideological / Cultural Framing", target: "Avoidance of Symbols" }
      ]
    };

    // Replace groupColors with unifiedPalette from ontological.js
    const unifiedPalette = [
      '#8E7CC3', // Global Context
      '#3A86FF', // OEC Development
      '#23C16B', // Academic & Theory
      '#FFD600', // Visualization & Interface
      '#FF8C00', // User Interfaces
      '#00BFC4', // Metadata & Infra
      '#FF5CA7'  // New: Additional group (Pink/Magenta)
    ];

    // Create SVG styled as a canvas
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'd3-canvas-svg')
      .attr('fill', 'none');

    // Add zoom and pan
    const zoomContainer = svg.append('g');
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        zoomContainer.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = zoomContainer.append("g")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(data.links)
      .enter().append("line");

    // Draw nodes as boxes (cards) instead of circles
    const node = zoomContainer.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(drag(simulation));

    node.each(function(d) {
      // Create a text element first to measure its width
      const text = d3.select(this)
        .append("text")
        .text(d.id)
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .attr("font-size", 13)
        .attr("font-family", "sans-serif")
        .style("fill", "black")
        .style("paint-order", "stroke")
        .style("stroke", "none");
      // Use the DOM to measure the text width and height
      const bbox = text.node().getBBox();
      const paddingX = 14;
      const paddingY = 8;
      // Draw a rounded rectangle behind the text
      d3.select(this)
        .insert("rect", "text")
        .attr("x", -bbox.width/2 - paddingX)
        .attr("y", -bbox.height/2 - paddingY/2)
        .attr("width", bbox.width + 2*paddingX)
        .attr("height", bbox.height + paddingY)
        .attr("rx", 12)
        .attr("ry", 12)
        .attr("fill", unifiedPalette[d.group])
        .attr("stroke", "var(--neutral-gray)")
        .attr("stroke-width", 1.5)
        .style("filter", "drop-shadow(0 2px 8px rgba(0,0,0,0.13))");
      // Vertically center the text in the box
      text
        .attr("y", bbox.height/2 - 2)
        .style("fill", "var(--primary-dark)");
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
      return d3.drag()
        .on("start", function (event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", function (event, d) {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", function (event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });
    }
  }
}); 