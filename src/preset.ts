import { NodeData } from "./store";
import { Node } from "reactflow";

export const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "inputNode",
    position: { x: 250, y: 100 },
    data: {
      type: "Idea",
      title: "Idea",
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
];

export const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
