
import fs from 'fs';

const filePath = 'public/models/FinalRoom.glb';

function inspect() {
    const data = fs.readFileSync(filePath);
    const jsonLength = data.readUInt32LE(12);
    const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
    const gltf = JSON.parse(jsonStr);
    
    console.log('--- SOCIAL BUTTON INSPECTION ---');
    gltf.nodes.forEach((node, idx) => {
        const name = node.name || '';
        if (name.toLowerCase().includes('boot') || name.toLowerCase().includes('leet') || name.toLowerCase().includes('git')) {
            console.log(`Node ${idx}: "${name}"`);
            console.log(`  Mesh index: ${node.mesh}`);
            if (node.mesh !== undefined) {
                const mesh = gltf.meshes[node.mesh];
                console.log(`  Mesh Name: "${mesh.name}"`);
            }
            if (node.children) {
                console.log(`  Children: ${node.children.join(', ')}`);
            }
        }
    });
}

inspect();
