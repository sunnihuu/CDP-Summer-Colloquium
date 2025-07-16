// Ontological Analysis D3 Network Diagram
// Global variables
let nodes = [
{ id: 'OEC', group: 0, label: 'OEC Platform' },
{ id: 'Datasets', group: 1, label: 'Datasets' },
  { id: 'VisualModules', group: 2, label: 'Visual Modules' },
  { id: 'ComputationalModels', group: 3, label: 'Computational Models' },
  { id: 'UserInterfaces', group: 4, label: 'User Interfaces' },
  { id: 'MetadataInfra', group: 5, label: 'Metadata & Infrastructure' },
  // Datasets sub-nodes
  { id: 'BilateralTrade', group: 1, label: 'Bilateral trade data' },
  { id: 'ProductClassification', group: 1, label: 'Product classification (HS codes)' },
  { id: 'TemporalLayers', group: 1, label: 'Temporal layers' },
  { id: 'NationalIndicators', group: 1, label: 'National economic indicators' },
  // Visual Modules sub-nodes
  { id: 'Treemaps', group: 2, label: 'Treemaps' },
  { id: 'Sankey', group: 2, label: 'Sankey diagrams' },
  { id: 'ProductSpace', group: 2, label: 'Product Space maps' },
  { id: 'StackedArea', group: 2, label: 'Stacked area charts' },
  { id: 'InteractiveMaps', group: 2, label: 'Interactive maps' },
  // Computational Models sub-nodes
  { id: 'ECI', group: 3, label: 'Economic Complexity Index (ECI)' },
  { id: 'ProductSpaceModel', group: 3, label: 'Product Space model' },
  // User Interfaces sub-nodes
  { id: 'Dropdowns', group: 4, label: 'Drop-down filters' },
  { id: 'Tooltips', group: 4, label: 'Hover tooltips & clickable nodes' },
  { id: 'MultiLang', group: 4, label: 'Multi-language support' },
  // Metadata/Infra sub-nodes
  { id: 'API', group: 5, label: 'Open access API & downloads' },
  { id: 'Education', group: 5, label: 'Educational content' }
];

// Define link types for coloring
let links = [
  // Main branches
  { source: 'OEC', target: 'Datasets', type: 'main' },
  { source: 'OEC', target: 'VisualModules', type: 'main' },
  { source: 'OEC', target: 'ComputationalModels', type: 'main' },
  { source: 'OEC', target: 'UserInterfaces', type: 'main' },
  { source: 'OEC', target: 'MetadataInfra', type: 'main' },
  // Datasets
  { source: 'Datasets', target: 'BilateralTrade', type: 'sub' },
  { source: 'Datasets', target: 'ProductClassification', type: 'sub' },
  { source: 'Datasets', target: 'TemporalLayers', type: 'sub' },
  { source: 'Datasets', target: 'NationalIndicators', type: 'sub' },
  // Visual Modules
  { source: 'VisualModules', target: 'Treemaps', type: 'sub' },
  { source: 'VisualModules', target: 'Sankey', type: 'sub' },
  { source: 'VisualModules', target: 'ProductSpace', type: 'sub' },
  { source: 'VisualModules', target: 'StackedArea', type: 'sub' },
  { source: 'VisualModules', target: 'InteractiveMaps', type: 'sub' },
  // Computational Models
  { source: 'ComputationalModels', target: 'ECI', type: 'sub' },
  { source: 'ComputationalModels', target: 'ProductSpaceModel', type: 'sub' },
  // User Interfaces
  { source: 'UserInterfaces', target: 'Dropdowns', type: 'sub' },
  { source: 'UserInterfaces', target: 'Tooltips', type: 'sub' },
  { source: 'UserInterfaces', target: 'MultiLang', type: 'sub' },
  // Metadata/Infra
  { source: 'MetadataInfra', target: 'API', type: 'sub' },
  { source: 'MetadataInfra', target: 'Education', type: 'sub' },
  // --- OEC-specific cross-links ---
  { source: 'ProductClassification', target: 'ProductSpace', type: 'cross' },
  { source: 'BilateralTrade', target: 'ECI', type: 'cross' },
  { source: 'Treemaps', target: 'InteractiveMaps', type: 'cross' },
  { source: 'API', target: 'UserInterfaces', type: 'cross' }
];

// Link color mapping
const linkColors = {
  main: '#bbb', // gray
  sub: '#3A86FF', // light blue
  cross: '#FF5CA7' // magenta
};

let svg, simulation, zoom;

// Node descriptions for popup cards
const nodeDescriptions = { /* ... (copy the full nodeDescriptions object from script.js) ... */ };

function getRelationshipDescription(type) { /* ... (copy function from script.js) ... */ }

// Define the color palette for Ontological Analysis
const unifiedPalette = [
  '#8E7CC3', // Global Context
  '#3A86FF', // OEC Development
  '#23C16B', // Academic & Theory
  '#FFD600', // Visualization & Interface
  '#FF8C00', // User Interfaces
  '#00BFC4'  // Metadata & Infra
];

// Color mapping for groups (copied from visual-style.js)
const groupColors = {
  0: '#222', // black/gray
  1: d3.schemeCategory10[0], // blue
  2: d3.schemeCategory10[1], // orange
  3: d3.schemeCategory10[2], // green
  4: d3.schemeCategory10[3], // purple
  5: d3.schemeCategory10[4], // red
  6: d3.schemeCategory10[7]  // brown
};

function initD3JS() {
  const width = document.getElementById('d3-canvas').clientWidth;
  const height = document.getElementById('d3-canvas').clientHeight;

  d3.select('#d3-canvas').selectAll('*').remove();
  svg = d3.select('#d3-canvas')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Add zoom and pan
  const container = svg.append('g');
  zoom = d3.zoom()
    .scaleExtent([0.2, 3])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });
  svg.call(zoom);

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(90).strength(1))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(40));

  const link = container.append('g')
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke', d => linkColors[d.type]);

  const node = container.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .selectAll('g')
    .data(nodes)
    .enter().append('g')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.each(function(d) {
    // Create a text element first to measure its width
    const isOEC = d.id === 'OEC';
    const text = d3.select(this)
      .append('text')
      .text(d.label)
      .attr('x', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', isOEC ? 20 : 13)
      .attr('font-family', 'Inter, Arial, sans-serif')
      .style('fill', 'var(--primary-dark)')
      .style('paint-order', 'stroke')
      .style('stroke', 'none');
    // Use the DOM to measure the text width and height
    const bbox = text.node().getBBox();
    const paddingX = isOEC ? 32 : 14;
    const paddingY = isOEC ? 18 : 8;
    // Draw a rounded rectangle behind the text
    d3.select(this)
      .insert('rect', 'text')
      .attr('x', -bbox.width/2 - paddingX)
      .attr('y', -bbox.height/2 - paddingY/2)
      .attr('width', bbox.width + 2*paddingX)
      .attr('height', bbox.height + paddingY)
      .attr('rx', isOEC ? 20 : 12)
      .attr('ry', isOEC ? 20 : 12)
      .attr('fill', unifiedPalette[d.group])
      .attr('stroke', 'var(--neutral-gray)')
      .attr('stroke-width', 1.5)
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.13))');
    // Vertically center the text in the box
    text
      .attr('y', bbox.height/2 - 2)
      .style('fill', 'var(--primary-dark)');
  });

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // English annotation with colored lines for each type
  const annotationItems = [
    { label: 'Main Branch', color: linkColors.main },
    { label: 'Sub-component', color: linkColors.sub },
    { label: 'OEC Cross-link', color: linkColors.cross }
  ];
  const annotationGroup = svg.append('g')
    .attr('class', 'color-annotation')
    .attr('transform', 'translate(8, 8)');
  // Background
  annotationGroup.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 180)
    .attr('height', 62)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', '#fff')
    .attr('fill-opacity', 0.92)
    .attr('stroke', '#eee')
    .attr('stroke-width', 1.2);
  // Colored lines and text
  annotationItems.forEach((item, i) => {
    annotationGroup.append('line')
      .attr('x1', 16)
      .attr('x2', 44)
      .attr('y1', 22 + i * 18)
      .attr('y2', 22 + i * 18)
      .attr('stroke-width', 4)
      .attr('stroke', item.color);
    annotationGroup.append('text')
      .attr('x', 52)
      .attr('y', 26 + i * 18)
      .attr('font-size', 14)
      .attr('fill', '#333')
      .text(item.label);
  });

  // --- Remove all legend code ---
  // (Do not append any legend group, rect, lines, or text)
  // (Remove any defs/gradient for legend)
  // (No legendData, legendX, legendY, legendWidth, legendHeight, etc.)
  // --- End legend removal ---
}

// Handle window resize for D3 canvas
window.addEventListener('resize', function() {
    if (svg) {
        const container = document.getElementById('d3-canvas');
        if (container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            svg.attr('width', width).attr('height', height);
            if (simulation) {
                simulation.force('center', d3.forceCenter(width / 2, height / 2));
                simulation.alpha(1).restart();
            }
            // Reset zoom to fit new dimensions
            if (zoom) {
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
                );
            }
        }
    }
}, false);

// Initialize D3.js when page loads (only if #d3-canvas exists)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('d3-canvas')) {
        initD3JS();
    }
}); 