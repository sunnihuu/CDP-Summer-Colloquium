// Visual Language & Style JS
// (Add interactive or animation code for the Visual Language & Style section here in the future) 
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('d3-canvas-style')) {
    const width = document.getElementById('d3-canvas-style').clientWidth;
    const height = document.getElementById('d3-canvas-style').clientHeight;
    const svg = d3.select('#d3-canvas-style')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const palette = ['#8E7CC3', '#3A86FF', '#23C16B', '#FFD600', '#FF8C00', '#00BFC4'];
    const labels = ['Global Context', 'OEC Development', 'Academic & Theory', 'Visualization & Interface', 'User Interfaces', 'Metadata & Infra'];
    const totalWidth = (palette.length - 1) * 80;
    const cx0 = width / 2 - totalWidth / 2;
    palette.forEach((color, i) => {
      svg.append('circle')
        .attr('cx', cx0 + i * 80)
        .attr('cy', height / 2)
        .attr('r', 32)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.13))');
      svg.append('text')
        .attr('x', cx0 + i * 80)
        .attr('y', height / 2 + 54)
        .attr('text-anchor', 'middle')
        .attr('font-size', 15)
        .attr('fill', color)
        .attr('font-weight', 700)
        .text(labels[i]);
    });
  }
}); 