import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const BASE_COLORS = {
  array: "#006224ff",
  object: "#6300dcff",
  value: "#2c4fffff",
};

const HIGHLIGHT_STYLES = {
  background: BASE_COLORS,
  border: "3px solid #00aa03ff",
  shadow: "0 0 16px rgba(91, 255, 54, 0.6)",
};

const TreeVisualizer = ({ jsonData, searchQuery, onMatchResult, isDarkMode }) => {
  const parseJsonToFlow = useCallback(
    (data, parentId = null, depth = 0, position = { x: 0, y: 0 }, path = "$") => {
      if (data === undefined) return { nodes: [], edges: [], pathMap: {} };

      const nodes = [];
      const edges = [];
      const pathMap = {};

      const id = Math.random().toString(36).slice(2, 11);

      let type = "value";
      let label = "";

      if (Array.isArray(data)) {
        type = "array";
        label = "Array";
      } else if (typeof data === "object" && data !== null) {
        type = "object";
        label = "Object";
      } else {
        type = "value";
        label = JSON.stringify(data);
      }

      nodes.push({
        id,
        data: { label, type, path },
        position: { x: position.x, y: position.y },
        style: {
          background: BASE_COLORS[type],
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        },
      });

      pathMap[path] = id;

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

        const horizontalSpacing = Math.max(100, entries.length * 60);
        const verticalSpacing = 180;

        entries.forEach(([key, value], index) => {
          const childPosition = {
            x: position.x + (index - (entries.length - 1) / 2) * horizontalSpacing,
            y: position.y + verticalSpacing,
          };

          const childPath = Array.isArray(data) ? `${path}[${key}]` : `${path}.${key}`;

          const {
            nodes: childNodes,
            edges: childEdges,
            pathMap: childPathMap,
          } = parseJsonToFlow(value, id, depth + 1, childPosition, childPath);

          if (childNodes && childNodes.length > 0) {
            childNodes[0].data.label = `${key}: ${childNodes[0].data.label}`;
          }

          nodes.push(...(childNodes || []));
          edges.push(...(childEdges || []));
          Object.assign(pathMap, childPathMap);
        });
      }

      return { nodes, edges, pathMap };
    },
    []
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [pathMap, setPathMap] = useState({});

  useEffect(() => {
    if (!jsonData) return;

    let parsed;
    try {
      parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
    } catch {
      return;
    }

    const { nodes = [], edges = [], pathMap: pm = {} } = parseJsonToFlow(parsed);
    setRfNodes(nodes);
    setRfEdges(edges);
    setPathMap(pm);

    if (rfInstance) {
      setTimeout(() => {
        rfInstance.fitView({ duration: 600, padding: 0.2 });
      }, 200);
    }
  }, [jsonData, parseJsonToFlow, rfInstance]);

  useEffect(() => {
    const q = (searchQuery || "").trim();

    const resetStyles = () =>
      setRfNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          style: {
            ...n.style,
            background: BASE_COLORS[n.data.type] || n.style.background,
            border: "none",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          },
        }))
      );

    if (!q) {
      resetStyles();
      onMatchResult && onMatchResult(null);
      return;
    }

    let normalized = q.startsWith("$")
      ? q
      : q.startsWith("[") || q.startsWith(".")
      ? `$${q}`
      : `$.${q}`;

    const targetId = pathMap[normalized];

    if (!targetId) {
      resetStyles();
      onMatchResult && onMatchResult(false);
      return;
    }

    onMatchResult && onMatchResult(true);

    setRfNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          background: n.id === targetId ? HIGHLIGHT_STYLES.background : BASE_COLORS[n.data.type],
          border: n.id === targetId ? HIGHLIGHT_STYLES.border : "none",
          boxShadow:
            n.id === targetId ? HIGHLIGHT_STYLES.shadow : "0 3px 8px rgba(0,0,0,0.15)",
        },
      }))
    );

    if (rfInstance) {
      setTimeout(() => {
        const current = rfInstance.getNodes().find((n) => n.id === targetId);
        if (current) {
          rfInstance.setCenter(current.position.x, current.position.y, {
            duration: 500,
            zoom: 1.4,
          });
        }
      }, 60);
    }
  }, [searchQuery, pathMap, rfInstance, onMatchResult]);

  return (
    <div
  className={`h-[70vh] rounded-lg overflow-hidden transition-colors duration-300 relative 
  ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-neutral-200'}`}
>
  <ReactFlow
    className={`custom-flow ${isDarkMode ? 'dark' : 'light'}`}
    nodes={rfNodes}
    edges={rfEdges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onInit={setRfInstance}
    fitView
  >
    <Background 
      color={isDarkMode ? "#444" : "#e2e2e2"}
      gap={16}
      size={1}
      variant="dots" 
    />
    <Controls />
  </ReactFlow>
</div>
  );
};

export default TreeVisualizer;
