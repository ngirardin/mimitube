import genereate from "./generate";

it("should generate a list of videos", async () => {
  expect(await genereate("/mnt/c/Users/ngira/Desktop/gopro/test")).toMatchInlineSnapshot(`
    Array [
      Object {
        "attributes": Array [
          "isDrone",
        ],
        "file": "DJI_0009.MP4",
      },
      Object {
        "attributes": Array [
          "isDrone",
        ],
        "file": "DJI_0009_speed10x.mp4",
      },
      Object {
        "attributes": Array [],
        "file": "GX013175.MP4",
      },
      Object {
        "attributes": Array [],
        "file": "GX013175_speed10x.mp4",
      },
      Object {
        "attributes": Array [],
        "file": "VID_20201107_130823.mp4",
      },
      Object {
        "attributes": Array [],
        "file": "VID_20201107_130823_speed10x.mp4",
      },
    ]
  `);
});
