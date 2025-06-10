export const MONSTER_IMAGES: Record<string, string> = {
  'Infernal Demon': '/images/monsters/infernalDemon.png',
  'Ice Wyrm': '/images/monsters/iceWyrm.png',
  'Stone Golem': '/images/monsters/golem.png',
  'Forest Ent': '/images/monsters/forestEnt.png',
};

export function getMonsterImage(name: string): string {
  // Remove " Lv XXX" from the name, with or without extra spaces
  const cleanName = name.replace(/\s*Lv\s*\d+$/, '').trim();

  return MONSTER_IMAGES[cleanName] || '/images/monsters/golem.png';
}

