/** Original cozy-slice roles. No simulation values or third-party art assets.
 * Keep the existing atlas projection/light contract immutable until rendered QA.
 */
export const COZY_ART=Object.freeze({
 palette:Object.freeze({grass:'#97b866',grassLight:'#b5c979',dirt:'#cdb07e',soil:'#94674a',wood:'#ba8a59',woodDark:'#8c6245',barn:'#b8644b',barnLight:'#c8795e',barnDark:'#aa5441',trim:'#fff0ce',roof:'#61797a',roofDark:'#4c666b',metal:'#8da9a4',shade:'#314b38',straw:'#d9bc74'}),
 // Acceptance targets, not measurements or automatically satisfied budgets.
 budgets:Object.freeze({desktopNormalCalls:415,phoneNormalCalls:370,normalTriangles:30000,cowBarnMeshes:8,cowBarnTriangles:14000,atlasCombinedRgbaBytes:64*1024*1024}),
});
