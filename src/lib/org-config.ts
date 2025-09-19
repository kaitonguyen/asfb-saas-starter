export type OrgConfig = {
  labelSingular: string
  labelPlural: string
  route: string
}

const DEFAULTS: OrgConfig = {
  labelSingular: 'Organization',
  labelPlural: 'Organizations',
  route: '/organizations',
}

export function getOrgConfig(): OrgConfig {
  const labelSingular = process.env.NEXT_PUBLIC_ORG_LABEL_SINGULAR || DEFAULTS.labelSingular
  const labelPlural = process.env.NEXT_PUBLIC_ORG_LABEL_PLURAL || DEFAULTS.labelPlural
  const route = process.env.NEXT_PUBLIC_ORG_ROUTE || DEFAULTS.route
  return { labelSingular, labelPlural, route }
}
