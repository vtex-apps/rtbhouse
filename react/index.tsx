import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'
import { getCategories, createIframeTag } from './helpers/index'

function handleMessages(e: PixelMessage) {
  const { rtbhouseId } = window
  switch (e.data.eventName) {
    case 'vtex:pageInfo': {
      if (e.data.eventType !== 'homeView') break
      const iframeId = 'rtbhouse_home'
      const src = `//us.creativecdn.com/tags?id=${rtbhouseId}_home`
      const iframe = document.getElementById(iframeId)
      if (!iframe) createIframeTag(src, iframeId)
      break
    }
    case 'vtex:productView': {
      const {
        product: { productId },
      } = e.data
      if (productId)
        createIframeTag(
          `//us.creativecdn.com/tags?id=${rtbhouseId}_offer_${productId}`
        )
      break
    }
    case 'vtex:internalSiteSearchView': {
      const { products } = e.data
      const skus = products
        .map(({ productId }) => productId)
        .slice(0, 5)
        .join()
      createIframeTag(
        `//us.creativecdn.com/tags?id=${rtbhouseId}_listing_${skus}`,
        'rtbhouse_search'
      )
      break
    }
    case 'vtex:categoryView': {
      const { products } = e.data
      const categories = getCategories(products)
      createIframeTag(
        `//us.creativecdn.com/tags?id=${rtbhouseId}_category2_${categories}`,
        'rtbhouse_category'
      )
      break
    }
    case 'vtex:orderPlaced': {
      const { transactionSubtotal, transactionId, transactionProducts } = e.data
      const skus = transactionProducts.map(({ id }) => id).join()
      createIframeTag(
        `//us.creativecdn.com/tags?id=${rtbhouseId}_orderstatus2_${transactionSubtotal}_${transactionId}_${skus}`,
        'rtbhouse_purchase'
      )
      break
    }
  }
}

function handleLoad() {
  const {
    rtbhouseId,
    location: { pathname },
  } = window
  if (pathname !== '/login') return
  const iframeId = 'rtbhouse_otherPages'
  const iframe = document.getElementById(iframeId)
  if (!iframe)
    createIframeTag(
      `//us.creativecdn.com/tags?id=${rtbhouseId}&ncm=1`,
      iframeId
    )
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
  window.addEventListener('load', handleLoad)
}
