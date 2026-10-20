type StaticConfig = { basePath: string; enquiryEndpoint: string; siteUrl: string };

// The build injects public routing configuration for this repository.
declare const __KUBHEXA_STATIC_CONFIG__: StaticConfig;
const config: StaticConfig = __KUBHEXA_STATIC_CONFIG__;

export const enquiryEndpoint = config.enquiryEndpoint;
export const siteUrl = config.siteUrl;
export function sitePath(path: string) {
  return `${config.basePath}${path.replace(/^\/+/, "")}`;
}
