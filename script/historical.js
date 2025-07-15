// Layered Timeline for Historical Context & Intent
if (document.getElementById('historical-canvas')) {
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
    const margin = { top: 80, right: 40, bottom: 50, left: 170 };
    const width = document.getElementById('historical-canvas').clientWidth;
    const height = 420;
    const trackHeight = 70;

    d3.select('#historical-canvas').selectAll('*').remove();
    const svg = d3.select('#historical-canvas')
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
        // Track label
        svg.append('text')
            .attr('x', margin.left - 18)
            .attr('y', y + 8)
            .attr('text-anchor', 'end')
            .attr('font-size', 19)
            .attr('font-weight', 800)
            .attr('fill', track.color)
            .attr('text-shadow', '1px 1px 6px #fff')
            .text(track.name);
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
            })
            .on('mousemove', function(event) {
                tooltip.style('left', (event.pageX + 18) + 'px')
                    .style('top', (event.pageY - 18) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
                d3.select(this).attr('stroke', '#fff').attr('stroke-width', 3);
            });
        svg.selectAll(`.event-label-${i}`)
            .data(track.events)
            .enter()
            .append('text')
            .attr('x', d => x(d.year))
            .attr('y', y + 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', 13)
            .attr('fill', '#222')
            .attr('font-weight', 500)
            .text(d => d.label);
    });

    // Optional: Speculative Future
    svg.append('text')
        .attr('x', x(2025) || (width - margin.right))
        .attr('y', margin.top + tracks.length * trackHeight)
        .attr('font-size', 14)
        .attr('fill', '#888')
        .attr('font-style', 'italic')
        .text('2025 → ? Future: Will economic complexity gain traction in policy? How will visualization evolve?');

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