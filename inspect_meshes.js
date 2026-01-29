
import fs from 'fs';
const filePath = 'public/models/FinalRoom.glb';
const data = fs.readFileSync(filePath);
const jsonLength = data.readUInt32LE(12);
const jsonStr = data.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);
gltf.meshes.forEach((mesh, idx) => {
    console.log(`Mesh ${idx}: "${mesh.name}"`);
});
