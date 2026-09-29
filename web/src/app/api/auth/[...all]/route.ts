import { authConfigured, getAuth } from "@/server/auth";
import { failure, json } from "@/server/http";
export const runtime = "nodejs";
async function handler(request: Request) {
  if (!authConfigured())
    return json(
      {
        error:
          "Google sign-in is not configured yet. The owner must complete the deployment setup.",
      },
      503,
    );
  try {
    return await getAuth().handler(request);
  } catch (error) {
    return failure(error);
  }
}
export { handler as GET, handler as POST };
