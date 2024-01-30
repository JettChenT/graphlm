import React, { useEffect, useRef, useState } from "react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";

import useStore, { EditorState } from "./store";
import InputNode from "./InputNode";
import LLMNode from "./LLMNode";
import { newInputNode, newLLMNode } from "./preset";
import SettingsModal from "./settings";

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
  const [cursorPosition, setCursorPosition] = useState({ x: 200, y: 200 });
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTextInputFocused =
        activeElement && activeElement.tagName === "TEXTAREA";

      if (!isTextInputFocused) {
        if (event.key === "t") {
          createNode(newInputNode(cursorPosition.x, cursorPosition.y));
        } else if (event.key === "g") {
          createNode(newLLMNode(cursorPosition.x, cursorPosition.y));
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      // console.log(position);
      setCursorPosition(position);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [createNode, cursorPosition, reactFlowInstance]);

  return (
    <div
      style={{ width: "100%", height: "100vh" }}
      className="reactflow-wrapper"
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
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
          <SettingsModal />
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
