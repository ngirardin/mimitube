import encode from "./actions/encode";
import generate from "./actions/generate";
import parseArguments from "./parseArguments";

const app = () => {
  // Remove the first argument that's added when ran from ts-node
  const args = parseArguments(process.argv.slice(1));

  if ("error" in args) {
    console.error(args.error);
    process.exit(1);
  }

  if (args.action === "generate") {
    return generate(args.path);
  }

  if (args.action === "encode") {
    return encode(args.path);
  }

  throw new Error("Unknown action");
};

app();
