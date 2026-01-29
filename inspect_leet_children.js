
import fs from 'fs';
const filePath = 'public/models/FinalRoom.glb';
const data = fs.readFileSync(filePath);
const jsonLength = data.readUInt32LE(12);
const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);
const leetNode = gltf.nodes.find(n => n.name && n.name.toLowerCase().includes('leet'));
if (leetNode) {
    console.log('LeetNode:', JSON.stringify(leetNode, null, 2));
    if (leetNode.children) {
        leetNode.children.forEach(childIdx => {
            console.log(`Child ${childIdx}:`, JSON.stringify(gltf.nodes[childIdx], null, 2));
        });
    }
}
