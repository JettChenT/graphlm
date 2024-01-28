import React from "react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import useStore, { EditorState } from "./store";
import InputNode from "./InputNode";
import LLMNode from "./LLMNode";
import { newInputNode, newLLMNode } from "./preset";

const nodeTypes = {
  inputNode: InputNode,
  llmNode: LLMNode,
};

const selector = (state: EditorState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  createNode: state.createNode,
});

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, createNode } =
    useStore(selector, shallow);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right" className="space-x-4">
          <button
            className="px-2 py-1 rounded bg-blue-500 text-white shadow"
            onClick={() => createNode(newInputNode(200, 200))}
          >
            Add Input Node
          </button>
          <button
            className="px-2 py-1 rounded bg-blue-500 text-white shadow"
            onClick={() => createNode(newLLMNode(200, 200))}
          >
            Add LLM Node
          </button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
