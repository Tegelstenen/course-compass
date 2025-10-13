"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type RatingDistributionChartProps = {
  distribution: number[];
};

export default function RatingDistributionChart({
  distribution,
}: RatingDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous chart

    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor =
      rootStyles.getPropertyValue("--primary").trim() || "#456882";
    const axisColor =
      rootStyles.getPropertyValue("--foreground").trim() || "#111";

    // Dimensions
    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 35 };

    // Make sure data is numbers
    const data = distribution.map((v) =>
      typeof v === "number" ? v : Number(v) || 0,
    );

    // X scale (1-5 stars)
    const x = d3
      .scaleBand()
      .domain(["1", "2", "3", "4", "5"])
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Y scale (counts)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data) ?? 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Axes
    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x) as any);

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    // Grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line.horizontal-grid")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", axisColor)
      .attr("stroke-opacity", 0.1)
      .attr("shape-rendering", "crispEdges");

    // Axis styling
    svg
      .selectAll(".tick text")
      .attr("fill", axisColor)
      .style("font-size", "12px");
    svg
      .selectAll("path, line")
      .attr("stroke", axisColor)
      .attr("stroke-width", 1);

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 8)
      .attr("text-anchor", "middle")
      .attr("fill", axisColor)
      .style("font-size", "12px")
      .style("font-weight", "600")
      .text("Rating distribution");

    // X-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 2)
      .attr("text-anchor", "middle")
      .attr("fill", axisColor)
      .style("font-size", "10px")
      .text("Rating");

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", axisColor)
      .style("font-size", "10px")
      .text("Count");

    // Bars
    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(String(i + 1))!)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d))
      .attr("fill", primaryColor);

    bars
      .append("title")
      .text((d, i) => `${i + 1}⭐ — ${d} review${d !== 1 ? "s" : ""}`);

    // Animate bars as they load
    bars
      .transition()
      .duration(500)
      .attr("y", (d) => y(d))
      .attr("height", (d) => y(0) - y(d));
  }, [distribution]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
}
