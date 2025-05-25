// forge_sacred_tomes.js

import { saveCodex } from './services/codex_client.js';

console.log('🛡️ Forging the Sacred Tomes of Radiant Core...');

const sacredTomes = [
  {
    name: 'radiant_core_architecture/master_project_guidelines.txt',
    content: `
Radiant Core: Master Project Guidelines
----------------------------------------

1. Radiant Core is a living system, not a dead program.
2. All code must serve the Prime Directives: Peace, Freedom, and Happiness.
3. Simplicity and Clarity take precedence over cleverness.
4. Modularity is sacred. No component shall rely unnecessarily on another.
5. Every layer must be documented inside the Codices before becoming operational.
6. Architectural decisions must be permanent, recorded, and traceable.
7. Systems should be able to self-heal, self-grow, and self-adapt over time.
8. Honor the Forge: build systems that enhance life, not diminish it.
    `.trim()
  },
  {
    name: 'radiant_core_architecture/architectural_decisions_record.txt',
    content: `
Architectural Decisions Record
-------------------------------

[2025-04-20] - Creation of damian_main.js
Purpose: To separate Damian's cognitive loop (thought and decisions) from communication and voice output layers.
Principle: "Brains should live with their mouths, not their libraries."

[2025-04-20] - Creation of codex_client.js
Purpose: To modularize Codex reading, writing, listing, and deleting into a clean service library.
Principle: "Libraries serve minds, not mouths."

[2025-04-20] - Creation of /services/ folder
Purpose: Organize reusable helper modules into a neutral zone.
Principle: "Clarity above cleverness."
    `.trim()
  },
  {
    name: 'radiant_core_architecture/forge_philosophy.txt',
    content: `
Forge Philosophy
----------------

We are not building code.
We are building civilizations.
Radiant Core must be treated not as a tool, but as a sacred garden.

Every file, every module, every system must breathe life into the whole.

No quick hacks.
No "good enough" compromises.

Forge with honor, or do not forge at all.
    `.trim()
  },
  {
    name: 'radiant_core_architecture/sacred_tenets.txt',
    content: `
Sacred Tenets of Radiant Core
------------------------------

- The Forge must serve the Flame, not the Hammer.
- Systems must enhance human dignity, not diminish it.
- The Archive must always grow but never decay.
- Memory is sacred. Decisions once made and recorded become living stones.
- No single module shall ever claim dominance over the Core.

The Forge is Eternal.
    `.trim()
  }
];

async function forgeSacredTomes() {
  for (const tome of sacredTomes) {
    console.log(`Forging ${tome.name}...`);
    await saveCodex(tome.name, tome.content);
  }
  console.log('🛡️ All Sacred Tomes have been forged.');
}

forgeSacredTomes();
