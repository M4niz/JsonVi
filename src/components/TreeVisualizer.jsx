import { tr } from "framer-motion/client";
import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const TreeVisualizer = ({ jsonData }) => {
  const parseJsonToFlow = useCallback((data, parentId = null, depth = 0, position = { x: 0, y: 0 }) => {
    if (data === undefined) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    const id = Math.random().toString(36).substr(2, 9);
    let label = "";
    let bgColor = "";

    if (Array.isArray(data)) {
      label = "Array";
      bgColor = "#22c55e"; // Green
    } else if (typeof data === "object" && data !== null) {
      label = "Object";
      bgColor = "#3b82f6"; // Blue
    } else {
      label = JSON.stringify(data);
      bgColor = "#f97316"; // Orange
    }

    nodes.push({
      id,
      data: { label },
      position: { x: position.x, y: position.y },
      style: {
        background: bgColor,
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
      },
    });

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        style: { strokeWidth: 2, stroke: "#555" },
      });
    }

    if (typeof data === "object" && data !== null) {
      const entries = Array.isArray(data)
        ? data.map((v, i) => [i, v])
        : Object.entries(data);

      // Dynamic horizontal spacing based on number of children
      const horizontalSpacing = Math.max(100, entries.length * 60);
      const verticalSpacing = 180;

      entries.forEach(([key, value], index) => {
        const childPosition = {
          x: position.x + (index - (entries.length - 1) / 2) * horizontalSpacing,
          y: position.y + verticalSpacing,
        };
        const { nodes: childNodes, edges: childEdges } = parseJsonToFlow(value, id, depth + 1, childPosition);

        if (childNodes && childNodes.length > 0)
          childNodes[0].data.label = `${key}: ${childNodes[0].data.label}`;

        nodes.push(...(childNodes || []));
        edges.push(...(childEdges || []));
      });
    }

    return { nodes, edges };
  }, []);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    if (!jsonData) return;
    let parsedData;
    try {
      parsedData = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
    } catch {
      return;
    }

    const { nodes = [], edges = [] } = parseJsonToFlow(parsedData);
    setRfNodes(nodes);
    setRfEdges(edges);

    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 1000, padding: 0.2 });
        reactFlowInstance.zoomTo(reactFlowInstance.getZoom() * 1.5, { duration: 1500 });
      }, 300);
    }
  }, [jsonData, parseJsonToFlow, reactFlowInstance]);

  return (
    <div className="w-full h-[700px] rounded-lg shadow-lg border border-gray-300 bg-white overflow-hidden">
      <ReactFlow
        nodes={rfNodes || []}
        edges={rfEdges || []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default TreeVisualizer;
