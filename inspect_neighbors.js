
import fs from 'fs';
const filePath = 'public/models/FinalRoom.glb';
const data = fs.readFileSync(filePath);
const jsonLength = data.readUInt32LE(12);
const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);
gltf.nodes.forEach(node => {
    if (node.translation) {
        const dx = node.translation[0] - (-2331.93);
        const dy = node.translation[1] - 2055.78;
        const dz = node.translation[2] - 822.14;
        const distSq = dx*dx + dy*dy + dz*dz;
        if (distSq < 200000) { 
            console.log(`Node: "${node.name}", Translation: ${node.translation}, Mesh: ${node.mesh}`);
        }
    }
});
