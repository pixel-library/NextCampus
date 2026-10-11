import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('GIS Map zoom protection: maxNativeZoom is configured to avoid "Map data not yet available" placeholders', () => {
  const gisMapPath = path.join(projectRoot, 'src/components/map/CampusGisMap.jsx');
  const content = fs.readFileSync(gisMapPath, 'utf8');

  // Verify TILE_LAYER_CONFIGS exists
  assert.ok(content.includes('TILE_LAYER_CONFIGS'), 'TILE_LAYER_CONFIGS must be declared');

  // Verify satellite layer specifies maxNativeZoom: 18
  assert.ok(
    content.includes('maxNativeZoom: 18'),
    'Satellite tile layer must specify maxNativeZoom: 18 because Esri native resolution stops at z=18'
  );

  // Verify street map layer specifies maxNativeZoom
  assert.ok(
    content.includes('maxNativeZoom: 19'),
    'Street map tile layer must specify maxNativeZoom: 19'
  );

  // Verify maxZoom allows high-resolution scaling up to z=20
  assert.ok(
    content.includes('maxZoom: 20'),
    'Map must allow high-resolution zoom up to maxZoom: 20'
  );

  // Verify createTileLayer factory helper is used
  assert.ok(
    content.includes('createTileLayer(mapLayerStyle)'),
    'createTileLayer must be invoked to create layers with maxNativeZoom protection'
  );

  console.log('✅ GIS Map zoom protection verified: maxNativeZoom prevents broken/placeholder tile fetching.');
});
