import { tr } from "framer-motion/client";
import React, { useCallback, useEffect, useRef, useMemo, useState} from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import jsonpath from "jsonpath";

const TreeVisualizer = ({ jsonData, searchQuery }) => {
  const parseJsonToFlow = useCallback((data, parentId = null, depth = 0, position = { x: 0, y: 0 }) => {
    if (data === undefined) return { nodes: [], edges: [] };

    const nodes = [];
    const edges = [];

    const id = Math.random().toString(36).substr(2, 9);
    let label = "";
    let bgColor = "";

    if (Array.isArray(data)) {
      label = "Array";
      bgColor = "#006224ff";
    } else if (typeof data === "object" && data !== null) {
      label = "Object";
      bgColor = "#6300dcff";
    } else {
      label = JSON.stringify(data);
      bgColor = "#2c4fffff";
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

 const rfInstanceRef = useRef(null);

  // keep a ref copy of instance for callbacks
  useEffect(() => {
    rfInstanceRef.current = reactFlowInstance;
  }, [reactFlowInstance]);

  const parsed = useMemo(() => {
    if (!jsonData) return null;
    try {
      return typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
    } catch {
      return null;
    }
  }, [jsonData]);

  useEffect(() => {
    if (!parsed) return;

    const { nodes = [], edges = [] } = parseJsonToFlow(parsed);
    setRfNodes(nodes);
    setRfEdges(edges);

    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 1000, padding: 0.2 });
        reactFlowInstance.zoomTo(Math.min(reactFlowInstance.getZoom() * 1.5, 2.0), { duration: 1500 });
      }, 300);
    }
  }, [parsed, parseJsonToFlow, reactFlowInstance, setRfNodes, setRfEdges]);

  // Search / highlight / pan effect
  useEffect(() => {
    if (!searchQuery || !parsed) {
      // Clear highlights: restore original style stored in data.origStyle
      setRfNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: { ...(n.data && n.data.origStyle ? n.data.origStyle : n.style) },
        }))
      );
      return;
    }

    try {
      // run jsonpath query to get matched values
      const matches = jsonpath.query(parsed, searchQuery);
      // prepare match detection using values and path equality
      const normalizedQueryPath = searchQuery.startsWith("$") ? searchQuery : searchQuery.startsWith(".") ? `$${searchQuery}` : `$.${searchQuery}`;

      // determine which nodes match
      const matchedNodeId = (() => {
        for (const n of rfNodes) {
          let isMatch = false;

          // match by path exact
          if (n.data && n.data.path) {
            if (n.data.path === normalizedQueryPath || n.data.path.endsWith(normalizedQueryPath.replace(/^\$\./, ""))) {
              isMatch = true;
            }
          }

          // match by value (string/number/boolean/null or object deep equality)
          if (!isMatch && matches && matches.length > 0) {
            for (const m of matches) {
              try {
                if (typeof m === "object") {
                  if (JSON.stringify(m) === JSON.stringify(n.data.value)) {
                    isMatch = true;
                    break;
                  }
                } else {
                  if (String(m) === String(n.data.value)) {
                    isMatch = true;
                    break;
                  }
                }
              } catch {
                // ignore
              }
            }
          }

          if (isMatch) return n.id;
        }
        return null;
      })();

      // apply highlight styles
      setRfNodes((nds) =>
        nds.map((n) => {
          const isMatch =
            (n.data && n.data.path && (n.data.path === normalizedQueryPath || n.data.path.endsWith(normalizedQueryPath.replace(/^\$\./, "")))) ||
            (matches &&
              matches.some((m) => {
                try {
                  if (typeof m === "object") return JSON.stringify(m) === JSON.stringify(n.data.value);
                  return String(m) === String(n.data.value);
                } catch {
                  return false;
                }
              }));

          return {
            ...n,
            style: {
              ...(n.data && n.data.origStyle ? n.data.origStyle : n.style),
              background: isMatch ? "#ffd700" : (n.data && n.data.origStyle ? n.data.origStyle.background : n.style.background),
              border: isMatch ? "2px solid #f59e0b" : (n.data && n.data.origStyle ? n.data.origStyle.border : n.style.border),
            },
          };
        })
      );

      // pan/center to first matched node
      if (matchedNodeId) {
        const found = rfNodes.find((n) => n.id === matchedNodeId);
        const inst = rfInstanceRef.current;
        if (found && inst && typeof inst.setCenter === "function") {
          inst.setCenter(found.position.x, found.position.y, { zoom: 1.2, duration: 400 });
        }
      }
    } catch (err) {
      // invalid JSONPath or other error -> clear highlights
      setRfNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: { ...(n.data && n.data.origStyle ? n.data.origStyle : n.style) },
        }))
      );
      // optional: console.warn("Invalid JSONPath query", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, parsed]); // rfNodes intentionally omitted to avoid loop

  return (
    <div className="w-full h-[700px] rounded-lg shadow-lg border border-gray-300 bg-white overflow-hidden">
      <ReactFlow
        nodes={rfNodes || []}
        edges={rfEdges || []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={(inst) => {
          setReactFlowInstance(inst);
          rfInstanceRef.current = inst;
        }}
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
