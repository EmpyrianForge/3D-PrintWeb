
import fs from 'fs';

const filePath = 'public/models/FinalRoom.glb';

function inspect() {
    const data = fs.readFileSync(filePath);
    const jsonLength = data.readUInt32LE(12);
    const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
    const gltf = JSON.parse(jsonStr);
    
    console.log('--- RESIN SEARCH ---');
    gltf.nodes.forEach((node, idx) => {
        if (node.name && node.name.toLowerCase().includes('resin')) {
            console.log(`Node ${idx}: ${node.name}`);
            if (node.mesh !== undefined) {
                const mesh = gltf.meshes[node.mesh];
                console.log(`  Mesh: ${mesh.name}`);
            }
        }
    });

    console.log('--- BUTTON SEARCH ---');
    gltf.nodes.forEach((node, idx) => {
        if (node.name && (node.name.toLowerCase().includes('button') || node.name.toLowerCase().includes('insta') || node.name.toLowerCase().includes('maker'))) {
            console.log(`Node ${idx}: ${node.name}`);
        }
    });
}

inspect();
