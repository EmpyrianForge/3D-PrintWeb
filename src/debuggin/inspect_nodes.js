
import fs from 'fs';

const filePath = 'public/models/FinalRoom.glb';

function inspect() {
    const data = fs.readFileSync(filePath);
    const jsonLength = data.readUInt32LE(12);
    const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
    const gltf = JSON.parse(jsonStr);
    
    console.log('--- ALL NODES ---');
    if (gltf.nodes) {
        gltf.nodes.forEach((node, idx) => {
            console.log(`Node ${idx}: ${node.name || 'unnamed'}`);
        });
    }
}

inspect();
