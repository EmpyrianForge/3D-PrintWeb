
import fs from 'fs';
const filePath = 'public/models/FinalRoom.glb';
const data = fs.readFileSync(filePath);
const jsonLength = data.readUInt32LE(12);
const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);
gltf.nodes.forEach(node => {
    if (node.name && (node.name.toLowerCase().includes('maker') || node.name.toLowerCase().includes('world'))) {
        console.log(`Node: "${node.name}", Mesh: ${node.mesh}`);
    }
});
