/** Keep only the exact alpha bytes required by CPU picking. This owns a new
 * quarter-sized buffer, never a view retaining the decoded RGBA allocation.
 * Color rendering still uses the original Image/Texture.
 * @param {Uint8ClampedArray|Uint8Array} rgba @returns {Uint8Array} */
export function compactAlpha(rgba){
 if(!(rgba instanceof Uint8ClampedArray||rgba instanceof Uint8Array)||rgba.length%4!==0)throw new RangeError('Invalid RGBA pixel buffer');
 const alpha=new Uint8Array(rgba.length/4);
 for(let i=0,j=3;i<alpha.length;i++,j+=4)alpha[i]=rgba[j];
 return alpha;
}
