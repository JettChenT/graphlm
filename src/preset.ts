import { NodeData } from "./store";
import { Node } from "reactflow";
import { nanoid } from "nanoid";

export const newInputNode = (x: number, y: number) => {
  return {
    id: nanoid(),
    type: "inputNode",
    position: { x: x, y: y },
    data: {
      type: "Text",
      title: "Text",
      status: null,
      auxiliary: {},
      content: {
        type: "text",
        content: "Hello World",
      },
    },
  };
};

export const newLLMNode = (x: number, y: number) => {
  return {
    id: nanoid(),
    type: "llmNode",
    position: { x: x, y: y },
    data: {
      type: "Generation",
      title: "Generation",
      status: null,
      auxiliary: {},
      content: null,
    },
  };
};

export const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "inputNode",
    position: { x: 250, y: 100 },
    data: {
      type: "Text",
      title: "Text",
      status: null,
      auxiliary: {},
      content: {
        type: "text",
        content: "Hello World",
      },
    },
  },
  {
    id: "2",
    type: "llmNode",
    position: { x: 500, y: 100 },
    data: {
      type: "Generation",
      title: "Generation",
      status: null,
      auxiliary: {},
      content: null,
    },
  },
  {
    id: "3",
    type: "inputNode",
    position: { x: 250, y: 300 },
    data: {
      type: "Text",
      title: "Text",
      status: null,
      auxiliary: {},
      content: {
        type: "text",
        content: "Task: Expand",
      },
    },
  },
];

export const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
