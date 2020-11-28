import fs from "fs/promises";
import genereate from "./generate";

it("should generate a list of videos", async () => {
  const path = "/mnt/c/Users/ngira/Desktop/gopro/test";
  await genereate(path);

  const file = await fs.readFile(`${path}/project.json`);
  expect(file.toString()).toMatchInlineSnapshot(`"{}"`);
});
