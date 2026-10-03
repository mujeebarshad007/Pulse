import "server-only";
import type { PoolClient } from "pg";
import { ServiceError } from "./errors.ts";

/** Database-backed fixed windows shared by all serverless instances. */
export async function takeLimit(
  client: PoolClient,
  key: string,
  maximum: number,
  seconds: number,
) {
  const result = await client.query(
    `INSERT INTO pulse.request_limits(key,bucket,hits)
     VALUES($1,floor(extract(epoch FROM now())/$3)::bigint,1)
     ON CONFLICT(key) DO UPDATE SET
       bucket=EXCLUDED.bucket,
       hits=CASE WHEN request_limits.bucket=EXCLUDED.bucket THEN request_limits.hits+1 ELSE 1 END
     WHERE request_limits.bucket<>EXCLUDED.bucket OR request_limits.hits<$2
     RETURNING hits`,
    [key, maximum, seconds],
  );
  if (!result.rowCount)
    throw new ServiceError(
      "RATE_LIMITED",
      "This service has reached its request limit. Please try again later.",
    );
}
