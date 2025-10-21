import { drizzle } from 'drizzle-orm/mysql2';
import { videos, restaurants } from '../drizzle/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function checkDb() {
  const v = await db.select().from(videos);
  const r = await db.select().from(restaurants);
  
  console.log('Videos:', v.length);
  console.log('Restaurants:', r.length);
  
  if (v.length > 0) {
    console.log('\nSample video:', JSON.stringify(v[0], null, 2));
  }
  
  if (r.length > 0) {
    console.log('\nSample restaurant:', JSON.stringify(r[0], null, 2));
  }
}

checkDb()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

