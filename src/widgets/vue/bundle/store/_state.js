const {
  sizes,
  collections,
  prebuilt
} = window.Scoutside.bundle

const prebuiltItemsParsed = prebuilt.items.map( ({bundlename, products}) => {
  const splitProducts = products.replace(/\n/g,',').split(',')
  const productsParse = []
  splitProducts.forEach(product => {
    const length = productsParse.length
    if(product.includes('size-')) {
      productsParse.push({
        size: product.replace('size-',''),
        list: []
      })
    }
    else if(product.includes('x')){
      productsParse[length-1].list.push(product)
    }
  })
  return {
    bundlename,
    products: productsParse
  }
})

const state = {
  sizes,
  collections,
  prebuilt: {
    content: prebuilt.content,
    items: prebuiltItemsParsed
  },
  cart: {
    items: [],
    addons: []
  },
  modal: {
    settings: {
      open: false,
      params: {},
      cancel: () => { console.log('close the modal') },
      continue: () => {}
    },
    component: false,
    content: {
      title: '',
      description: ''
    }
  }
}

export default () => ({ ...state })