/** @typedef {'undo-reset'|'redo-reset'} CameraHistoryAction */
/** Platform hints prefer the current low-entropy platform API, with Safari and
 * older browsers falling back to the legacy platform or desktop user agent.
 * @param {{userAgentData?:{platform?:string},platform?:string,userAgent?:string}} platformInfo
 * @param {'id'|'en'} language
 */
export function cameraResetShortcutHints(platformInfo,language){
 const platform=platformInfo.userAgentData?.platform||platformInfo.platform||'';
 const mac=/mac/i.test(platform)||!platform&&/\bMacintosh\b/i.test(platformInfo.userAgent||'');
 const undo=mac?'Cmd+Z':'Ctrl+Z',redo=mac?'Cmd+Shift+Z':'Ctrl+Y / Ctrl+Shift+Z';
 return{undo:{title:(language==='en'?"Undo this area's camera reset":"Undo reset kamera area ini")+' · '+undo,shortcuts:mac?'Meta+Z':'Control+Z'},redo:{title:(language==='en'?"Redo this area's camera reset":"Redo reset kamera area ini")+' · '+redo,shortcuts:mac?'Meta+Shift+Z':'Control+Y Control+Shift+Z'}};
}
/** @typedef {Pick<KeyboardEvent,'key'|'ctrlKey'|'altKey'|'metaKey'|'shiftKey'|'repeat'|'isComposing'|'defaultPrevented'|'preventDefault'>} CameraShortcutEvent */
/** Dispatch through the same active-area commands as the toolbar. Unhandled
 * shortcuts retain their native behavior, especially while editing text.
 * @param {CameraShortcutEvent} event
 * @param {{blocked:boolean,available:(action:CameraHistoryAction)=>boolean,run:(action:CameraHistoryAction)=>boolean}} handlers
 */
export function handleCameraResetShortcut(event,handlers){
 if(handlers.blocked||event.defaultPrevented||event.repeat||event.isComposing||event.ctrlKey===event.metaKey||event.altKey)return false;
 const key=event.key.toLowerCase();if(key!=='z'&&(key!=='y'||!event.ctrlKey||event.shiftKey))return false;
 const action=key==='z'&&!event.shiftKey?'undo-reset':'redo-reset';
 if(!handlers.available(action)||!handlers.run(action))return false;
 event.preventDefault();return true;
}
