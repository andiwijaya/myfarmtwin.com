import {Group,Mesh,SphereGeometry,TorusGeometry,BufferGeometry,Float32BufferAttribute,Color,Vector3,MeshLambertMaterial} from './vendor/three.module.js';
/** Original silver pond fish: one painted curved body, attached eyes/gills,
 * authored forked fins and a water-centred pivot. No species/economy change. */
export function createModel(art){
 const root=new Group(),tail=new Group(),fins=[],materials=new Map(),geometries=new Set();let disposed=false;
 const material=color=>{if(!materials.has(color))materials.set(color,new MeshLambertMaterial({color,flatShading:true}));return materials.get(color);};
 const add=(parent,geometry,color,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{geometries.add(geometry);const mesh=new Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 // A closed triangular prism, with winding derived from the extrusion normal.
 const fin=(parent,points,offset,color)=>{const vertices=points.map(p=>new Vector3(...p)),n=new Vector3(...offset);if(vertices[1].clone().sub(vertices[0]).cross(vertices[2].clone().sub(vertices[0])).dot(n)<0)[vertices[1],vertices[2]]=[vertices[2],vertices[1]];const positions=[-1,1].flatMap(sign=>vertices.flatMap(v=>v.clone().addScaledVector(n,sign).toArray())),indices=[2,1,0,3,4,5];for(let i=0;i<3;i++){const j=(i+1)%3;indices.push(i,j,j+3,i,j+3,i+3);}const g=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return add(parent,g,color);};
 const body=new SphereGeometry(1,20,12),position=body.getAttribute('position'),colors=[],belly=new Color('#f1edd7'),side=new Color('#bdcfc2'),back=new Color('#71958e'),gill=new Color('#819d95'),color=new Color();
 for(let i=0;i<position.count;i++){const y=position.getY(i),z=position.getZ(i);color.lerpColors(belly,side,Math.min(1,Math.max(0,(y+.8)/.85)));if(y>0)color.lerp(back,Math.min(.9,y*.9));if(z>.35&&z<.55&&Math.abs(position.getX(i))>.5)color.lerp(gill,.65);if(Math.abs(y)<.12&&z<.35)color.lerp(belly,.35);colors.push(color.r,color.g,color.b);}
 body.setAttribute('color',new Float32BufferAttribute(colors,3));const bodyMesh=add(root,body,'#ffffff',0,-.002,-.005,.12,.052,.235),bodyMaterial=new MeshLambertMaterial({vertexColors:true,flatShading:true});materials.set('painted-body',bodyMaterial);bodyMesh.material=bodyMaterial;
 add(root,new SphereGeometry(1,12,8),'#e0dfc5',0,-.006,.205,.055,.032,.038);
 const mouth=add(root,new TorusGeometry(.017,.0025,4,12,Math.PI),'#627e76',0,-.006,.242);mouth.rotation.z=Math.PI;
 for(const side of [-1,1]){
  add(root,new SphereGeometry(1,10,8),'#e8e4cc',side*.078,.015,.165,.017,.017,.017);
  add(root,new SphereGeometry(1,10,8),'#344940',side*.088,.017,.169,.011,.011,.011);
  add(root,new SphereGeometry(1,8,6),'#fff4d9',side*.093,.021,.174,.0035,.0035,.0035);
  const wing=new Group();root.add(wing);fins.push({wing,side});fin(wing,[[side*.075,-.006,.025],[side*.168,-.012,-.07],[side*.095,-.018,-.11]],[0,.004,0],'#86a99d');
 }
 fin(root,[[0,.02,-.15],[0,.064,-.06],[0,.02,.07]],[.004,0,0],'#6e9189');
 root.add(tail);tail.position.z=-.212;
 for(const side of [-1,1])fin(tail,[[0,0,0],[side*.1,.002,-.118],[0,0,-.075]],[0,.004,0],'#8eafa1');
 const ripple=add(root,new TorusGeometry(.16,.003,4,24),art.palette.water,0,.001,-.02);ripple.rotation.x=Math.PI/2;
 const pose=(action,frame)=>{if(!art.species.fish.actions.includes(action)||!Number.isInteger(frame)||frame<0||frame>=4)throw new RangeError('Known Fish pose/frame required');if(disposed)throw Error('Fish rig disposed');const phase=frame*Math.PI/2,amplitude=action==='rest'?.025:action==='feed'?.34:action==='surface'?.18:.24;tail.rotation.set(0,Math.sin(phase)*amplitude,0);for(const{wing,side}of fins)wing.rotation.set(0,side*Math.sin(phase)*(action==='rest'?.02:.07),0);root.rotation.set(action==='surface'?-.12:action==='feed'?-.05:0,0,0);root.position.set(0,action==='surface'?.012+Math.sin(phase)*.004:0,0);ripple.visible=action==='surface'||action==='feed';ripple.scale.setScalar(.78+frame*.07);root.updateMatrixWorld(true);};
 pose('rest',0);
 return{root,pose,dispose(){if(disposed)return;disposed=true;for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}
