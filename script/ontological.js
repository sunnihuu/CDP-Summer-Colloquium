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

let links = [
  // Main branches
  { source: 'OEC', target: 'Datasets' },
  { source: 'OEC', target: 'VisualModules' },
  { source: 'OEC', target: 'ComputationalModels' },
  { source: 'OEC', target: 'UserInterfaces' },
  { source: 'OEC', target: 'MetadataInfra' },
  // Datasets
  { source: 'Datasets', target: 'BilateralTrade' },
  { source: 'Datasets', target: 'ProductClassification' },
  { source: 'Datasets', target: 'TemporalLayers' },
  { source: 'Datasets', target: 'NationalIndicators' },
  // Visual Modules
  { source: 'VisualModules', target: 'Treemaps' },
  { source: 'VisualModules', target: 'Sankey' },
  { source: 'VisualModules', target: 'ProductSpace' },
  { source: 'VisualModules', target: 'StackedArea' },
  { source: 'VisualModules', target: 'InteractiveMaps' },
  // Computational Models
  { source: 'ComputationalModels', target: 'ECI' },
  { source: 'ComputationalModels', target: 'ProductSpaceModel' },
  // User Interfaces
  { source: 'UserInterfaces', target: 'Dropdowns' },
  { source: 'UserInterfaces', target: 'Tooltips' },
  { source: 'UserInterfaces', target: 'MultiLang' },
  // Metadata/Infra
  { source: 'MetadataInfra', target: 'API' },
  { source: 'MetadataInfra', target: 'Education' }
];

let svg, simulation, zoom;

// Node descriptions for popup cards
const nodeDescriptions = { /* ... (copy the full nodeDescriptions object from script.js) ... */ };

function getRelationshipDescription(type) { /* ... (copy function from script.js) ... */ }

// Define a unified color palette for all diagrams
const unifiedPalette = [
  '#8E7CC3', // Global Context
  '#3A86FF', // OEC Development
  '#23C16B', // Academic & Theory
  '#FFD600', // Visualization & Interface
  '#FF8C00', // User Interfaces
  '#00BFC4'  // Metadata & Infra
];

function initD3JS() {
  const width = document.getElementById('d3-canvas').clientWidth;
  const height = document.getElementById('d3-canvas').clientHeight;

  d3.select('#d3-canvas').selectAll('*').remove();
  svg = d3.select('#d3-canvas')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(90).strength(1))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(40));

  const link = svg.append('g')
    .attr('stroke', '#bbb')
    .attr('stroke-width', 2)
    .selectAll('line')
    .data(links)
    .enter().append('line');

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 28)
    .attr('fill', d => unifiedPalette[d.group])
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  const label = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 4)
    .attr('font-size', 13)
    .attr('font-family', 'Inter, Arial, sans-serif')
    .attr('pointer-events', 'none')
    .text(d => d.label);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
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