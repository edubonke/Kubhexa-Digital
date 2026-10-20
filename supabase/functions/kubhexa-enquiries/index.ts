import { createEnquiryHandler } from "./handler.ts";

Deno.serve(createEnquiryHandler({ env: name => Deno.env.get(name), fetch: (input, init) => fetch(input, init) }));
