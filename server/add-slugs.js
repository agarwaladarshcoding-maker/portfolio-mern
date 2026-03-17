// Run from server/ directory:
// node add-slugs.js

require("dotenv").config();
const mongoose  = require("mongoose");
const GrindPost = require("./models/GrindPost");

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB\n");

  try {
    // Find all posts without a slug
    const posts = await GrindPost.find({ slug: { $exists: false } });
    console.log("Posts without slug:", posts.length);

    for (var post of posts) {
      var slug = "day-" + post.dayNumber;

      // Check if slug already taken (in case of duplicate day numbers)
      var existing = await GrindPost.findOne({ slug: slug, _id: { $ne: post._id } });
      if (existing) {
        // Append ID suffix to make unique
        slug = "day-" + post.dayNumber + "-" + post._id.toString().slice(-4);
      }

      await GrindPost.updateOne({ _id: post._id }, { $set: { slug: slug } });
      console.log("✓ Day", post.dayNumber, "→", slug);
    }

    // Also fix any posts where slug is null/empty
    const nullSlugs = await GrindPost.find({
      $or: [{ slug: null }, { slug: "" }]
    });

    for (var post of nullSlugs) {
      var slug = "day-" + post.dayNumber;
      await GrindPost.updateOne({ _id: post._id }, { $set: { slug: slug } });
      console.log("✓ Fixed null slug Day", post.dayNumber, "→", slug);
    }

    console.log("\nAll slugs generated. Your posts are now at /grind/day-N");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
});