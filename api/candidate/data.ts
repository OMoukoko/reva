import { isAdmin } from '../auth/data'

const pg = require('../pg')

export const getCandidates = async (user: {
  id: string
  // eslint-disable-next-line camelcase
  roles: { role_id: string }[]
}) => {
  let query = `
  SELECT 
    c.candidate, 
    ci.id as city_id, 
    ci.label as city_label, 
    ci.region as city_region, 
    di.id as diplome_id, 
    di.label as diplome_label, 
    MAX(c.created_at) as last_created_at
  FROM candidate_answers c
  INNER JOIN cities ci ON c.candidate->>'cohorte' = ci.id::text
  INNER JOIN diplomes di ON c.candidate->>'diplome' = di.id::text
  `
  const parameters = []
  if (!isAdmin(user.roles.map((r) => r.role_id))) {
    query = `${query} 
    INNER JOIN cohortes_diplomes_cities cdc ON ci.id = cdc.city_id AND di.id = cdc.diplome_id
    INNER JOIN users_cohortes uc ON uc.cohorte_id = cdc.cohorte_id AND uc.user_id = $1`
    parameters.push(user.id)
  }

  query = `
    ${query}
    GROUP BY c.candidate, ci.id, ci.label, ci.region, di.id, di.label
    ORDER BY c.candidate->>'lastname'
    `

  const { rows } = await pg.query(query, parameters)

  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return rows.map((r: any) => ({
    ...r.candidate,
    cohorte: {
      id: r.cohorte_id,
      label: r.cohorte_label,
      region: r.cohorte_region,
    },
    diplome: {
      id: r.diplome_id,
      label: r.diplome_label,
    },
    lastCreatedAt: r.last_created_at.toLocaleDateString('fr-FR', dateOptions),
  }))
}
