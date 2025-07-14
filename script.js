// Global variables
let nodes = [];
let links = [];
let svg, simulation, zoom;

// Node descriptions for popup cards
const nodeDescriptions = {
    'OEC Platform': {
        category: 'System',
        title: 'OEC Platform',
        description: 'The Observatory of Economic Complexity (OEC) is a comprehensive data visualization platform that provides insights into global trade patterns, economic complexity, and development indicators through interactive visualizations and data analysis tools.'
    },
    'Data Entities': {
        category: 'Module',
        title: 'Data Entities',
        description: 'Core data structures that represent the fundamental entities in the economic complexity framework, including countries, products, trade relationships, and temporal dimensions.'
    },
    'UI Components': {
        category: 'Module',
        title: 'UI Components',
        description: 'Interactive visualization components that enable users to explore and understand complex economic data through various chart types, search tools, and dashboard interfaces.'
    },
    'Algorithms & Metrics': {
        category: 'Module',
        title: 'Algorithms & Metrics',
        description: 'Computational methods and quantitative indicators used to measure economic complexity, including Economic Complexity Index (ECI), Product Complexity Index (PCI), and data processing pipelines.'
    },
    'Theoretical Foundations': {
        category: 'Module',
        title: 'Theoretical Foundations',
        description: 'Conceptual frameworks and theoretical principles that underpin the economic complexity approach, including modularity theory and open access principles.'
    },
    'Countries': {
        category: 'Component',
        title: 'Countries',
        description: 'Geographic entities representing nations and territories that participate in global trade networks and economic activities.'
    },
    'Products': {
        category: 'Component',
        title: 'Products',
        description: 'Tradeable goods and services that are exchanged between countries, categorized according to international classification systems.'
    },
    'Trade Relationships': {
        category: 'Component',
        title: 'Trade Relationships',
        description: 'Bilateral and multilateral trade connections between countries, including import/export flows and trade agreements.'
    },
    'Time': {
        category: 'Component',
        title: 'Time',
        description: 'Temporal dimension that captures the evolution of trade patterns, economic complexity, and development indicators over different time periods.'
    },
    'Tree Maps': {
        category: 'Component',
        title: 'Tree Maps',
        description: 'Hierarchical visualization technique that displays nested data structures, commonly used to show product categories and trade relationships.'
    },
    'Network Diagrams': {
        category: 'Component',
        title: 'Network Diagrams',
        description: 'Graph-based visualizations that represent connections between entities, such as trade networks between countries or product relationships.'
    },
    'Search Tools': {
        category: 'Component',
        title: 'Search Tools',
        description: 'Interactive search and filtering capabilities that allow users to find specific countries, products, or trade relationships within the platform.'
    },
    'Dashboards': {
        category: 'Component',
        title: 'Dashboards',
        description: 'Comprehensive overview interfaces that aggregate multiple data views and metrics to provide holistic insights into economic complexity.'
    },
    'ECI': {
        category: 'Component',
        title: 'Economic Complexity Index (ECI)',
        description: 'A measure of the relative complexity of a country\'s export basket, indicating the diversity and sophistication of its economic activities.'
    },
    'PCI': {
        category: 'Component',
        title: 'Product Complexity Index (PCI)',
        description: 'A measure of the relative complexity of products, indicating the level of knowledge and capabilities required to produce them.'
    },
    'Data Pipelines': {
        category: 'Component',
        title: 'Data Pipelines',
        description: 'Automated processes for collecting, cleaning, transforming, and analyzing trade data to generate complexity metrics and visualizations.'
    },
    'Economic Complexity Theory': {
        category: 'Component',
        title: 'Economic Complexity Theory',
        description: 'Theoretical framework that explains how countries develop by accumulating productive knowledge and capabilities through diversification of their economic activities.'
    },
    'Modularity': {
        category: 'Component',
        title: 'Modularity',
        description: 'Design principle that emphasizes the organization of complex systems into independent, interchangeable modules that can be developed and maintained separately.'
    },
    'Open Access': {
        category: 'Component',
        title: 'Open Access',
        description: 'Principle of making research data, tools, and findings freely available to the public, promoting transparency and collaborative development.'
    }
};

// Function to get relationship descriptions
function getRelationshipDescription(type) {
    const descriptions = {
        'hierarchy': 'Hierarchical relationship (contains/is part of)',
        'dataflow': 'Data flows from source to target',
        'functional': 'Functional dependency between components',
        'theoretical': 'Theoretical guidance and support',
        'interaction': 'Interactive relationship between components',
        'association': 'Semantic or structural association',
        'conceptual': 'Conceptual relationship between ideas'
    };
    return descriptions[type] || 'Unknown relationship type';
}

function initD3JS() {
    const container = document.getElementById('d3-canvas');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Set up SVG with zoom support
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('cursor', 'grab');

    // Create zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', zoomed)
        .on('start', () => svg.style('cursor', 'grabbing'))
        .on('end', () => svg.style('cursor', 'grab'));

    // Apply zoom to SVG
    svg.call(zoom);

    // Create main group for all elements
    const g = svg.append('g');

    // Create defs for gradients and filters
    const defs = svg.append('defs');
    
    // Create arrow markers for different relationship types
    const relationshipTypes = ['hierarchy', 'dataflow', 'functional', 'theoretical', 'interaction', 'association', 'conceptual'];
    const relationshipColors = ['#1f77b4', '#ff7f0e', '#9467bd', '#2ca02c', '#d62728', '#17becf', '#8c564b'];
    
    const arrowMarkers = defs.selectAll('.arrow-marker')
        .data(relationshipTypes)
        .enter().append('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible');
    
    arrowMarkers.append('path')
        .attr('d', 'M 0,-4 L 8 ,0 L 0,4')
        .attr('fill', (d, i) => relationshipColors[i])
        .attr('stroke', 'none');
    
    // Create gradients for nodes
    const nodeGradients = defs.selectAll('.node-gradient')
        .data([0, 1, 2, 3, 4])
        .enter().append('linearGradient')
        .attr('id', d => `node-gradient-${d}`)
        .attr('class', 'node-gradient')
        .attr('gradientUnits', 'objectBoundingBox')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
    
    nodeGradients.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d => {
            const colors = ['#4a4a4a', '#1a75ff', '#ff9933', '#b366ff', '#66cc66'];
            return colors[d];
        });
    
    nodeGradients.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d => {
            const colors = ['#2a2a2a', '#0052cc', '#e67300', '#9933cc', '#4d994d'];
            return colors[d];
        });

    // Create filter for node shadows
    const filter = defs.append('filter')
        .attr('id', 'node-shadow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    
    filter.append('feDropShadow')
        .attr('dx', '0')
        .attr('dy', '3')
        .attr('stdDeviation', '6')
        .attr('flood-opacity', '0.2');

    // Create ontological analysis data structure with optimized sizing
    nodes = [
        // System center
        { id: 'OEC Platform', group: 0, level: 1, radius: 35, x: width / 2, y: height / 2 },
        
        // Module layer - positioned in a circle around center
        { id: 'Data Entities', group: 1, level: 2, radius: 25, x: width / 2 - 200, y: height / 2 - 150 },
        { id: 'UI Components', group: 2, level: 2, radius: 25, x: width / 2 + 200, y: height / 2 - 150 },
        { id: 'Algorithms & Metrics', group: 3, level: 2, radius: 25, x: width / 2 + 200, y: height / 2 + 150 },
        { id: 'Theoretical Foundations', group: 4, level: 2, radius: 25, x: width / 2 - 200, y: height / 2 + 150 },
        
        // Component layer - Data Entities
        { id: 'Countries', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 - 250 },
        { id: 'Products', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 - 100 },
        { id: 'Trade Relationships', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 + 50 },
        { id: 'Time', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 + 200 },
        
        // Component layer - UI Components
        { id: 'Tree Maps', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 - 250 },
        { id: 'Network Diagrams', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 - 100 },
        { id: 'Search Tools', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 + 50 },
        { id: 'Dashboards', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 + 200 },
        
        // Component layer - Algorithms & Metrics
        { id: 'ECI', group: 3, level: 3, radius: 18, x: width / 2 + 100, y: height / 2 + 300 },
        { id: 'PCI', group: 3, level: 3, radius: 18, x: width / 2 + 200, y: height / 2 + 300 },
        { id: 'Data Pipelines', group: 3, level: 3, radius: 18, x: width / 2 + 300, y: height / 2 + 300 },
        
        // Component layer - Theoretical Foundations
        { id: 'Economic Complexity Theory', group: 4, level: 3, radius: 18, x: width / 2 - 100, y: height / 2 + 300 },
        { id: 'Modularity', group: 4, level: 3, radius: 18, x: width / 2 - 200, y: height / 2 + 300 },
        { id: 'Open Access', group: 4, level: 3, radius: 18, x: width / 2 - 300, y: height / 2 + 300 }
    ];

    links = [
        // System to modules (hierarchy)
        { source: 'OEC Platform', target: 'Data Entities', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'UI Components', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'Algorithms & Metrics', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'Theoretical Foundations', value: 2, type: 'hierarchy', color: '#1f77b4' },
        
        // Modules to components (hierarchy)
        { source: 'Data Entities', target: 'Countries', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Products', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Trade Relationships', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Time', value: 1, type: 'hierarchy', color: '#1f77b4' },
        
        { source: 'UI Components', target: 'Tree Maps', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Network Diagrams', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Search Tools', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Dashboards', value: 1, type: 'hierarchy', color: '#1f77b4' },
        
        { source: 'Algorithms & Metrics', target: 'ECI', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Algorithms & Metrics', target: 'PCI', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Algorithms & Metrics', target: 'Data Pipelines', value: 1, type: 'hierarchy', color: '#1f77b4' },
        
        { source: 'Theoretical Foundations', target: 'Economic Complexity Theory', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Theoretical Foundations', target: 'Modularity', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Theoretical Foundations', target: 'Open Access', value: 1, type: 'hierarchy', color: '#1f77b4' },
        
        // Cross-module relationships
        { source: 'Data Entities', target: 'Algorithms & Metrics', value: 1.5, type: 'dataflow', color: '#ff7f0e' },
        { source: 'Algorithms & Metrics', target: 'UI Components', value: 1.5, type: 'functional', color: '#9467bd' },
        { source: 'Theoretical Foundations', target: 'Algorithms & Metrics', value: 1.5, type: 'theoretical', color: '#2ca02c' },
        { source: 'UI Components', target: 'Data Entities', value: 1.5, type: 'interaction', color: '#d62728' },
        
        // Component relationships
        { source: 'Countries', target: 'Products', value: 1, type: 'association', color: '#17becf' },
        { source: 'Countries', target: 'Trade Relationships', value: 1, type: 'association', color: '#17becf' },
        { source: 'Products', target: 'Trade Relationships', value: 1, type: 'association', color: '#17becf' },
        { source: 'ECI', target: 'PCI', value: 1, type: 'functional', color: '#9467bd' },
        { source: 'Economic Complexity Theory', target: 'Modularity', value: 1, type: 'theoretical', color: '#2ca02c' },
        { source: 'Modularity', target: 'Open Access', value: 1, type: 'conceptual', color: '#8c564b' },
        { source: 'Dashboards', target: 'Search Tools', value: 1, type: 'interaction', color: '#d62728' },
        { source: 'Data Pipelines', target: 'Algorithms & Metrics', value: 1, type: 'dataflow', color: '#ff7f0e' }
    ];

    // Create custom color scale
    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4])
        .range(['#4a4a4a', '#1a75ff', '#ff9933', '#b366ff', '#66cc66']);

    // Create simulation with better force parameters
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.value * 80))
        .force('charge', d3.forceManyBody().strength(d => d.level === 1 ? -800 : d.level === 2 ? -400 : -200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 10))
        .force('x', d3.forceX().strength(0.1))
        .force('y', d3.forceY().strength(0.1));

    // Create links with better styling
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter().append('path')
        .attr('stroke', d => d.color)
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => d.value * 1.2)
        .attr('fill', 'none')
        .attr('stroke-linecap', 'round')
        .attr('marker-end', d => `url(#arrow-${d.type})`)
        .style('filter', 'url(#node-shadow)')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('stroke-opacity', 1)
                .attr('stroke-width', d.value * 2);
            
            // Show tooltip
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
            
            tooltip.html(getRelationshipDescription(d.type))
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', d.value * 1.2);
            
            d3.select('.tooltip').remove();
        });

    // Create nodes as circles with better styling
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => `url(#node-gradient-${d.group})`)
        .attr('stroke', 'none')
        .attr('stroke-width', 0)
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.radius * 1.15);
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.radius);
        })
        .on('click', function(event, d) {
            showNodeDescription(d);
        });

    // Add text labels to nodes
    const label = g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', d => d.level === 1 ? '12px' : d.level === 2 ? '10px' : '8px')
        .attr('font-weight', '600')
        .style('pointer-events', 'none')
        .style('text-shadow', '1px 1px 2px rgba(0, 0, 0, 0.5)')
        .style('user-select', 'none')
        .text(d => d.id);

    // Update positions on simulation tick
    simulation.on('tick', () => {
        link.attr('d', d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate start and end points at node edges
            const sourceRadius = d.source.radius;
            const targetRadius = d.target.radius;
            
            const startX = d.source.x + (dx / dr) * sourceRadius;
            const startY = d.source.y + (dy / dr) * sourceRadius;
            const endX = d.target.x - (dx / dr) * targetRadius;
            const endY = d.target.y - (dy / dr) * targetRadius;
            
            return `M ${startX},${startY} L ${endX},${endY}`;
        });

        // Update node positions
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);

        // Update label positions
        label.attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // Create legend
    const legendData = [
        { type: 'hierarchy', color: '#1f77b4', label: 'Hierarchy' },
        { type: 'dataflow', color: '#ff7f0e', label: 'Data Flow' },
        { type: 'functional', color: '#9467bd', label: 'Functional' },
        { type: 'theoretical', color: '#2ca02c', label: 'Theoretical' },
        { type: 'interaction', color: '#d62728', label: 'Interaction' },
        { type: 'association', color: '#17becf', label: 'Association' },
        { type: 'conceptual', color: '#8c564b', label: 'Conceptual' }
    ];
    
    const legendGroup = g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(20, 20)');
    
    // Add legend background with better styling
    legendGroup.append('rect')
        .attr('width', 200)
        .attr('height', legendData.length * 28 + 35)
        .attr('rx', 12)
        .attr('ry', 12)
        .attr('fill', 'rgba(255, 255, 255, 0.98)')
        .attr('stroke', 'rgba(0, 0, 0, 0.08)')
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0 6px 20px rgba(0,0,0,0.15))')
        .style('backdrop-filter', 'blur(10px)');
    
    // Add legend title with better styling
    legendGroup.append('text')
        .attr('x', 100)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('fill', '#2a2a2a')
        .attr('font-family', 'Inter, sans-serif')
        .text('Relationship Types');
    
    // Add legend items
    legendGroup.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(20, ${40 + i * 28})`);
    
    // Add colored lines for each legend item with better styling
    legendGroup.selectAll('.legend-item')
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 25)
        .attr('y2', 0)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3.5)
        .attr('stroke-linecap', 'round')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    
    // Add arrow markers to legend lines
    legendGroup.selectAll('.legend-item')
        .append('path')
        .attr('d', 'M 25,0 L 20,-4 L 20,4')
        .attr('fill', d => d.color)
        .attr('stroke', 'none')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    
    // Add labels for each legend item with better styling
    legendGroup.selectAll('.legend-item')
        .append('text')
        .attr('x', 35)
        .attr('y', 4)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#4a4a4a')
        .attr('font-family', 'Inter, sans-serif')
        .text(d => d.label);

    // Zoom function
    function zoomed(event) {
        g.attr('transform', event.transform);
    }

    // Double-click to reset zoom
    svg.on('dblclick', function(event) {
        event.preventDefault();
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    });

    // Drag functions
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
    
    // Popup card function
    function showNodeDescription(node) {
        const description = nodeDescriptions[node.id];
        if (!description) return;
        
        // Remove existing popup
        d3.select('.node-popup').remove();
        
        // Get canvas container
        const canvasContainer = document.getElementById('d3-canvas');
        const canvasRect = canvasContainer.getBoundingClientRect();
        
        // Calculate popup position within canvas
        const popupWidth = 400;
        const popupHeight = 300;
        let popupX = node.x + 20; // Offset from node
        let popupY = node.y - popupHeight / 2;
        
        // Ensure popup stays within canvas bounds
        if (popupX + popupWidth > canvasRect.width) {
            popupX = node.x - popupWidth - 20;
        }
        if (popupY < 0) {
            popupY = 10;
        }
        if (popupY + popupHeight > canvasRect.height) {
            popupY = canvasRect.height - popupHeight - 10;
        }
        
        // Create popup container within canvas
        const popup = d3.select('#d3-canvas')
            .append('div')
            .attr('class', 'node-popup')
            .style('position', 'absolute')
            .style('top', popupY + 'px')
            .style('left', popupX + 'px')
            .style('background', 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)')
            .style('border-radius', '15px')
            .style('padding', '20px')
            .style('box-shadow', '0 15px 40px rgba(0, 0, 0, 0.2)')
            .style('width', popupWidth + 'px')
            .style('z-index', '1000')
            .style('border', '1px solid rgba(255, 255, 255, 0.3)')
            .style('backdrop-filter', 'blur(10px)')
            .style('animation', 'popupFadeIn 0.3s ease-out')
            .style('pointer-events', 'auto');
        
        // Add category badge
        popup.append('div')
            .attr('class', 'popup-category')
            .style('background', 'linear-gradient(135deg, #ff9933 0%, #ff8c00 100%)')
            .style('color', 'white')
            .style('padding', '6px 12px')
            .style('border-radius', '15px')
            .style('font-size', '10px')
            .style('font-weight', '600')
            .style('display', 'block')
            .style('text-align', 'center')
            .style('margin-bottom', '12px')
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '0.5px')
            .text(description.category);
        
        // Add title
        popup.append('h3')
            .attr('class', 'popup-title')
            .style('font-size', '18px')
            .style('font-weight', '700')
            .style('color', '#2a2a2a')
            .style('margin-bottom', '12px')
            .style('line-height', '1.3')
            .style('text-align', 'center')
            .text(description.title);
        
        // Add description
        popup.append('p')
            .attr('class', 'popup-description')
            .style('font-size', '13px')
            .style('line-height', '1.5')
            .style('color', '#4a4a4a')
            .style('margin-bottom', '15px')
            .style('max-height', '120px')
            .style('overflow-y', 'auto')
            .style('text-align', 'center')
            .text(description.description);
        
        // Add close button
        popup.append('button')
            .attr('class', 'popup-close')
            .style('background', 'linear-gradient(135deg, #ff9933 0%, #ff8c00 100%)')
            .style('color', 'white')
            .style('border', 'none')
            .style('padding', '8px 16px')
            .style('border-radius', '20px')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('cursor', 'pointer')
            .style('transition', 'all 0.3s ease')
            .style('box-shadow', '0 4px 15px rgba(255, 140, 0, 0.3)')
            .style('display', 'block')
            .style('margin', '0 auto')
            .text('×')
            .on('click', () => {
                popup.remove();
            })
            .on('mouseover', function() {
                d3.select(this)
                    .style('transform', 'scale(1.1)')
                    .style('box-shadow', '0 6px 20px rgba(255, 140, 0, 0.4)');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style('transform', 'scale(1)')
                    .style('box-shadow', '0 4px 15px rgba(255, 140, 0, 0.3)');
            });
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.node-popup') && !event.target.closest('.nodes circle')) {
            d3.select('.node-popup').remove();
        }
    });
}

// Handle window resize
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

// Initialize D3.js when page loads
document.addEventListener('DOMContentLoaded', function() {
    initD3JS();
});

// --- D3 Sankey Diagram for Historical Context & Intent Tab ---
let sankeyRendered = false;
function renderSankeyDiagram() {
    if (sankeyRendered) return;
    sankeyRendered = true;
    const container = document.getElementById('d3-canvas-historical');
    if (!container) return;
    container.innerHTML = '';
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // --- Sankey Data ---
    const nodes = [
      { name: "Economic Complexity Theory" },
      { name: "Complex Systems Thinking" },
      { name: "D3.js" },
      { name: "Open Source Visualization" },
      { name: "Open Data Movement" },
      { name: "Post-2008 Globalization Rethink" },
      { name: "Harvard CID" },
      { name: "Ricardo Hausmann" },
      { name: "César Hidalgo" },
      { name: "OEC Platform" },
      { name: "Tree Maps" },
      { name: "Network Diagrams" },
      { name: "ECI" },
      { name: "PCI" }
    ];
    const links = [
      { source: 0, target: 9, value: 2 },
      { source: 1, target: 0, value: 1 },
      { source: 2, target: 9, value: 2 },
      { source: 3, target: 2, value: 1 },
      { source: 4, target: 9, value: 2 },
      { source: 5, target: 4, value: 1 },
      { source: 6, target: 9, value: 2 },
      { source: 7, target: 0, value: 1 },
      { source: 8, target: 0, value: 1 },
      { source: 9, target: 10, value: 1 },
      { source: 9, target: 11, value: 1 },
      { source: 9, target: 12, value: 1 },
      { source: 9, target: 13, value: 1 }
    ];

    // --- Sankey Setup ---
    const sankey = d3.sankey()
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const sankeyData = {
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    };

    const {nodes: sankeyNodes, links: sankeyLinks} = sankey(sankeyData);

    // --- SVG ---
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // --- Links ---
    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(sankeyLinks)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', '#aaa')
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('opacity', 0.5);

    // --- Nodes ---
    const node = svg.append('g')
      .selectAll('g')
      .data(sankeyNodes)
      .join('g');

    node.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#888')
      .attr('stroke', '#222')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 2);
        tooltip.style('display', 'block')
          .html(`<strong>${d.name}</strong>`);
      })
      .on('mousemove', function(event) {
        tooltip.style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke', '#222')
          .attr('stroke-width', 1);
        tooltip.style('display', 'none');
      });

    node.append('text')
      .attr('x', d => d.x0 + (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('fill', '#fff')
      .attr('pointer-events', 'none')
      .text(d => d.name);

    // --- Tooltip ---
    const tooltip = d3.select('body').append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(30,30,30,0.95)')
      .style('color', '#fff')
      .style('padding', '8px 14px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('pointer-events', 'none')
      .style('z-index', '10000')
      .style('display', 'none');

    // --- Caption ---
    d3.select(container)
      .append('div')
      .attr('class', 'sankey-caption')
      .style('margin', '18px auto 0 auto')
      .style('max-width', '700px')
      .style('font-size', '1.05rem')
      .style('color', '#444')
      .style('text-align', 'center')
      .text('This Sankey diagram visualizes the historical and contextual influences that led to the creation of the Observatory of Economic Complexity (OEC).');
}

// Tab switching function
function openTab(tabName, event) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to the clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Reinitialize D3.js if switching to the structural-conceptual tab
    if (tabName === 'structural-conceptual') {
        setTimeout(() => {
            initD3JS();
        }, 100);
    }
}

// Patch openTab to render Sankey when historical-context is opened
const originalOpenTab = window.openTab;
window.openTab = function(tabName, event) {
    if (originalOpenTab) originalOpenTab(tabName, event);
    if (tabName === 'historical-context') {
        renderSankeyDiagram();
    }
};

// Menu toggle function
function toggleMenu() {
    const circleMenu = document.getElementById('circleMenu');
    circleMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const circleMenu = document.getElementById('circleMenu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (!circleMenu.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        circleMenu.classList.remove('active');
    }
}); 