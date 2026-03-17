require("dotenv").config();
const mongoose = require("mongoose");
const Project  = require("./models/Project");
 
mongoose.connect(process.env.MONGO_URI);
 
mongoose.connection.once("open", async () => {
  const projects = await Project.find({}).lean();
  projects.forEach(function(p) {
    var hasLong = p.longDescription && p.longDescription.length > 0;
    console.log(
      p.title,
      "| longDescription:",
      hasLong ? p.longDescription.slice(0, 60) + "..." : "MISSING"
    );
  });
  process.exit(0);
});
 