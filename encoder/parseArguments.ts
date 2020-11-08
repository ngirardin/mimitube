export interface ArgumentsValid {
  action: "generate" | "encode";
  path: string;
}

export interface ArgumentsError {
  error: string;
}

type Arguments = ArgumentsValid | ArgumentsError;

export default (argv: string[]): Arguments => {
  const action = argv[1];
  const path = argv[2];

  if (!action) {
    return { error: "Missing action" };
  }

  if (!path) {
    return { error: "Missing path" };
  }

  if (action === "generate") {
    return { action: "generate", path };
  }

  if (action === "encode") {
    return { action: "encode", path };
  }

  return { error: `Invalid action, must be either "generate" or "encode"` };
};
