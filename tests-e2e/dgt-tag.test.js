/* eslint-disable */

import VueSelector from 'testcafe-vue-selectors';
import scenario from '../package.json';
import { Selector } from 'testcafe';

fixture`dgt-tag`.page`${scenario.baseURL}`;

test('insert and remove tag', async t => {
    const inputTag = Selector('#inputTag');
    await t.typeText(inputTag, 'Ba').wait(500).pressKey('enter');
    const deleteTagB = Selector('.tag-0 button.delete');
    await t.click(deleteTagB).wait(700);
});

test('insert tag, and try insert the same tag again', async t => {
    const inputTag = Selector('#inputTag');
    await t.typeText(inputTag, 'Ba').wait(500).pressKey('enter');
    await t.typeText(inputTag, 'Ba').wait(500).pressKey('enter');
});

test('insert tag using autocomplete', async t => {
    const radioTrue = Selector('.inline input');
    await t.click(radioTrue).wait(400);
    const inputTag = Selector('#inputTag');
    await t.typeText(inputTag, 'Ba').wait(500).pressKey('down').wait(500).pressKey('enter').wait(1000);
});