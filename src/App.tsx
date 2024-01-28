import React from "react";
import ReactFlow from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import useStore from "./store";
import InputNode from "./InputNode";
import LLMNode from "./LLMNode";

const nodeTypes = {
  inputNode: InputNode,
  llmNode: LLMNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  );

  return (
    <div style={{ width: "100vh", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      ></ReactFlow>
    </div>
  );
}

export default App;
