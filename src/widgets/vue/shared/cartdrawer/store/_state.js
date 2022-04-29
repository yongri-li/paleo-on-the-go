const state = {
  cartItems: {
    box: [],
    general: []
  },
  sizeSelected: {},
  routeProduct: {}
}

export default () => ({ ...state })

///////////let bundle = window.Scoutside.bundle || {}
// bundle = Object.assign(
//   {
//     sizes: [],
//     collections: [],
//     prebuilt: {
//       content: {},
//       items: []
//     },
//     filters: []
//   },
//   bundle
// )
// console.log(bundle)

// const prebuiltItemsParsed = bundle.prebuilt.items.map(({ bundlename, products }) => {
//   const splitProducts = products.replace(/\n/g, ',').split(',')
//   const productsParse = []
//   splitProducts.forEach(product => {
//     const length = productsParse.length
//     if (product.includes('size-')) {
//       productsParse.push({
//         size: product.replace('size-', ''),
//         list: []
//       })
//     } else if (product.includes('x')) {
//       productsParse[length - 1].list.push(product)
//     }
//   })
//   return {
//     bundlename,
//     products: productsParse
//   }
// })

// const state = {
//   sizes: bundle.sizes,
//   collections: bundle.collections,
//   filters: bundle.filters,
//   prebuilt: {
//     content: bundle.prebuilt.content,
//     items: prebuiltItemsParsed
//   },
//   cart: {
//     items: [],
//     addons: [],
//     pdp: []
//   },
//   modal: {
//     settings: {
//       open: false,
//       params: {},
//       cancel: () => {
//         console.log('close the modal')
//       },
//       continue: () => {}
//     },
//     component: false,
//     content: {
//       title: '',
//       description: ''
//     }
//   }

// }

// export default () => ({ ...state })
