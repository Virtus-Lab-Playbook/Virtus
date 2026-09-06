export type Work = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  serviceSlugs: string[];
  outcome: string;
  summary: string;
};

/**
 * Published client work. Empty until real case studies are approved — the plan
 * forbids inventing metrics or client results, so detail pages render an
 * honest forthcoming panel while this list is empty for a service.
 */
export const works: Work[] = [];

export function worksForService(serviceSlug: string): Work[] {
  return works.filter((work) => work.serviceSlugs.includes(serviceSlug));
}
