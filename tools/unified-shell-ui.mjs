/** QA uses the same visible disclosure/menu path as a player; never force-click. */
export async function worldCamera(page,action){const button=page.locator('[data-preview-camera='+action+']');if(!await button.isVisible()&&await page.locator('#world-camera-tools').count())await page.locator('#world-camera-tools summary').click();await button.click();await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.cameraDetail!=='reduced');}
export async function worldObject(page,id){if(await page.locator('#world-objects').count()){if(!await page.locator('#world-objects').evaluate(d=>d.open))await page.locator('#world-objects summary').click();await page.locator('#world-object-search').fill('');await page.locator('#world-object-zone').selectOption('all');}await page.locator('[data-preview-select="'+id+'"]').click();}
export async function worldGo(page,zone){await page.locator('#world-minimap summary').click();await page.locator('[data-world-go='+zone+']').click();}
export async function openWorldSettings(page){if(await page.locator('[data-world-menu=settings]').count()&&!await page.locator('#world-settings').isVisible())await page.locator('[data-world-menu=settings]').click();}
export async function closeWorldSettings(page){if(await page.locator('#world-settings').count()&&await page.locator('#world-settings').isVisible())await page.locator('[data-world-close=settings]').click();}

export async function worldRetry(page){const button=page.locator('[data-preview-retry]');if(!await button.isVisible()&&await page.locator('#world-camera-tools').count())await page.locator('#world-camera-tools summary').click();await button.click();}

/** Preserve native parity commands while entering the current visible world UI. */
export async function worldControl(page,selector){const match=/^\[data-preview-(select|camera)=(?:"([^"]+)"|'([^']+)'|([^\]]+))\]$/.exec(selector);if(!match)throw Error('Unknown world control '+selector);const value=match[2]||match[3]||match[4];return match[1]==='select'?worldObject(page,value):worldCamera(page,value);}
