import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
// Reuse starlight-blog's own RSS generator so the feed body (content:encoded,
// descriptions, ordering, links, trailing-slash handling) stays identical to the
// plugin. This file-based route overrides the plugin's injected `/posts/rss.xml`
// and post-processes the XML to add a per-item thumbnail, which the plugin never
// emits — so RSS readers/aggregators have nothing to show as a thumbnail.
import { GET as pluginRSS } from 'starlight-blog/routes/rss'

// Media RSS namespace — https://www.rssboard.org/media-rss
const MEDIA_NS = 'http://search.yahoo.com/mrss/'

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

function mimeFor(url: string): string {
  const clean = url.split(/[?#]/)[0].toLowerCase()
  const dot = clean.lastIndexOf('.')
  const ext = dot === -1 ? '' : clean.slice(dot)
  return MIME_BY_EXT[ext] ?? 'image/png'
}

// Extract a thumbnail from a post's `cover` frontmatter, if set. Handles both the
// single-image shape (`{ image }`) and the light/dark shape, and both string paths
// and processed local assets (`ImageMetadata`, which exposes `.src`).
function coverImage(data: Record<string, unknown>): string | undefined {
  const cover = data['cover'] as Record<string, unknown> | undefined
  if (!cover) return undefined
  const img = cover['image'] ?? cover['light'] ?? cover['dark']
  if (typeof img === 'string') return img
  if (img && typeof img === 'object' && typeof (img as { src?: unknown }).src === 'string') {
    return (img as { src: string }).src
  }
  return undefined
}

function toAbsolute(url: string, site: URL): string {
  if (/^https?:\/\//.test(url)) return url
  return new URL(url, site).href
}

// Fallback: the first `<img>` embedded in the rendered post. The plugin already
// rewrote these to absolute URLs inside the (HTML-escaped) content:encoded block.
function firstContentImage(item: string): string | undefined {
  const encoded = item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)
  const haystack = encoded ? encoded[1] : item
  const match = haystack.match(/&lt;img\b[\s\S]*?src=&quot;(.*?)&quot;/i)
  return match?.[1]
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const GET: APIRoute = async (context) => {
  const site = context.site
  if (!site) return pluginRSS(context)

  // The plugin resolves the feed's entries from the `prefix` param, so we must
  // pass `prefix: 'posts'`. Override only `params` while forwarding the rest of
  // the context lazily via the prototype — spreading `context` would eagerly
  // evaluate getters like `clientAddress`, which throw in a prerendered route.
  const pluginContext = Object.create(context, {
    params: { value: { prefix: 'posts' }, enumerable: true },
  })
  const response = await pluginRSS(pluginContext)
  let xml = await response.text()

  // Map each post id to its (absolute) cover-image URL, when a cover is set.
  const posts = await getCollection('docs', (entry) => entry.id.startsWith('posts/'))
  const coverById = new Map<string, string>()
  for (const post of posts) {
    const cover = coverImage(post.data as Record<string, unknown>)
    if (cover) coverById.set(post.id, toAbsolute(cover, site))
  }

  // Declare the Media RSS namespace on the root element.
  if (!xml.includes('xmlns:media=')) {
    xml = xml.replace('<rss ', `<rss xmlns:media="${MEDIA_NS}" `)
  }

  xml = xml.replace(/<item>[\s\S]*?<\/item>/g, (item) => {
    if (item.includes('<enclosure')) return item

    const link = item.match(/<link>(.*?)<\/link>/)?.[1] ?? ''
    let image: string | undefined
    for (const [id, url] of coverById) {
      if (link.includes(`/${id}/`) || link.endsWith(`/${id}`)) {
        image = url
        break
      }
    }
    image ??= firstContentImage(item)
    if (!image) return item

    const type = mimeFor(image)
    const url = escapeAttr(image)
    const media =
      `<enclosure url="${url}" type="${type}" length="0"/>` +
      `<media:content url="${url}" medium="image" type="${type}"/>` +
      `<media:thumbnail url="${url}"/>`

    return item.replace('</item>', `${media}</item>`)
  })

  return new Response(xml, { headers: response.headers })
}
