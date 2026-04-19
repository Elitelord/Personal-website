import fs from "fs";
import { join } from "path";

export default function handler(req, res) {
  const portfolioData = join(process.cwd(), "/data/portfolio.json");
  if (process.env.NODE_ENV === "development") {
    if (req.method === "POST") {
      try {
        fs.writeFileSync(
          portfolioData,
          JSON.stringify(req.body, null, 4),
          "utf-8"
        );
        res.status(200).json({ status: "success" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to write file" });
      }
    } else {
      res
        .status(200)
        .json({ name: "This route works in development mode only" });
    }
  }
}
