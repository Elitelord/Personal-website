import type { Project } from './types'
import { cache } from 'react'
import { unstable_cache } from 'next/cache';

const Projects: Project[] = [
  {
    title: 'X11 on iOS',
    description: 'Patched, compiled, and packaged X11 for iOS devices.',
    href: '/blog/X11',
    role: 'Creator',
    years: ['2020'],
    type: 'project'
  }

]

export const getProjects = cache(async (): Promise<Project[]> => {
  if (process.env.NODE_ENV === 'production' && !process.env.GITHUB_TOKEN) {
    throw new Error(
      'No GITHUB_TOKEN provided. Generate a personal use token on GitHub.'
    )
  }

  const withStars = unstable_cache(async () => await Promise.all(
    Projects.map(async (proj) => {
      const split = proj.href?.split('/')
      if (!split) {
        return proj
      }

      //[ 'https:', '', 'github.com', 'maxleiter', 'jsontree' ]
      if (split[2] === 'github.com') {
        const user = split[3]
        const repo = split[4]
        const fetchUrl =
          process.env.NODE_ENV === 'production'
            ? `https://api.github.com/repos/${user}/${repo}`
            : 'http://localhost:3000/mock-stars-response.json'
        const { stargazers_count, message } = await (
          await fetch(fetchUrl, {
            headers: {
              Authorization: process.env.GITHUB_TOKEN ?? '',
            },
            cache: 'force-cache'
          })
        ).json()

        // rate limited
        if (!stargazers_count && message) {
          console.warn(`Rate limited or error: ${message}`)
          return proj
        }

        return {
          ...proj,
          stars: stargazers_count,
        }
      }
      return proj
    })
  ),
    ['projects'],
    {
      revalidate: 60 * 60 * 24 // 24 hours
    }
  )

  return await withStars()
})
