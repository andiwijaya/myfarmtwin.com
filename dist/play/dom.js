/** @param {string} id @returns {HTMLElement} */
export function el(id){const node=document.getElementById(id);if(!node)throw new Error('Missing interface: '+id);return node;}
