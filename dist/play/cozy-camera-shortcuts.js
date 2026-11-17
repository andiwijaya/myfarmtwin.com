/** @typedef {'undo-reset'|'redo-reset'} CameraHistoryAction */
/** @typedef {Pick<KeyboardEvent,'key'|'ctrlKey'|'altKey'|'metaKey'|'shiftKey'|'repeat'|'isComposing'|'defaultPrevented'|'preventDefault'>} CameraShortcutEvent */
/** Dispatch through the same active-area commands as the toolbar. Unhandled
 * shortcuts retain their native behavior, especially while editing text.
 * @param {CameraShortcutEvent} event
 * @param {{blocked:boolean,available:(action:CameraHistoryAction)=>boolean,run:(action:CameraHistoryAction)=>boolean}} handlers
 */
export function handleCameraResetShortcut(event,handlers){
 if(handlers.blocked||event.defaultPrevented||event.repeat||event.isComposing||!event.ctrlKey||event.altKey||event.metaKey)return false;
 const key=event.key.toLowerCase();if(key!=='z'&&key!=='y'||key==='y'&&event.shiftKey)return false;
 const action=key==='z'&&!event.shiftKey?'undo-reset':'redo-reset';
 if(!handlers.available(action)||!handlers.run(action))return false;
 event.preventDefault();return true;
}
