import CampaignBattles from "./BalancingComponents/CampaignBattles";
import "./App.css";
import {
  Background,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import CustomNode from "./CustomNode";
import PigPool from "./BalancingComponents/PigPool";
import TopHeader from "./TopHeader";
import Popup from "./Popup";

const nodeTypes = {
	custom: CustomNode,
};

const initialNodes = [
	{
		id: "n1",
		type: "custom",
		position: { x: 0, y: 0 },
		data: { 
			label: 'Campaign Battles',
			children: (
				<CampaignBattles />
			)
		},
	},
	{
		id: "n2",
		type: "custom",
		position: { x: 0, y: -650 },
		data: { 
			bg: 'green',
			label: 'Pig Pool',
			children: (
				<PigPool />
			)
		},
	},
];


export default function App() {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState([]);

	const onNodesChange = useCallback(
		(changes) =>
			setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
		[],
	);

	const onEdgesChange = useCallback(
		(changes) =>
			setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
		[],
	);

	const onConnect = useCallback(
		(params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			fitView
			>
			<Background
				variant="dots"
				gap={12}
				color="#f1f1f1"
				bgColor="#1f1f1f"
				size={1}
			/>
			<Popup />
			<TopHeader />
			</ReactFlow>
		</div>
	);
}
