
import fs from 'fs';

const filePath = 'public/models/FinalRoom.glb';

function inspect() {
    const data = fs.readFileSync(filePath);
    const jsonLength = data.readUInt32LE(12);
    const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
    const gltf = JSON.parse(jsonStr);
    
    console.log('--- Nodes, Meshes and Materials ---');
    if (gltf.nodes) {
        gltf.nodes.forEach((node, nodeIdx) => {
            let info = `Node: ${node.name || 'unnamed'}`;
            if (node.mesh !== undefined) {
                const mesh = gltf.meshes[node.mesh];
                info += ` | Mesh: ${mesh.name}`;
                mesh.primitives.forEach(prim => {
                    if (prim.material !== undefined) {
                        const mat = gltf.materials[prim.material];
                        info += ` | Mat: ${mat.name}`;
                    }
                });
            }
            console.log(info);
        });
    }
}

inspect();
