import express from "express"; 
import { PreinterviewSchema } from "./types";
import axios from "axios";
import cors from "cors";
const app = express(); 
app.use(express.json());
app.use(cors());


app.post("/api/v1/pre-interview", async (req, res) => {
  try {
    const { success, data } = PreinterviewSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Incorrect body",
      });
    }

    const githubUsername = data.githubURL.split("/").pop();

    const userRepos = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`
    );

    const filteredRepos = userRepos.data.map((x: any) => ({
      description: x.description,
      name: x.name,
      fullName: x.full_name,
      starCount: x.stargazers_count,
    }));

    return res.status(200).json({
      repos: filteredRepos,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "Server error",
    });
  }
});





const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});