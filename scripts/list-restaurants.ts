import { drizzle } from 'drizzle-orm/mysql2';
import { restaurants, videos } from '../drizzle/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function listRestaurants() {
  const r = await db.select().from(restaurants);
  const v = await db.select().from(videos);
  
  console.log('\n=== RESTAURANTS ===');
  r.forEach(rest => console.log(`${rest.id} - ${rest.name}`));
  
  console.log('\n=== VIDEOS ===');
  v.forEach(video => console.log(`${video.id} -> ${video.restaurantId} (${video.title})`));
}

listRestaurants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

