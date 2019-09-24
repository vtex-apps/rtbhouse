import { Product } from '../typings/events'

export function getCategories(products: Product[]) {
  const [categories] = products.map(({ categories: [category] }) =>
    strNormalize(
      category
        .split('/')
        .filter(item => item)
        .join('/')
    )
  )
  return categories
}

export function createIframeTag(src: string, id?: string) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('src', src)
  id && iframe.setAttribute('id', id)
  iframe.setAttribute('width', '1')
  iframe.setAttribute('height', '1')
  iframe.setAttribute('scrolling', '1')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('style', 'display:none')
  document.body.appendChild(iframe)
}

export function strNormalize(str: string): string {
  let strNormalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return strNormalized
}
