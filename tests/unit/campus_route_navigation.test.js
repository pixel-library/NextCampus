import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

test('Ground-Truth 2D Campus Road Graph: Numbered nodes 0-34 and route topology exist in CampusGisMap.jsx', () => {
  const gisMapPath = path.join(projectRoot, 'src/components/map/CampusGisMap.jsx');
  const gisContent = fs.readFileSync(gisMapPath, 'utf8');

  // Verify all 35 numbered nodes (node_0 to node_34)
  for (let i = 0; i <= 34; i++) {
    const nodeKey = `node_${i}:`;
    assert.ok(gisContent.includes(nodeKey), `MEWAR_CAMPUS_GRAPH must contain "${nodeKey}"`);
  }

  // Verify graphNode bindings on campus locations
  const expectedBindings = [
    "CAMPUS_GIS_LOCATIONS.kumbha.graphNode = 'node_1'",
    "CAMPUS_GIS_LOCATIONS.pratap.graphNode = 'node_0'",
    "CAMPUS_GIS_LOCATIONS.sanaga.graphNode = 'node_33'",
    "CAMPUS_GIS_LOCATIONS.bhamasha.graphNode = 'node_2'",
    "CAMPUS_GIS_LOCATIONS.main.graphNode = 'node_21'",
    "CAMPUS_GIS_LOCATIONS.eng.graphNode = 'node_6'",
    "CAMPUS_GIS_LOCATIONS.mess.graphNode = 'node_8'",
    "CAMPUS_GIS_LOCATIONS.law.graphNode = 'node_12'",
    "CAMPUS_GIS_LOCATIONS.basketball.graphNode = 'node_14'",
    "CAMPUS_GIS_LOCATIONS.volleyball.graphNode = 'node_15'",
    "CAMPUS_GIS_LOCATIONS.gym.graphNode = 'node_16'",
    "CAMPUS_GIS_LOCATIONS.cricket.graphNode = 'node_17'",
    "CAMPUS_GIS_LOCATIONS.gate.graphNode = 'node_18'",
    "CAMPUS_GIS_LOCATIONS.gate2.graphNode = 'node_23'",
    "CAMPUS_GIS_LOCATIONS.guest_house.graphNode = 'node_23'",
    "CAMPUS_GIS_LOCATIONS.mira.graphNode = 'node_27'",
    "CAMPUS_GIS_LOCATIONS.panna.graphNode = 'node_26'",
    "CAMPUS_GIS_LOCATIONS.padmani.graphNode = 'node_29'",
    "CAMPUS_GIS_LOCATIONS.hospital.graphNode = 'node_30'",
    "CAMPUS_GIS_LOCATIONS.parking.graphNode = 'node_34'",
  ];

  for (const binding of expectedBindings) {
    assert.ok(gisContent.includes(binding), `CampusGisMap must contain binding: ${binding}`);
  }

  // Verify essential bidirectional pathway edges
  const expectedEdges = [
    "['node_0', 'node_3']",
    "['node_3', 'node_4']",
    "['node_4', 'node_2']",
    "['node_2', 'node_1']",
    "['node_4', 'node_5']",
    "['node_3', 'node_6']",
    "['node_6', 'node_7']",
    "['node_7', 'node_8']",
    "['node_8', 'node_9']",
    "['node_9', 'node_11']",
    "['node_11', 'node_12']",
    "['node_11', 'node_13']",
    "['node_13', 'node_14']",
    "['node_15', 'node_16']",
    "['node_16', 'node_17']",
    "['node_33', 'node_32']",
    "['node_32', 'node_31']",
    "['node_31', 'node_5']",
    "['node_31', 'node_30']",
    "['node_30', 'node_25']",
    "['node_27', 'node_25']",
    "['node_26', 'node_25']",
    "['node_25', 'node_28']",
    "['node_28', 'node_29']",
    "['node_25', 'node_24']",
    "['node_24', 'node_5']",
    "['node_24', 'node_23']",
    "['node_23', 'node_22']",
    "['node_22', 'node_21']",
    "['node_18', 'node_34']",
  ];

  for (const edge of expectedEdges) {
    assert.ok(gisContent.includes(edge), `MEWAR_CAMPUS_GRAPH.edges must contain "${edge}"`);
  }

  console.log('✅ Ground-Truth 2D Campus Road Graph: All 35 nodes, location bindings, and pathway edges verified.');
});
