import OpenAI from "openai";

import { create } from "zustand";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  getIncomers,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { initialEdges, initialNodes } from "./preset";

export type Content = {
  type: string;
  content: string;
};

export type NodeData<T = any> = {
  content: Content;
  title: string;
  status: string;
  type: string;
  auxiliary: T;
};

export type LLM_config = {
  // Defaulting to OpenAI for now
  api_base: string;
  api_key: string;
  model: string;
};

export type EditorState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeData: (nodeId: string, data: NodeData) => void;
  updateNodeContent: (nodeId: string, content: Content) => void;
  retrieveContentById: (nodeId: string) => Content | undefined;
  getSourcesById: (nodeId: string) => string[] | undefined;
  getNodeById: (nodeId: string) => Node<NodeData> | undefined; // Added function to get node by id
  setLLMConfig: (config: LLM_config) => OpenAI;
  createNode: (node: Node<NodeData>) => void;
  llm_config: LLM_config;
  llm: OpenAI;
};

const useStore = create<EditorState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (params) => {
    set({
      edges: addEdge(params, get().edges),
    });
  },
  updateNodeData: (nodeId, data) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data = data;
      set({
        nodes: get().nodes,
      });
    }
  },
  updateNodeContent: (nodeId, content) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data.content = content;
      set({
        nodes: get().nodes,
      });
    }
  },
  retrieveContentById: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    return node ? node.data.content : undefined;
  },
  getSourcesById: (nodeId) => {
    console.log(get().nodes, nodeId);
    const node = get().nodes.find((n) => n.id === nodeId);
    const incomers = getIncomers(node, get().nodes, get().edges);
    return incomers.map((n) => n.id);
  },
  getNodeById: (nodeId) => {
    return get().nodes.find((n) => n.id === nodeId);
  },
  llm_config: {
    api_base: "https://api.openai.com/v1",
    api_key: null,
    model: "gpt-3.5-turbo-1106",
  },
  setLLMConfig: (config) => {
    set({
      llm_config: config,
      llm: new OpenAI({
        apiKey: config.api_key,
        baseURL: config.api_base,
        dangerouslyAllowBrowser: true,
      }),
    });
    return get().llm;
  },
  createNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  llm: null,
}));

export default useStore;
