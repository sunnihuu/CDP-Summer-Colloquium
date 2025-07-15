// Layered Timeline for Historical Context & Intent
if (document.getElementById('d3-canvas-historical')) {
    // Timeline data for four tracks
    const tracks = [
        {
            name: 'Global Context', color: '#8E7CC3',
            events: [
                { year: 2008, label: 'Global Financial Crisis', desc: 'Critique of GDP' },
                { year: 2010, label: 'Open Data Movement', desc: 'Transparency push' },
                { year: 2011, label: 'Release of D3.js', desc: 'Browser-based viz' },
                { year: 2015, label: 'UN SDGs', desc: 'Sustainable goals' },
                { year: 2020, label: 'COVID-19 pandemic', desc: 'Supply chain shocks' }
            ]
        },
        {
            name: 'OEC Development', color: '#3A86FF',
            events: [
                { year: 2009, label: 'ECI Proposed', desc: 'Hidalgo & Hausmann' },
                { year: 2011, label: 'OEC Launch', desc: 'Treemaps, Product Space' },
                { year: 2013, label: 'Interactive Features', desc: 'Downloadable data' },
                { year: 2015, label: 'Why Information Grows', desc: 'Public impact' },
                { year: 2017, label: 'Datawheel Created', desc: 'Platform expansion' },
                { year: 2019, label: 'Major Redesign', desc: 'Visuals & performance' },
                { year: 2024, label: 'API Release', desc: 'Embeddable charts' }
            ]
        },
        {
            name: 'Academic & Theory', color: '#23C16B',
            events: [
                { year: 2009, label: 'Building Blocks in PNAS', desc: '' },
                { year: 2011, label: 'Product Space Theory', desc: 'Network of knowledge' },
                { year: 2015, label: 'Why Information Grows', desc: 'Explains complexity' },
                { year: 2018, label: 'World Bank/UN Reference ECI', desc: '' },
                { year: 2022, label: 'OEC in Post-pandemic Studies', desc: '' }
            ]
        },
        {
            name: 'Visualization & Interface', color: '#FFD600',
            events: [
                { year: 2011, label: 'Treemaps, Stacked Area, Product Space', desc: '' },
                { year: 2013, label: 'Sankey Diagrams', desc: 'Export flows' },
                { year: 2017, label: 'Mobile Responsive', desc: 'Accessibility' },
                { year: 2019, label: 'Unified Visual Identity', desc: 'Datawheel platforms' },
                { year: 2024, label: 'Modular Viz & API', desc: 'Custom/embedded charts' }
            ]
        }
    ];
    const years = [2008, 2009, 2010, 2011, 2013, 2015, 2017, 2018, 2019, 2020, 2022, 2024];
    const margin = { top: 80, right: 40, bottom: 90, left: 60 };
    const trackHeight = 62;
    const height = margin.top + tracks.length * trackHeight + margin.bottom;
    const width = document.getElementById('d3-canvas-historical').clientWidth;

    d3.select('#d3-canvas-historical').selectAll('*').remove();
    const svg = d3.select('#d3-canvas-historical')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Draw year axis
    const x = d3.scaleLinear()
        .domain([2008, 2024])
        .range([margin.left, width - margin.right]);

    svg.append('g')
        .attr('transform', `translate(0,${margin.top - 30})`)
        .call(d3.axisTop(x).tickValues(years).tickFormat(d3.format('d')))
        .selectAll('text')
        .attr('font-size', 15)
        .attr('font-weight', 600);

    // Draw tracks with horizontal lines
    tracks.forEach((track, i) => {
        const y = margin.top + i * trackHeight;
        // Track line
        svg.append('line')
            .attr('x1', margin.left)
            .attr('x2', width - margin.right)
            .attr('y1', y)
            .attr('y2', y)
            .attr('stroke', track.color)
            .attr('stroke-width', 3)
            .attr('opacity', 0.18);
        // Events
        svg.selectAll(`.event-${i}`)
            .data(track.events)
            .enter()
            .append('circle')
            .attr('cx', d => x(d.year))
            .attr('cy', y)
            .attr('r', 16)
            .attr('fill', track.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.13))')
            .on('mouseover', function(event, d) {
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.year}</strong>: ${d.label}${d.desc ? '<br/><span style=\'font-size:13px;color:#666;\'>' + d.desc + '</span>' : ''}`)
                    .style('left', (event.pageX + 18) + 'px')
                    .style('top', (event.pageY - 18) + 'px');
                d3.select(this).attr('stroke', '#333').attr('stroke-width', 4);
                // Show annotation label near the dot
                svg.append('text')
                    .attr('class', 'event-annotation-temp')
                    .attr('x', x(d.year))
                    .attr('y', y + 34)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 13)
                    .attr('fill', '#222')
                    .attr('font-weight', 500)
                    .text(d.label);
            })
            .on('mousemove', function(event) {
                tooltip.style('left', (event.pageX + 18) + 'px')
                    .style('top', (event.pageY - 18) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
                d3.select(this).attr('stroke', '#fff').attr('stroke-width', 3);
                // Remove annotation label
                svg.selectAll('.event-annotation-temp').remove();
            });
        // Remove always-visible event labels
        // svg.selectAll(`.event-label-${i}`)
        //     .data(track.events)
        //     .enter()
        //     .append('text')
        //     .attr('x', d => x(d.year))
        //     .attr('y', y + 34)
        //     .attr('text-anchor', 'middle')
        //     .attr('font-size', 13)
        //     .attr('fill', '#222')
        //     .attr('font-weight', 500)
        //     .text(d => d.label);
    });

    // Optional: Speculative Future
    svg.append('text')
        .attr('x', x(2025) || (width - margin.right))
        .attr('y', margin.top + tracks.length * trackHeight + 10)
        .attr('font-size', 14)
        .attr('fill', '#888')
        .attr('font-style', 'italic')
        .text('2025 → ? Future: Will economic complexity gain traction in policy? How will visualization evolve?');

    // Add legend at bottom center
    const legendY = height - 38;
    const legend = svg.append('g')
        .attr('class', 'timeline-legend');
    // Calculate dynamic legend spacing
    const legendWidths = tracks.map(track => {
        // Estimate width: dot (22px) + label (track name, 9px per char + 10px padding)
        return 22 + track.name.length * 9 + 10;
    });
    const totalLegendWidth = legendWidths.reduce((a, b) => a + b, 0) + (tracks.length - 1) * 32;
    let legendStartX = width / 2 - totalLegendWidth / 2;
    let xPos = legendStartX;
    tracks.forEach((track, i) => {
        // Color dot
        legend.append('circle')
            .attr('cx', xPos + 11)
            .attr('cy', legendY)
            .attr('r', 11)
            .attr('fill', track.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2.5);
        // Label
        legend.append('text')
            .attr('x', xPos + 28)
            .attr('y', legendY + 5)
            .attr('font-size', 16)
            .attr('font-weight', 600)
            .attr('fill', track.color)
            .text(track.name)
            .attr('alignment-baseline', 'middle');
        xPos += legendWidths[i] + 32;
    });

    // Tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'timeline-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(255,255,255,0.97)')
        .style('border', '1px solid #ddd')
        .style('border-radius', '8px')
        .style('box-shadow', '0 4px 18px rgba(0,0,0,0.10)')
        .style('padding', '12px 18px')
        .style('pointer-events', 'none')
        .style('font-family', 'Inter, Arial, sans-serif')
        .style('font-size', '15px')
        .style('color', '#222')
        .style('opacity', 0)
        .style('z-index', 10000);
} 