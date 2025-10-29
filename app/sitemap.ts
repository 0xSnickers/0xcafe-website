import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.0xcafe.fun'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          zh: `${baseUrl}/zh`,
        },
      },
    },
    {
      url: `${baseUrl}/gas`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/gas`,
          zh: `${baseUrl}/zh/gas`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}

