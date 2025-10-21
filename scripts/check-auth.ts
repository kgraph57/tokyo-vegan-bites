import * as db from "../server/db";

async function checkAuth() {
  const users = await db.getAllUsers();
  console.log("Users:", JSON.stringify(users, null, 2));
  
  const bookmarks = await db.getAllBookmarks();
  console.log("\nBookmarks:", JSON.stringify(bookmarks, null, 2));
}

checkAuth().catch(console.error).finally(() => process.exit(0));
