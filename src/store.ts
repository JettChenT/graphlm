import { ChatOpenAI } from "@langchain/openai";

import {create} from 'zustand';
import {
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';

export type Content = {
    type: string,
    content: string
}

export type NodeData<T=any> = {
    sources: Content[],
    output: Content,
    title: string,
    status: string,
    type: string,
    auxiliary: T
}

export type LLM_config = { // Defaulting to OpenAI for now
    api_base: string,
    api_key: string
}

export type EditorState = {
    nodes: Node<NodeData>[],
    edges: Edge[],
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    updateNodeData: (nodeId: string, data: NodeData) => void,
    updateNodeContent: (nodeId: string, content: Content) => void,
    llm_config: LLM_config,
    llm: ChatOpenAI,
}

const useStore = create<EditorState>((set, get) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes)
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges)
        });
    },
    onConnect: (params) => {
        set({
            edges: addEdge(params, get().edges)
        });
    },
    updateNodeData: (nodeId, data) => {
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
            node.data = data;
            set({
                nodes: get().nodes
            });
        }
    },
    updateNodeContent: (nodeId, content) => {
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
            node.data.output = content;
            set({
                nodes: get().nodes
            });
        }
    },
    llm_config: {
        api_base: "https://api.openai.com",
        api_key: null
    },
    llm: null
}))

export default useStore;