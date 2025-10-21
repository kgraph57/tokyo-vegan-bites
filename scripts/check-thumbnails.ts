import { drizzle } from 'drizzle-orm/mysql2';
import { videos } from '../drizzle/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function checkThumbnails() {
  const v = await db.select().from(videos);
  
  console.log('\n=== VIDEO THUMBNAILS ===');
  v.forEach(vid => {
    console.log(`${vid.id}`);
    console.log(`  Thumbnail: ${vid.thumbnail}`);
    console.log(`  Title: ${vid.title}`);
    console.log('');
  });
}

checkThumbnails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

