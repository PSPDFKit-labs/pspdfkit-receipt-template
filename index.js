const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const formData = new FormData();

formData.append(
  "instructions",
  JSON.stringify({
    parts: [
      {
        html: "index.html",
        assets: [
          "style.css",
          "Inter-Regular.ttf",
          "Inter-Medium.ttf",
          "Inter-Bold.ttf",
          "SpaceMono-Regular.ttf",
          "logo.svg",
        ],
      },
    ],
  })
);
formData.append("index.html", fs.createReadStream("index.html"));
formData.append("style.css", fs.createReadStream("style.css"));
formData.append("Inter-Regular.ttf", fs.createReadStream("Inter-Regular.ttf"));
formData.append("Inter-Medium.ttf", fs.createReadStream("Inter-Medium.ttf"));
formData.append("Inter-Bold.ttf", fs.createReadStream("Inter-Bold.ttf"));
formData.append(
  "SpaceMono-Regular.ttf",
  fs.createReadStream("SpaceMono-Regular.ttf")
);
formData.append("logo.svg", fs.createReadStream("logo.svg"));
// console.log(formData); // iterable object

(async () => {
  try {
    const response = await axios.post(
      "https://api.pspdfkit.com/build",
      formData,
      {
        headers: formData.getHeaders({
          Authorization: "Bearer YOUR_API_KEY_HERE", // replace with your API key
        }),
        responseType: "stream",
      }
    );

    // console.log("response data", response.data);
    response.data.pipe(fs.createWriteStream("result.pdf"));
  } catch (e) {
    const errorString = await streamToString(e.response.data);
    console.log(errorString);
  }
})();

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
